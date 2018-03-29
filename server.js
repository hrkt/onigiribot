'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 8080;

const config = {
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.SECRET_KEY
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

const onigiriDic = [
	{
		name: 'もっと大きなおにぎり　カツカレー',
		url: 'http://www.lawson.co.jp/recommend/original/detail/1326772_1996.html',
		price: 248,
		calory: 425	
	},
	{
		name: 'おにぎりランチ',
		url: 'http://www.lawson.co.jp/recommend/original/detail/1326771_1996.html',
		price: 360,
		calory: 513
	},
	{
		name: '手巻おにぎり　シーチキンマヨネーズ',
		url: 'http://www.lawson.co.jp/recommend/original/detail/1311653_1996.html',
		price: 116,
		calory: 252
	},
	{
		name: '手巻おにぎり　おかか',
		url: 'http://www.lawson.co.jp/recommend/original/detail/1311623_1996.html',
		price: 110,
		calory: 193
	},
	{
		name: '手巻おにぎり　紀州南高梅',
		url: 'http://www.lawson.co.jp/recommend/original/detail/1311624_1996.html',
		price: 120,
		calory: 177
	},
	{
		name: '新潟コシヒカリおにぎり　いくら醤油漬',
		url: 'http://www.lawson.co.jp/recommend/original/detail/1323264_1996.html',
		price: 198,
		calory: 207
	},
	{
		name: '韓国風海苔手巻　豚キムチ',
		url: 'http://www.lawson.co.jp/recommend/original/detail/1321304_1996.html',
		price: 135,
		calory: 188
	}
];

function getOnigiriRecommendation() {
	const index = Math.floor( Math.random() * onigiriDic.length);
	return onigiriDic[index];
}

const responseWords = [
	'、そうですね。ところで',
	'...なるほど。さて話はかわりますが',
	'って、まじっすか！じゃ、',
	'！すごーい。だったら',
	'。そうなんですねー。話は変わりますが'
];

function getResponseWord() {
	const index = Math.floor( Math.random() * responseWords.length);
	return responseWords[index];
}

function handleEvent(event) {
  console.log(event);
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
 
  const onigiri = getOnigiriRecommendation();
  const sentMessage = event.message.text;
  const botMessage = sentMessage + getResponseWord() + onigiri.name + 'を食べませんか？' + onigiri.url 
	+ '(' + onigiri.price + '円で、' + onigiri.calory + 'kcalです)';

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: botMessage
  });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);
