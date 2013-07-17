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
      return (text.match(/^hello$/) || text.match(/^hey bot$/));
    },
    command: function(data) {
      bot.speak('Hey! How are ya @'+data.name+'?');
    },
    help: 'say hello or whatever',
    show: false
  },
  {
    name: 'funny',
    match: function(text){
      return (text.toLowerCase().match(/^haha$/)|| text.match(/^hehe$/) || text.match(/^lol$/));
    },
    command: function(data){
      //bot.speak('What\'s so funny @'+data.name+'?');
      var rand = Math.floor((Math.random()*100)+1);
      bot.speak(WHATS_FUNNY[rand % WHATS_FUNNY.length].replace(/%%/g, '@'+data.name));
    },
    help: 'laugh at something',
    show: false
  },
  {
    name: 'thanks',
    match: function(text){
      return (text.toLowerCase().match(/thank.*(spice|)bot/));
    },
    command: function(data){
      var rand = Math.floor((Math.random()*100)+1);
      bot.speak(YOURE_WELCOME[rand % YOURE_WELCOME.length].replace(/%%/g, '@'+data.name));
    },
    help: 'tell spice bot thank you',
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
  { // TODO: Needs a fix because sometimes there are 11 PMs sent
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
    name: 'smile',
    match: function(text) {
      return text.match(/^bot smile$/);
    },
    command: function(data) {
      bot.speak('(́◉◞౪◟◉‵)');
    },
    help: 'make me smile',
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
		message = message.replace(/^(bot|@spice_bot) say"/, '');
		message = message.replace(/"/, '');
	  }
	  else{
		var message = message.replace(/^bot say /, '');
	  }
      bot.speak(message);
    },
    help: 'make the bot say stuff using \"\'s',
    show: false
  },
  {
    name: 'weather',
    match: function(text) {
      return text.match(/^bot weather$/);
    },
    command: function(data) {
      bot.request("http://query.yahooapis.com/v1/public/yql?q=select%20item.description%20from%20weather.forecast%20where%20woeid%3D%202357536&format=json&diagnostics=false", function(error, response, body) {
        var json = JSON.parse(body);
        var weather = json.query.results.channel.item.description.match(/(Current Conditions[\s\S]*?)<a/i)[1].replace(/(<\/?B\s*?>|\n|\r)/gi, '').split(/<\/?BR.*?>/i)
        weather.forEach(function(item){
          setTimeout(function() {bot.speak(item);}, 200) 
          // console.log(item);
          setTimeout(function() {}, 200)
        });
      });


    },
    help: 'get the weather in Austin',
    show: true
  },
  {
    name: 'pizza',
    match: function(text) {
      return text.match(/^bot (get)?.*pizza( now!?)?$/);
    },
    command: function(data) {
      bot.speak("Oh yeah!  Gettin' some 'Za");
      bot.sleep(200);
      bot.speak("Uhhh... from where:");
      bot.request("http://query.yahooapis.com/v1/public/yql?q=select%20Title%20from%20local.search%20where%20zip%3D'78730'%20and%20query%3D'pizza'&format=json&callback=", function(error, response, body) {
        var json = JSON.parse(body);
        json.query.results.Result.forEach(function(item){
          var pizza = item.Title;
          bot.speak("- " + pizza);  
          // bot.sleep(200);
        });
      });


    },
    help: 'get us some Pizza!!!',
    show: true
  },
  {
    name: 'asian',
    match: function(text) {
      return text.match(/^bot (get)?.*asian( food)?( now!?)?$/);
    },
    command: function(data) {
      bot.speak("Alright!  Time for good Asian food!");
      bot.sleep(200);
      bot.speak("Uhhh... from where:");
      bot.request("http://query.yahooapis.com/v1/public/yql?q=select%20Title%20from%20local.search%20where%20zip%3D'78730'%20and%20query%3D'asian'&format=json&callback=", function(error, response, body) {
        var json = JSON.parse(body);
        json.query.results.Result.forEach(function(item){
          var asian = item.Title;
          bot.speak("- " + asian);
          // bot.sleep(200);
        });
      });


    },
    help: 'get us some Asian Food!!!',
    show: true
  },
  
  { 
    name: 'roll',
    match: function(text) {
      return text.match(/^bot roll$/);
    },
    command: function(data) {
      var number = Math.floor(Math.random()*100)+1
      setTimeout(function() {setTimeout( function() {setTimeout(function(){bot.speak("Rolling my 100-sided die...");}, 200)
      setTimeout(function(){bot.speak("And... it's...");}, 700)}, 200)
      setTimeout(function(){bot.speak(number);}, 1000)}, 100)
    },
    help: 'roll 100-sided die',
    show: true
  },
  {
    name: 'stocks',
    match: function(text) {
      return text.match(/^bot (market|stocks)$/);
    },
    command: function(data) {
      bot.request("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20google.igoogle.stock%20where%20stock%20in%20('.DJI'%2C'.INX'%2C'.ixic')&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=", function(error, response, body) {
        var json = JSON.parse(body);
        var quotes = json.query.results.xml_api_reply;
        quotes.forEach(function(item){
          var company = item.finance.company.data.replace(' Industrial Average', '').replace('Composite', '');
          bot.speak(company+':  $'+item.finance.last.data);
          bot.sleep(200);
        });
      });
    },
    help: 'Check the stock market indices',
    show: true
  },
  {
    name: 'stock',
    match: function(text) {
      return text.match(/^bot stock \S+$/);
    },
    command: function(data) {
      var stock = data.text.replace(/^bot stock /, '');
      bot.request("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20google.igoogle.stock%20where%20stock%20=%20'" + stock + "'%3B&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=", function(error, response, body) {
        var json = JSON.parse(body);
        var quotes = json.query.results.xml_api_reply.finance;
        var company = quotes.company.data;
        var price = quotes.last.data;
        bot.speak(company + ': $' + price);
      });
    },
    help: 'Check a stock price',
    show: true
  },
  {
    name: 'moon',
    match: function(text) {
      return text.match(/^bot moon(\s?phase)?$/);
    },
    command: function(data) {
      var now = new Date();
      var req = {
        uri: 'http://aa.usno.navy.mil/cgi-bin/aa_pap.pl',
        form: {
          xxy: now.getFullYear(),
          xxm: now.getMonth() + 1,
          xxd: now.getDate(),
          st: 'TX',
          place: 'austin',
          FFX: 1,
          ID: 'AA',
          uri: 'http://aa.usno.navy.mil/cgi-bin/aa_pap.pl'
        }
      };
      bot.request.post(req, function(error, response, body) {
        // Hack: too late at night to do this correctly...need to refactor
        var phase = body.replace(/(\s+|&nbsp;)/g, ' ').replace(/.*Phase of the Moon on.*?:\s*/, '').replace(/(\s*disk.*)/, '').replace(" of the Moon\'s", '');
        bot.speak('The moon is:');
        bot.sleep(200);
        bot.speak(phase);
      });
    },
    help: 'Check the current phase of the moon',
    show: true
  },
  {
    name: 'time',
    match: function(text) {
      return text.match(/^bot (time|date)$/);
    },
    command: function(data) {
      bot.speak(new Date());
    },
    help: 'get the current date/time',
    show: true
  }];
