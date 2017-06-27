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
            temp = body.current.temp_c;
                session.send("It's " + temp + " degrees celsius in " + city_name);
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
            temp = body.current.temp_c;
                session.send("It's " + temp + " degrees celsius in " + city_name);
        });
    }
]);

intents.matches('smalltalk.greetings.hello',function(session, args){
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

intents.matches('news.search', [
    function (session, args) {
        var source = builder.EntityRecognizer.findEntity(args.entities, 'news-source');
        if (source) {
            var source_name = source.entity;
            var url = "https://newsapi.org/v1/articles?source=" + source_name + "&sortBy=latest&apiKey=11236426c78341079081cb95797f80ae";
            request(url, function (error, response, body) {
                body = JSON.parse(body);
                title = body.articles.title;
                session.send(source-name + ": " + title);
            });
        } else {
            builder.Prompts.text(session, 'Which source do you want the news from (BBC,CNN,Fox etc.?');
        }
    },
    function (session, results) {
        var source_name = results.response;
        var url = "https://newsapi.org/v1/articles?source=" + source_name + "&sortBy=latest&apiKey=11236426c78341079081cb95797f80ae";
        request(url, function (error, response, body) {
            body = JSON.parse(body);
            title = body.articles.title;
            session.send(source - name + ": " + title);
        });
    }
]);


intents.onDefault(function(session){
                session.send("Sorry...can you please rephrase?");
            });

