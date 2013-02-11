var Bot  = require('./index');
var creds = require('./info');

// experimental, need Angel to verify if this works...
require('./commands.js');

var VERBOSE = false;
var VOTED = false;
var VOTE_UP = 1;
var autobop = false;
var autoskip = false;
var user_count = 0;
var dj_count = 0;
var djs = [];
var moderators = [];
var botOnSet = -1;
creds = new Creds();
bot = new Bot(creds.AUTH, creds.USERID, creds.ROOMID);

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

bot.on('speak', function (data) {
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
});

function updateDjs() {
bot.roomInfo(true, function(data) {
	 /* Update the list since we are here */
		djs = data.room.metadata.djs;
		dj_count = djs.length;
		moderators = data.room.metadata.moderator_id;});
		botOnSet = djs.indexOf(bot.userId)
};

function noOnePlaysAlone() {
	updateDjs();
	if( dj_count == 1 && botOnSet == -1) {
		bot.addDj();
		bot.speak('hey dont play alone, ill join you');
	}
	if(dj_count > 2) {
		bot.remDj();
	}
	if(dj_count <= 1 && botOnSet > -1) {
		bot.remDj();
	}
}

bot.on('newsong', function (data) {
	var vote_count = data.room.metadata.upvotes;
	if (vote_count >= VOTE_UP) {
		bot.vote('up');
	}
	
	if(autobop)  {bot.bop();}
	if(autoskip) {bot.skip();}
	sleep(30000);
	noOnePlaysAlone();
	
	if(VERBOSE) {
		bot.speak('ab' + autobop);
		bot.speak('as' + autoskip);
		
		bot.speak('dj count' + dj_count);
		bot.speak('am i up?' + botOnSet);
	}
});


bot.on('roomChanged', function(data) {
	bot.speak('so quiet');
});

bot.on('nosong', function(data) {
	bot.speak('so quiet');
});

bot.on('registered', function(data) {
	var user = data.user[0];
	if (user.name.match(/evil_mace/)) {
		bot.speak("Sup evil_mace");
	}
	if (user.name.match(/ttstats_\d+/)) {
		bot.bootUser(user.userid,'This Bot does not like other Bots');
	}
});

