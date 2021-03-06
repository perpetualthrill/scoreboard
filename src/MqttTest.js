var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://localhost');

client.on('message', function (topic, message) {
  console.log(message.toString())
  client.end()
})

leftBpm = 40;
rightBpm = 40;

client.on('connect', function () {
  console.log("connected");
  measureHearts();
});

function measureHearts() {
  leftBpm += (Math.random() * 2 - 1) * 2 + 0.5;
  leftBpm = Math.max(40, leftBpm);
  leftBpm = Math.min(128, leftBpm);
  leftBpm = Math.round(leftBpm);

  rightBpm += (Math.random() * 2 - 1) * 3 + 2;
  rightBpm = Math.max(40, rightBpm);
  rightBpm = Math.min(128, rightBpm);
  rightBpm = Math.round(rightBpm);

  client.publish("asOne/score/leftBPM", new Buffer([leftBpm]));
  client.publish("asOne/score/rightBPM", new Buffer([rightBpm]));
  client.publish("asOne/score/timer", new Buffer([51]));
  client.publish("asOne/score/logo", new Buffer([255, 255, 0]));
  setTimeout(measureHearts, 1000);
}

//setTimeout(function(){
//  client.end();
//}, 1000);

