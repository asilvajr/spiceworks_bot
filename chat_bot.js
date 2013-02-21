var Bot  = require('./index');
var creds = require('./info');

// experimental, need Angel to verify if this works...
require('./commands.js');

VERBOSE = false;
M_VERBOSE = false;
VOTED = false;
VOTE_UP = 1;
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
djs = [];
moderators = [];

bot = new Bot(AUTH, USERID, ROOMID);

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function applyCommands(data) {
  // Get the data
  var name = data.name;
  var text = data.text;
  
  // loop over commands and execute them if there's a match
  for(i = 0; i < commands.length; i++) {
    var command = commands[i];
    if(command.match(text)) {
      command.command(data);
    }
  }
}

bot.on('speak', applyCommands);
bot.on('pmmed', applyCommands);

function updateDjs() {
bot.roomInfo(true, function(data) {
	 /* Update the list since we are here */
		djs = data.room.metadata.djs;
		dj_count = djs.length;
		moderators = data.room.metadata.moderator_id;});
		botSetIndex = djs.indexOf(botUserId)
};

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
	if(M_VERBOSE) {
		bot.speak('ab' + autobop);
		bot.speak('as' + autoskip);
		bot.speak("cid:"+currentDj);
		bot.speak("bui:"+botUserId);
		bot.speak('djc' + dj_count);
		bot.speak('bos' + botOnSet);
	}
	
	if(dj_count == 1 && !botOnSet) {
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
	if(dj_count==1) {
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
	if (user.name.match(/evil_mace/)) {
		bot.speak("Sup evil_mace");
	}
	if (user.name.match(/ttstats_\d+/)) {
		bot.bootUser(user.userid,'For Company Privacy');
	}
});

bot.on('deregistered',function(data){
	if(VERBOSE) bot.speak("deregistered");
	user_count--;
});

bot.on('updated_votes',function(data){
	if(VERBOSE) bot.speak("update votes");	
});

bot.on('snagged',function(data){
	if(VERBOSE) bot.speak("snagged");	
});

bot.on('endsong',function(data){
	if(VERBOSE) bot.speak("endsong");
	if(jumpOffAfterSong) {
		bot.remDj();
		botOnSet = false;
		//if(dj_count > 1 || dj_count <= 3) {
		//	bot.remDj();
		//	jumpOffAfterSong=false;
		//}
	}
});

bot.on('rem_dj',function(data){
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
			bot.remDj();
			botOnSet=false;
		}
	}
	if(dj_count==1 && !botOnSet){ //only one user is playing, bot jumps on
		bot.addDj();
		botOnSet=true;
	}
	var user = data.user[0];
	if (user.name.match(/evil_mace/)) {
		bot.speak("Don't stop now @evil_mace");
	}
	if (user.name.match(/Eric S \(Dev\)/)) {
		bot.speak("Awww, is that the best you've got? @Eric");
	}
	if (user.name.match(/Eric Fr/)) {
		bot.speak("Really? You're giving up so soon @EFW?");
	}

	if(dj_count < 5 && user_count > dj_count) {
		bot.speak("OK, who's gonna step up and DJ now?  Come on listeners - we need some music!")
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
			bot.remDj();
			botOnSet=false;}
	}

	var user = data.user[0];
	if (user.name.match(/evil_mace/)) {
		bot.speak("Kick it @evil_mace");
	}
	if (user.name.match(/Eric S \(Dev\)/)) {
		bot.speak("Alright, here we go, @Eric S (Dev)");
	}
	if (user.name.match(/Eric Fr/)) {
		bot.speak("Nothing too slow now, ok @EFW?");
	}
	
});


