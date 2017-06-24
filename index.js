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
    appId: 'e02a9235-4dda-41f3-b756-d3055cd39a22',
    appPassword: 'hWNEV3JcqF37L8xFuTXo2Lv' });
var bot = new builder.UniversalBot(connector);
var recognizer = new apiairecognizer('ed7772a94ebd4ab09d84792bbecd9693');
var intents = new builder.IntentDialog({recognizers: [recognizer] });
bot.dialog('/', intents);
intents.matches('whatisWeather', [function (session, args) { var city = builder.EntityRecognizer.findEntity(args.entities, 'cities'); if (city) { var city_name = city.entity; var url = "http://api.apixu.com/v1/current.json?key=202c78c8ac8c42aab09154737172406&q=" + city_name; request(url, function (error, response, body) { body = JSON.parse(body); temp = body.current.temp_c; session.send("It's " + temp + " degrees celsius in " + city_name); }); } else { builder.Prompts.text(session, 'Which city do you want the weather for?'); } }, function (session, results) { var city_name = results.response; var url = "http://api.apixu.com/v1/current.json?key=202c78c8ac8c42aab09154737172406&q=" + city_name; request(url, function (error, response, body) { body = JSON.parse(body); temp = body.current.temp_c; session.send("It's " + temp + " degrees celsius in " + city_name); }); }]);
