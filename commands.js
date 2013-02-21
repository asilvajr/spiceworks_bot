// This file is all of the bot's commands
//
// Commands have the following variables available to them:
// - name: the name of the user who spoke the command
// - text: the text spoken by the user
// - bot:  the bot object

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
      return (text.match(/^hello$/) || text.match(/^hey bot$/) || text.match(/^hi.*quik_mace/));
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
    name: 'drink safely',
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
      return text.match(/^bot info$/);
    },
    command: function(ddata) {
      bot.roomInfo(true, function(data) {
		var userid = ddata.userid;
        var user_count = data.room.metadata.djs.length;
        var vote_count = data.room.metadata.upvotes;
        bot.pm('ab' + autobop, userid);
        bot.pm('as' + autoskip, userid);
        bot.pm('djc' + user_count, userid);
        bot.pm('vc' + vote_count, userid);
        bot.pm('botid'+bot.userId, userid);
        bot.pm('bos'+ botOnSet, userid);
        bot.pm('djl' + djs, userid);
      });
    },
    help: 'presents help commands in a PM',
    show: false
  },
    {
    name: 'status',
    match: function(text) {
      return text.match(/^bot status$/);
    },
    command: function(ddata) {
      bot.roomInfo(true, function(data) {
		var userid = ddata.userid;
		bot.pm("botID" + botUserId,userid);
        bot.pm("bcp" + botCurrentlyPlaying,userid);
		bot.pm("joas" + jumpOffAfterSong,userid);
		bot.pm("bos" + botOnSet,userid);
		bot.pm("bsi" + botSetIndex,userid);
      });
    },
    help: 'presents bot status in a PM',
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
      return text.match(/^bot skip(\ssong)?/);
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
      return text.match(/^bot autobop(\son|\soff)?/);
    },
    command: function(data) {
		autobop= !autobop;
     if(!data.text.match(/(on|off)/)) {
		 if(autobop){
			bot.speak('All songs are awesome');
			bot.vote('up');
		  }
		  else{
			bot.speak('ok good, my neck is starting to hurt');
		  }
	}
	  if(data.text.match(/off/)){
		bot.speak('ok good, my neck is starting to hurt');
		autobop=false;
	  }
	  if(data.text.match(/on/)){
		bot.speak('All songs are awesome');
        bot.vote('up');
		autobop=true;
	  }
    },
    help: 'toggle autobop',
    show: true
  },
  {
    name: 'autoskip',
    match: function(text) {
      return text.match(/^bot autoskip(\son|\soff)?/);
    },
    command: function(data) {
      autoskip = !autoskip;
	  if(!data.text.match(/(on|off)/)){
		if(autoskip) {
			bot.speak("fine... I'll skip");
			bot.skip();
		}
		else {
			bot.speak('playing mee tunes!');
		}
	 }
	  if(data.text.match(/on/)) {
		autoskip=true;
		bot.speak("fine... I'll skip");
		bot.skip();
	  }
	  if(data.text.match(/off/)) {
		autoskip=false;
		bot.speak('playing mee tunes!');
	  }
    },
    help: 'toggle autobot',
    show: true
  },
  {
    name: 'help',
    match: function(text) {
      return text.match(/^bot help$/);
    },
    command: function(data) {
      bot.pm('Commands:',data.userid);
      // loop over these commands and speak them
      for(i = 0; i < commands.length; i++) {
        var command = commands[i];
        if (command.show) {
          bot.pm('|' + command.name + ': ' + command.help,data.userid);
        }
      }
    },
    help: 'list commands',
    show: false
  },
  {
    name: 'flip',
    match: function(text) {
      return text.match(/^bot (table)?\s?flip$/);
    },
    command: function(data) {
      bot.speak('(╯°□°）╯︵ ┻━┻');
    },
    help: 'flip table',
    show: true
  },
  {
    name: 'disapprove',
    match: function(text) {
      return text.match(/^bot (disapprove|glare)$/);
    },
    command: function(data) {
      bot.speak('ಠ_ಠ');
    },
    help: 'disapprove of stuff',
    show: true
  },
  {
    name: 'say',
    match: function(text) {
      return text.match(/^bot say/);
    },
    command: function(data) {
	  var message = data.text;
	  if (message.match(/\".*\"/)){
		message = message.replace(/^bot say "/, '');
		message = message.replace(/"/, '');
	  }
	  else{
		var message = message.replace(/^bot say /, '');
	  }
      bot.speak(message);
    },
    help: 'make the bot say stuff using \"\'s',
    show: false
  }
];