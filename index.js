'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();


app.set('post', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}));

const server = app.listen(process.env.PORT || 5000, () => {
	console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
app.get('/', (req, res) => {
	res.send('hello');
});

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'EAAEbPuiypIIBAKCBpdeGtfPMkb4EesweP8XvFreoCNcNZA2zqNu7fSi2BvNfCFt1BNikCybwW9HK3hL9zK0jDlZCf6AyO0KQvMqFGcGwXF2BCDh1JWBEIzIA3u1gZAjx8TXNINZCy9MltpNCwJciAImYAJvFx6CKaHgX9Hjat0X5GRzB8qNd') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});


function sendMessage(event) {
	let sender = event.sender.id;
	let text = event.message.text;

	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token: 'EAAEbPuiypIIBAN7A7bPgfUtMZAQ7ahMv4dbZBtXa2ZBd4nEhxr8Rljf4MGv3Uq1a7TZAo5S5DAkQM3wRyfz9J2kzWLBg18Uwc1nKPZAZCZAoHozXn36zw03wUUlzCp6rKq8TLBPbSoRHrQejBOP4EYvgbd6T0LnhwoUIXisA7jJsNJlgxDbtQXG'},
		method: 'POST',
		json: {
			recipient: {id: sender},
			message: {text: text}
		}
	}, function(error, response) {
		if (error) {
			console.log(error);
		} else if (response.body.error) {
			console.log('Error:', response.body.error);
		}
	});
}