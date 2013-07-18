var Bot  = require('ttapi');
var creds = require('./info');
var sleep = require('sleep');

require('./commands.js');
require('./messages.js');

VERBOSE = false;
VOTED = false;
VOTE_UP = 1;
PCT_RESP_QUIT_DJ = 50;
PCT_RESP_START_DJ = 50;
botUserId = USERID;
autobop = false;
autoskip = false;

botCurrentlyPlaying = false;
jumpOffAfterSong = false;
botOnSet = false;
botSetIndex = -1;
currentDj=0;
user_count = 0;
dj_count = 0;
up_votes=0;
down_votes=0;
snag_count=0;


//song_info
artist="";
song="";
album="";

//room_info
dj_name="";
djs = [];
moderators = [];
commandLock = false;
commandCallbacks = [];

bot = new Bot(AUTH, USERID, ROOMID);
bot.request = require("request");
 
function guessingGame(data){
	guessingGameOn = true;
	guessingGameNumber = Math.floor(Math.random()*10)+1;
	bot.speak("Alright @"+data.name+", let's play the guessing game!");
	bot.speak("I'm thinking of a number 1-10... Can you guess it?");
	bot.on('speak', findNumber);
}

function findNumber(data){
    if (guessingGameOn){
	    if (data.text.match(/quit guessing game/)){
	      bot.speak("Aww, @"+data.name+". I guess we'll stop playing...");
	      guessingGameOn = false;
	    }
	    else if (parseInt(data.text) == guessingGameNumber){
	      bot.speak("Yay @"+data.name+"! You guessed the correct number! The correct number was "+guessingGameNumber+".");
	      guessingGameOn = false;
	    }
	}
 }

function applyCommands(data) {
  // Get the data
  var name = data.name;
  var text = data.text;
  if (data.text.match(/^bot guessing game$/)){
  	guessingGame(data);
  }
  else{
  // loop over commands and execute them if there's a match
	  for(i = 0; i < commands.length; i++) {
	    var command = commands[i];
	    if(command.match(text)) {
	      command.command(data);
	    }
	  }
	}
}

// This is where the magic happens: Spin locking commands so that he doesn't interleave command responses
commandCallbacks.push(bot.on('speak', applyCommands));
commandCallbacks.push(bot.on('pmmed', applyCommands));
while(commandCallbacks.length > 0){
	while (commandLock){ // spin lock 
	}
	var thisCallback = commandCallbacks.shift();
	commandLock = true;
	thisCallback;
	commandLock = false;
}
	
function updateDjs() {
bot.roomInfo(true, function(data) {
	 /* Update the list since we are here */
		djs = data.room.metadata.djs;
		dj_count = djs.length;
		moderators = data.room.metadata.moderator_id;});
		botSetIndex = djs.indexOf(botUserId)
};

function songStats(data){
	up_votes = data.room.metadata.upvotes;
	down_votes = data.room.metadata.downvotes;
	var user = data.room.metadata.current_song.djname;
	var song = data.room.metadata.current_song.metadata.song;
	var artist = data.room.metadata.current_song.metadata.artist;
	var stats_string ="@"+user+""+ artist+" - "+song + ": :heart:" + snag_count + ":thumbsup:" + up_votes + ":thumbsdown: " + down_votes;
	up_votes=0;
	down_votes=0;
	snag_count=0;
	return stats_string;
}

bot.on('update_votes', function(data){
	if(VERBOSE) bot.speak("update votes");
	up_votes = data.room.metadata.upvotes;
	down_votes = data.room.metadata.downvotes;
});

bot.on('newsong', function(data){
	if(VERBOSE) bot.speak("newsong");
	//var vote_count = data.room.metadata.upvotes;
	currentDj = data.room.metadata.current_dj;
	
	if(currentDj==botUserId) 
		{botCurrentlyPlaying=true;}
	else 
		botCurrentlyPlaying=false;
	if(botCurrentlyPlaying) 
		{if(autoskip) {bot.skip();}}
	if(autobop)  {bot.bop();}
	
	if(dj_count === 1 && !botOnSet && !botCurrentlyPlaying) {
		bot.addDj();
		botOnSet = true;
		bot.speak("Oh, didn't see ya playin my bad");
	}
});


bot.on('roomChanged', function(data) {
	bot.speak("Annnnd Im back");
	djs = data.room.metadata.djs;
	users = data.users;
	
	user_count = users.length;
	dj_count = djs.length;
	if(dj_count == 1) {
		bot.addDj();
		botOnSet=true;
		bot.speak("You've been playing alone :( I'll join")
	}
});

bot.on('nosong', function(data) {
	bot.speak('so quiet...');
});

bot.on('registered', function(data) {
	if(VERBOSE) bot.speak("registered");
	user_count++;
	var user = data.user[0];
	if (user.name.match(/ttstats_\d+/)) {
		bot.bootUser(user.userid,'For Company Privacy');

	} else {
		if(user.name !== 'spice_bot') {
			bot.speak("Hey there, @" + user.name + "!\nType \"bot help\" for assistance.");
		}
	}
});

bot.on('deregistered',function(data){
	if(VERBOSE) bot.speak("deregistered");
	user_count--;
});


bot.on('snagged',function(data){
	if(VERBOSE) bot.speak("snagged");	
	snag_count++;
});

bot.on('endsong',function(data){
	if(VERBOSE) bot.speak("endsong");
	if(jumpOffAfterSong) {
		botOnSet = false;
		bot.remDj();
		//if(dj_count > 1 || dj_count <= 3) {
		//	bot.remDj();
		//	jumpOffAfterSong=false; 
		//}
	}
	bot.speak(songStats(data));
});

bot.on('rem_dj',function(data){
	var user = data.user[0];
	if(VERBOSE) bot.speak("rem_dj");	
	dj_count--;
	if(dj_count<0){
		dj_count=0;
		bot.speak("Something went wrong djc<0 was");
	}
	if (dj_count<=1 && botOnSet) { //bot is the only toon playing, bot jumps off
		if(botCurrentlyPlaying) 
			{jumpOffAfterSong=true;} 
		else {
			botOnSet=false;
			bot.remDj();
		}
	}
	
	if(dj_count==1 && !botOnSet){ //only one user is playing, bot jumps on
		bot.addDj();
		botOnSet=true;
	}

	var spoke = false;
	var rand = Math.floor((Math.random()*100)+1);
	if (rand < PCT_RESP_QUIT_DJ) {
		
		if(user.name !== 'spice_bot') {
			bot.speak(QUIT_DJ[rand % QUIT_DJ.length].replace(/%%/g, '@'+user.name));
			spoke = true;
		}
	}

	if(dj_count < 5 && user_count > dj_count + 1 && !spoke && user.name !== 'spice_bot') {
		bot.speak("OK, who's gonna step up and DJ now?  Come on listeners - we need some music!");
	}
});


bot.on('add_dj',function(data){
	if(VERBOSE) bot.speak("add_dj");	
	dj_count++;
	if(dj_count>5){
		dj_count=5;
		bot.speak("Something went wrong djc>5 was");
	}
	if(dj_count == 1 && !botOnSet) { //only one user is playing, bot jumps on
		bot.addDj();
		botOnSet = true;
		bot.speak("Jumping on until some others joins");
	}
	if(dj_count >3 && botOnSet) { //more than enough users are playing, bot jumps off.
		if(botCurrentlyPlaying) //if he is playing, he jumps off after
			{jumpOffafterSong = true;}
		else{ 
			botOnSet=false;}
			bot.remDj();
			
	}

	var spoke = false;
	var rand = Math.floor((Math.random()*100)+1);
	if (rand < PCT_RESP_START_DJ) {
		var user = data.user[0];
		if(user.name !== 'spice_bot') {
			bot.speak(START_DJ[rand % QUIT_DJ.length].replace(/%%/g, '@'+user.name));
			spoke = true;
		}
	}
});


