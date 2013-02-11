var Bot  = require('./index');
var creds = require('./info');


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
//bot = new Bot(AUTH, USERID, ROOMID);
bot = new Bot(creds.AUTH, creds.USERID, creds.ROOMID);

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
    help: 'play or whatever',
	show: false
  },
  {
    name: 'hello',
    match: function(text) {
      return (text.match(/^hello$/) || text.match(/^hi.*quik_mace/));
    },
    command: function(data) {
      bot.speak('Hey! How are ya @'+data.name+'?');
    },
    help: 'say hello or whatever',
	show: false
  },
  {
	name: 'drink',
    match: function(text) {
      return (text.match(/^bot .*(beer|vodka|alcohol|drink|rum|soda|gin|tequilla)$/));
    },
    command: function(data) {
      bot.speak('@'+data.name+' get your own fraking drink!');
    },
    help: 'alcoholic',
	show: false
  },
  {
	name: 'drink classy',
    match: function(text) {
      return (text.match(/^bot.*(whiskey|wine)$/));
    },
    command: function(data) {
      bot.speak('Aren\'t you classy @'+data.name+' but no!!');
    },
    help: 'classy alcoholic',
	show: false
  },
  {
	name: 'drink classy',
    match: function(text) {
      return (text.match(/^bot get me a cab$/));
    },
    command: function(data) {
      bot.speak('@'+data.name+' srsly? youre in a company tt-room and should be workin. You arent drunk r u?');
    },
    help: 'need',
	show: false
  },
  {
    name: 'bot jump on',
    match: function(text) {
      return text.match(/^bot jump on$/);
    },
    command: function(data) {
      bot.addDj();
    },
    help: 'stage, bot starts DJing',
	show: true
  },
  {
    name: 'bot jump off',
    match: function(text) {
      return text.match(/^bot jump off$/);
    },
    command: function(data) {
      bot.remDj();
    },
    help: 'stage, bot stops DJing',
	show: true
  },
  {
    name: 'info',
    match: function(text) {
      return text.match(/^info$/);
    },
    command: function(data) {
	  bot.roomInfo(true, function(data) {
		var user_count = data.room.metadata.djs.length;
		var vote_count = data.room.metadata.upvotes;
		bot.speak('ab' + autobop);
		bot.speak('as' + autoskip);
		bot.speak('djc' + user_count);
		bot.speak('vc' + vote_count);
		bot.speak('botid'+bot.userId);
		bot.speak('bos'+botOnSet);
		for(i = 0; i < djs.length; i++) {
			bot.speak('djl' + djs);
		}
		});
	  //bot.speak('ab' + autobop);
    },
    help: 'presents help commands in a PM',
	show: false
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
    help: "adds current song to bot playlist",
	show: true
  },
  {
    name: 'bot dance',
    match: function(text) {
      return text.match(/^bot dance$/);
    },
    command: function(data) {
      bot.vote('up');
    },
    help: 'upvote the current song',
	show: true
  },
  {
    name: 'bot downvote',
    match: function(text) {
      return text.match(/^bot downvote$/);
    },
    command: function(data) {
      bot.vote('down');
    },
    help: 's the current song',
	show: true
  },
  {
    name: 'bot skip',
    match: function(text) {
      return text.match(/^bot skip$/);
    },
    command: function(data) {
      bot.skip();
    },
    help: 'skip the current song',
	show: true
  },
  {
    name: 'default response',
    match: function(text) {
      return text.match(/.*spice_bot.*/);
    },
    command: function(data) {
	  //sleep(100000);
      bot.speak('wut?');
    },
    help: 'respond to shit',
	show: false
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
	help: 'toggle autobot',
	show: true
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
	help: 'toggle autobot',
	show: true
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
		if (command.show) {
			bot.pm('-' + command.name + '-' + command.help,data.userid);
		}
      }
    },
    help: 'print out list of commands',
	show: false
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
	sleep(10000);
	sleep(10000);
	sleep(10000);
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

