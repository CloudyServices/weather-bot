var builder = require('botbuilder');
var restify = require('restify');
var apiairecognizer = require('api-ai-recognizer');
var request = require('request');
var moment = require('moment');

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
        var city = builder.EntityRecognizer.findEntity(args.entities, 'cities');
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
    function(session, args){
        var city = builder.EntityRecognizer.findEntity(args.entities, 'cities');
        if (city) {
            var city_name = city.entity;
            var url = "http://api.apixu.com/v1/forecast.json?key=202c78c8ac8c42aab09154737172406&q=" + city_name + "&days=5";
            request(url, function (error, response, body) {
                body = JSON.parse(body);
                city_proper = body.location.name;
                dateday1 = moment(body.forecast.forecastday[0].date).format('dddd');
                tempday1 = body.forecast.forecastday[0].day.maxtemp_c;
                textday1 = body.forecast.forecastday[0].day.condition.text;
                dateday2 = moment(body.forecast.forecastday[1].date).format('dddd');
                tempday2 = body.forecast.forecastday[1].day.maxtemp_c;
                textday2 = body.forecast.forecastday[1].day.condition.text;
                dateday3 = moment(body.forecast.forecastday[2].date).format('dddd');
                tempday3 = body.forecast.forecastday[2].day.maxtemp_c;
                textday3 = body.forecast.forecastday[2].day.condition.text;
                dateday4 = moment(body.forecast.forecastday[3].date).format('dddd');
                tempday4 = body.forecast.forecastday[3].day.maxtemp_c;
                textday4 = body.forecast.forecastday[3].day.condition.text;
                dateday5 = moment(body.forecast.forecastday[4].date).format('dddd');
                tempday5 = body.forecast.forecastday[4].day.maxtemp_c;
                textday5 = body.forecast.forecastday[4].day.condition.text;
                session.send(city_proper + ": <br/>" + dateday1 + ", " + tempday1 + "C, " + textday1 + ".<br/>" + dateday2 + ", " + tempday2 + "C, " + textday2 + ".<br/>" + dateday3 + ", " + tempday3 + "C, " + textday3 + ".<br/>" + dateday4 + ", " + tempday4 + "C, " + textday4 + ".<br/>" + dateday5 + ", " + tempday5 + "C, " + textday5 + ".");
            });
        } else {
            builder.Prompts.text(session, 'Which city do you want the weather for?');
        }
    },
    function (session, results) {
        var city_name = results.response;
        var url = "http://api.apixu.com/v1/forecast.json?key=202c78c8ac8c42aab09154737172406&q=" + city_name + "&days=5";
        request(url, function (error, response, body) {
            body = JSON.parse(body);
            city_proper = body.location.name;
            temp = body.current.temp_c;
            text = body.current.condition.text;
            session.send("It's " + temp + " degrees forecast celsius in " + city_proper + ", " + text + ".");
        });
    }
]);

intents.matches('whatisNews', [
    function (session, args) {
        var newssource = builder.EntityRecognizer.findEntity(args.entities, 'news-source');
        var newscategory = builder.EntityRecognizer.findEntity(args.entities, 'topic');
        session.send(newssource.entity + " " + newscategory.entity + " " + news-source + " " + topic);
        if (newssource) {
            var newssource_name = newssource.entity;
            var url = "https://newsapi.org/v1/articles?source=bbc-news&sortBy=top&apiKey=11236426c78341079081cb95797f80ae";
            request(url, function (error, response, body) {
                body = JSON.parse(body);
                newsart1 = body.articles[0].title;
                newsart2 = body.articles[1].title;
                newsart3 = body.articles[2].title;
                newsart4 = body.articles[3].title;
                session.send(newscategory + newssource_name + " Latest: <br/>- " + newsart1 + "<br/>- " + newsart2 + "<br/>- " + newsart3 + "<br/>- " + newsart4);
            });
        } else {
            builder.Prompts.text(session, 'Which city do you want the weather for?');
        }
    },
    function (session, results) {
        var city_name = results.response;
        var url = "http://api.apixu.com/v1/forecast.json?key=202c78c8ac8c42aab09154737172406&q=" + city_name + "&days=5";
        request(url, function (error, response, body) {
            body = JSON.parse(body);
            city_proper = body.location.name;
            temp = body.current.temp_c;
            text = body.current.condition.text;
            session.send("It's " + temp + " degrees forecast celsius in " + city_proper + ", " + text + ".");
        });
    }
]);

intents.matches('smalltalk.greetings.hello', function (session, args) {
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
    session.send('v0.89 (01/07/2017) - Current Weather, 5 day Forecast Weather, Smalltalk.');
                });

intents.onDefault(function(session){
                session.send("Sorry...can you please rephrase?");
            });

