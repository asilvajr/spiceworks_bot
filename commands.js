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
    help: 'toggle autobop',
    show: true
  },
  {
    name: 'autoskip',
    match: function(text) {
      return text.match(/^bot autoskip/);
    },
    command: function(data) {
      autoskip = !autoskip;
      if(autoskip) {
        bot.speak("fine... I'll skip");
        bot.skip();
      }
      else {
        bot.speak('playing my tunes!');
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
      return text.match(/^bot flip$/);
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
      return text.match(/^bot disapprove$/);
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
      var stuff = data.text.replace(/^bot say /, '');
      bot.speak(stuff);
    },
    help: 'make the bot say stuff',
    show: false
  }
];
