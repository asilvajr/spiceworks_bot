var Bot    = require('../index');
//var Functions = require('../functions.js')
var WOO_ROOM = '4e091b2214169c018f008ea5';
var SPICE_ROOM = '4f9ea3caaaa5cd2af400043d';
var AUTH = 'devYecrJOgDHbNcBfURZconK';
var ROOMID = SPICE_ROOM;
var USERID = '50e71e01aaa5cd33869946fc';

var VOTED = false;
var VOTE_UP = 1;
var autobop = false;
var autoskip = false;
var user_count = 0;
var dj_count = 0;
var djs = [];
var moderators = [];
var botOnSet = -1;

bot = new Bot(AUTH, USERID, ROOMID);

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

commands = [
  {
    name: 'play',
    match: function(text) {
      return (text.match(/^\/play$/) || text.match(/^play with me$/) || text.match(/^hop on .*mace$/));
    },
    command: function(data) {
      bot.speak('Yeah, not doing that yet. Maybe next time');
    },
    help: 'play or whatever'
  },
  {
    name: 'hello',
    match: function(text) {
      return (text.match(/^hello$/) || text.match(/^hi.*quik_mace/));
    },
    command: function(data) {
      bot.speak('Hey! How are ya @'+data.name+'?');
    },
    help: 'say hello or whatever'
  },
  {
    name: 'bot jump on',
    match: function(text) {
      return text.match(/^bot jump on$/);
    },
    command: function(data) {
      bot.addDj();
    },
    help: 'make the bot jump up'
  },
  {
    name: 'bot jump off',
    match: function(text) {
      return text.match(/^bot jump off$/);
    },
    command: function(data) {
      bot.remDj();
    },
    help: 'make the bot stop DJing'
  },
  {
    name: 'info',
    match: function(text) {
      return text.match(/^info$/);
    },
    command: function(data) {
	  bot.roomInfo(true, function(data) {
		var user_count = data.room.metadata.djs.length;
		bot.speak('ab' + autobop);
		bot.speak('as' + autoskip);
		bot.speak('djc' + user_count);
		});
	  //bot.speak('ab' + autobop);
    },
    help: 'make the bot stop DJing'
  },
  
  {
    name: 'bot add song',
    match: function(text) {
      return text.match(/^bot add song$/);
    },
    command: function(data) {
      bot.roomInfo(true, function(data) {
        var newSong = data.room.metadata.current_song._id;
        var songName = data.room.metadata.current_song.metadata.song;
        bot.vote('up');
        bot.playlistAdd(newSong);
        bot.speak('Added '+ songName);
      });
    },
    help: "add a song to the bot's playlist"
  },
  {
    name: 'bot dance',
    match: function(text) {
      return text.match(/^bot dance$/);
    },
    command: function(data) {
      bot.vote('up');
    },
    help: 'upvote the current song'
  },
  {
    name: 'bot downvote',
    match: function(text) {
      return text.match(/^bot downvote$/);
    },
    command: function(data) {
      bot.vote('down');
    },
    help: 'downvote the current song'
  },
  {
    name: 'bot skip',
    match: function(text) {
      return text.match(/^bot skip$/);
    },
    command: function(data) {
      bot.skip();
    },
    help: 'skip the current song'
  },
  {
    name: 'idk',
    match: function(text) {
      return text.match(/.*spice_bot.*/);
    },
    command: function(data) {
	  //sleep(100000);
      bot.speak('wut?');
    },
    help: 'respond to shit'
  },
  {
	name: 'autobop',
	match: function(text) {
		return text.match(/^bot autobop/);
	},
	command: function(data) {
		autobop= !autobop;
		if(autobop) {
			bot.speak('All songs are awesome');
			bot.vote('up');
		}
		else{
			bot.speak('ok good, my neck is starting to hurt');
		}
	},
	help: 'toggle autobot'
  },
  {
	name: 'autoskip',
	match: function(text) {
		return text.match(/^bot autoskip/);
	},
	command: function(data) {
		autoskip= !autoskip;
		if(autoskip) {
			bot.speak('fine... ill skip');
			bot.skip();
		}
		else{
			bot.speak('playing my tunes!');
		}
		
	},
	help: 'toggle autobot'
  },
  {
    name: 'bot help',
    match: function(text) {
      return text.match(/^bot help$/);
    },
    command: function(data) {
      bot.pm('Commands:',data.userid);
      // loop over these commands and speak them
      for(i = 0; i < commands.length; i++) {
        var command = commands[i];
        bot.pm(command.name + ' - ' + command.help,data.userid);
      }
    },
    help: 'print out list of commands'
  }
];

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
		botOnSet = djs.indexOf(bot.userid)
};

function noOnePlaysAlone() {
	updateDjs();
	if( dj_count == 1 && botOnSet> -1) {
		bot.addDj();
		bot.speak('hey dont play alone, ill join you');
	}
	if(dj_count > 2) {
		bot.remDj();
	}
	if(dj_count <= 1 && botOnSet > -1) {
		bot.remDj();
	}
	bot.speak('dj count' + dj_count);
	bot.speak('am i up?' + botOnSet);
}

bot.on('newsong', function (data) {
	var vote_count = data.room.metadata.upvotes;
	if (vote_count >= VOTE_UP) {
		bot.vote('up');
	}
	bot.speak('ab' + autobop);
	bot.speak('as' + autoskip);
	
	if(autobop)  {bot.bop();}
	if(autoskip) {bot.skip();}
	sleep(10000);
	sleep(10000);
	sleep(10000);
	noOnePlaysAlone();
	
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

