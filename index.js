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

intents.matches('whatisWeatherForecast', [
    function (session, args) {
        var city = builder.EntityRecognizer.findEntity(args.entities, 'cities');
        if (city) {
            var city_name = city.entity;
            var url = "http://api.apixu.com/v1/forecast.json?key=202c78c8ac8c42aab09154737172406&q=" + city_name + "&days=3";
            request(url, function (error, response, body) {
                body = JSON.parse(body);
                city_proper = body.location.name;
                dateday1 = body.forecast.forecastday[0].date;
                tempday1 = body.forecast.forecastday[0].day.maxtemp_c;
                textday1 = body.forecast.forecastday[0].day.condition.text;
                dateday2 = body.forecast.forecastday[1].date;
                tempday2 = body.forecast.forecastday[1].day.maxtemp_c;
                textday2 = body.forecast.forecastday[1].day.condition.text;
                dateday3 = body.forecast.forecastday[2].date;
                tempday3 = body.forecast.forecastday[2].day.maxtemp_c;
                textday3 = body.forecast.forecastday[2].day.condition.text;
                session.send(city_proper + ": " + dateday1 + ", " + tempday1 + "C, " + textday1 + ".  " + dateday2 + ", " + tempday2 + "C, " + textday2 + ".  " + dateday3 + ", " + tempday3 + "C, " + textday3 + ".");
            });
        } else {
            builder.Prompts.text(session, 'Which city do you want the weather for?');
        }
    },
    function (session, results) {
        var city_name = results.response;
        var url = "http://api.apixu.com/v1/forecast.json?key=202c78c8ac8c42aab09154737172406&q=" + city_name + "&days=3";
        request(url, function (error, response, body) {
            body = JSON.parse(body);
            city_proper = body.location.name;
            temp = body.current.temp_c;
            text = body.current.condition.text;
            session.send("It's " + temp + " degrees forecast celsius in " + city_proper + ", " + text + ".");
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

intents.matches('features', function(session){
    session.send('v0.88 (01/07/2017) - Current Weather, Forecast Weather, Smalltalk.');
                });

intents.onDefault(function(session){
                session.send("Sorry...can you please rephrase?");
            });

