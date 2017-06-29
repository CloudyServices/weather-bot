var builder = require('botbuilder');
var restify = require('restify');
var apiairecognizer = require('api-ai-recognizer');
var request = require('request');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: '7a125a96-2286-44c4-bb95-851b84011dfc',
    appPassword: '54gL7hkjhk0EreZ9Gkb2jdo'
});
        
// Listen for messages from users 
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector);

var recognizer = new apiairecognizer("ed7772a94ebd4ab09d84792bbecd9693");
var intents = new builder.IntentDialog({
                recognizers: [recognizer]
});

bot.dialog('/',intents);

intents.matches('whatisWeather',[
    function(session,args){
        var city = builder.EntityRecognizer.findEntity(args.entities,'cities');
        if (city){
            var city_name = city.entity;
            var url = "http://api.apixu.com/v1/current.json?key=202c78c8ac8c42aab09154737172406&q=" + city_name;
            request(url,function(error,response,body){
                body = JSON.parse(body);
                city_proper = body.location.name;
                temp = body.current.temp_c;
                text = body.current.condition.text;
                session.send("It's " + temp + " degrees celsius in " + city_proper + ", " + text + ".");
            });
        }else{
                builder.Prompts.text(session, 'Which city do you want the weather for?');
            }
    },
    function(session,results){
        var city_name = results.response;
        var url = "http://api.apixu.com/v1/current.json?key=202c78c8ac8c42aab09154737172406&q=" + city_name;
            request(url,function(error,response,body){
                body = JSON.parse(body);
                city_proper = body.location.name;
                temp = body.current.temp_c;
                text = body.current.condition.text;
                session.send("It's " + temp + " degrees celsius in " + city_proper + ", " + text + ".");
        });
    }
]);

intents.matches('smalltalk.greetings.hello', function(session, args){
    var fulfillment = builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');
    if (fulfillment){
        var speech = fulfillment.entity;
        session.send(speech);
    }else{
                session.send('Sorry...not sure how to respond to that');
            }
});

intents.matches('smalltalk.greetings.bye', function (session, args) {
    var fulfillment = builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');
    if (fulfillment) {
        var speech = fulfillment.entity;
        session.send(speech);
    } else {
        session.send('Sorry...not sure how to respond to that');
    }
});

intents.matches('features' {
    session.send('Version. 0.86 (29/06/2017)'),
    session.send('- Current weather'),
    session.send('- Smalltalk'),
});

intents.onDefault(function(session){
                session.send("Sorry...can you please rephrase?");
            });

