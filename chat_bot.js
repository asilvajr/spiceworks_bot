var Bot    = require('../index');
//var Functions = require('../functions.js')
var WOO_ROOM = '4e091b2214169c018f008ea5';
var SPICE_ROOM = '4f9ea3caaaa5cd2af400043d';
var AUTH = 'devYecrJOgDHbNcBfURZconK';
var ROOMID = SPICE_ROOM;
var USERID = '50e71e01aaa5cd33869946fc';

var VOTED = false;
var VOTE_UP = 5;

var bot = new Bot(AUTH, USERID, ROOMID);

bot.on('speak', function (data) {
  // Get the data
  var name = data.name;
  var text = data.text;

  // Respond to "/hello" command
  
  if (text.match(/^\/play$/) || text.match(/^play with me$/) || text.match(/^hop on .*mace$/) ){
	//TODO: add play functionality
	bot.speak('Yeah, not doing that yet. Maybe next time');
  }
  
  if (text.match(/^hello$/) || text.match(/^hi.*quik_mace/)) {
    bot.speak('Hey! How are ya @'+name+'?');
  }
  
  if (text.match(/^bot jump on$/)) {
	bot.addDj();
  }
  
  if (text.match(/^bot jump off$/)) {
	bot.remDj();
  }
  
  if (text.match(/^bot add song$/)) {
	bot.roomInfo(true, function(data) {
		var newSong = data.room.metadata.current_song._id;
		var songName = data.room.metadata.current_song.metadata.song;
		bot.vote('up');
		bot.playlistAdd(newSong);
		bot.speak('Added '+ songName);
		});
  }
  
  if (text.match(/^bot dance$/)){
	bot.vote('up');
  }
  
  if (text.match(/^bot dont$/)) {
	bot.vote('down');
  }
  
  if (text.match(/^bot skip song$/)){
	bot.skip();
	}
	
	if (text.match(/.*quik_mace.*/)){
		bot.speak('wut?');
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



