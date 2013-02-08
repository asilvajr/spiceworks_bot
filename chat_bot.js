var Bot    = require('../index');
//var Functions = require('../functions.js')
var WOO_ROOM = '4e091b2214169c018f008ea5';
var SPICE_ROOM = '4f9ea3caaaa5cd2af400043d';
var AUTH = 'devYecrJOgDHbNcBfURZconK';
var ROOMID = SPICE_ROOM;
var USERID = '50e71e01aaa5cd33869946fc';

var VOTED = false;
var VOTE_UP = 5;

bot = new Bot(AUTH, USERID, ROOMID);

commands = [
  {
    name: 'play',
    match: function(text) {
      return (text.match(/^\/play$/) || text.match(/^play with me$/) || text.match(/^hop on .*mace$/));
    },
    command: function() {
      bot.speak('Yeah, not doing that yet. Maybe next time');
    },
    help: 'play or whatever'
  },
  {
    name: 'hello',
    match: function(text) {
      return (text.match(/^hello$/) || text.match(/^hi.*quik_mace/));
    },
    command: function() {
      bot.speak('Hey! How are ya @'+name+'?');
    },
    help: 'say hello or whatever'
  },
  {
    name: 'bot jump on',
    match: function(text) {
      return text.match(/^bot jump on$/);
    },
    command: function() {
      bot.addDj();
    },
    help: 'make the bot jump up'
  },
  {
    name: 'bot jump off',
    match: function(text) {
      return text.match(/^bot jump off$/);
    },
    command: function() {
      bot.remDj();
    },
    help: 'make the bot stop DJing'
  },
  {
    name: 'bot add song',
    match: function(text) {
      return text.match(/^bot add song$/);
    },
    command: function() {
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
    command: function() {
      bot.vote('down');
    },
    help: 'upvote the current song'
  },
  {
    name: 'bot downvote',
    match: function(text) {
      return text.match(/^bot downvote$/);
    },
    command: function() {
      bot.vote('down');
    },
    help: 'downvote the current song'
  },
  {
    name: 'bot skip',
    match: function(text) {
      return text.match(/^bot skip$/);
    },
    command: function() {
      bot.skip();
    },
    help: 'skip the current song'
  },
  {
    name: 'idk',
    match: function(text) {
      return text.match(/.*spice_bot.*/);
    },
    command: function() {
      bot.speak('wut?');
    },
    help: 'respond to shit'
  },
  {
    name: 'bot help',
    match: function(text) {
      return text.match(/^bot help$/);
    },
    command: function() {
      bot.speak('Commands:');
      // loop over these commands and speak them
      for(i = 0; i < commands.length; i++) {
        bot.speak(command.name + ' - ' + command.help);
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
      command.command();
    }
  }
});

bot.on('newsong', function (data) {
	var vote_count = data.room.metadata.upvotes
	if (vote_count >= VOTE_UP) {
		bot.vote('up');
	}
});

bot.on('registered', function(data) {
	var user = data.user[0];
	if (user.name.match(/evil_mace/)) {
		bot.speak("Sup evil_mace");
	}
	if (user.name.match(/ttstats_\d+/)) {
		bot.bootUser(user.userid,'This Bot does not like bots Bots');
	}
});

