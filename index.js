var request = require('request');
var builder = require('botbuilder');
var apiairecognizer = require('api-ai-recognizer');
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
var recognizer = new apiairecognizer('ed7772a94ebd4ab09d84792bbecd9693');
var intents = new builder.IntentDialog({recognizers: [recognizer] });
bot.dialog('/', intents);
intents.matches('whatisWeather', [function (session, args) { var city = builder.EntityRecognizer.findEntity(args.entities, 'cities'); if (city) { var city_name = city.entity; var url = "http://api.apixu.com/v1/current.json?key=202c78c8ac8c42aab09154737172406&q=" + city_name; request(url, function (error, response, body) { body = JSON.parse(body); temp = body.current.temp_c; session.send("It's " + temp + " degrees celsius in " + city_name); }); } else { builder.Prompts.text(session, 'Which city do you want the weather for?'); } }, function (session, results) { var city_name = results.response; var url = "http://api.apixu.com/v1/current.json?key=202c78c8ac8c42aab09154737172406&q=" + city_name; request(url, function (error, response, body) { body = JSON.parse(body); temp = body.current.temp_c; session.send("It's " + temp + " degrees celsius in " + city_name); }); }]);
