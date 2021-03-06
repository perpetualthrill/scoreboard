import WiringDiagram from './WiringDiagram.js'
import OpcHost from './OpcHost.js'
import MqttDirectOutput from './MqttDirectOutput.js'
import MultiOutput from './MultiOutput.js'

var program = require('commander');

program
  .option('-m, --mqtt <hostname>', 'MQTT host')
  .option('-o, --opc <opc>', 'Open Pixel Control host')
  .option('-f, --fps <num>', 'Frames Per Second target')
  .parse(process.argv);

if(!program.mqtt) {program.mqtt = "localhost";}
if(!program.opc) {program.opc = "localhost";}

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://' + program.mqtt, {
  "will": {
    // disable directOnly if we get disconnected
    "topic": "asOne/scoreboard/directOnly",
    "payload": new Buffer([0]),
  },
});
client.subscribe("asOne/score/leftBPM")
client.subscribe("asOne/score/rightBPM")
client.subscribe("asOne/score/timer")
client.subscribe("asOne/score/logo")
client.subscribe("asOne/score/state")

client.subscribe("asOne/openPixelControl/scoreboard/ipAddress");

var channelToTopic = {
  "1": "asOne/score/rightBPM/direct",
  "2": "asOne/score/logo/direct",
  "3": "asOne/score/timer/direct",
  "4": "asOne/score/leftBPM/direct",
};

var mqttDirect = new MqttDirectOutput(client, channelToTopic);
var opcHost = new OpcHost(program.opc, 7890)
var multiOut = new MultiOutput([opcHost, mqttDirect]);

// - 0: use processor-based FastLED library
// - 1: use UART to drive LEDs
// - 2: use UART with gamma correction
// - 3: use UART with gamma correction and linear temporal interpolation
// - 4: use UART with gamma correction and temporal dithering
function setMqttSettings(){
  mqttDirect.setAcceleration(4); // :D
  setTimeout(setMqttSettings, 5000);
}

setMqttSettings();

var scoreboard = (new WiringDiagram(multiOut)).scoreboard;
if(program.fps) {
  scoreboard.setFPS(program.fps);
}
scoreboard.start();

client.on('message', function (topic, message) {
  //console.log([topic, message]);
  if(topic == "asOne/score/leftBPM") {
    scoreboard.setLeft(message[0]);
  } else if(topic == "asOne/score/rightBPM") {
    scoreboard.setRight(message[0]);
  } else if(topic == "asOne/score/timer") {
    scoreboard.setTimer(message[0]);
  } else if(topic == "asOne/score/logo") {
    scoreboard.setLogoColor([message[0], message[1], message[2]]);
  } else if(topic == "asOne/score/state") {
    scoreboard.setLogoColor(message[0]);
  } else if(topic == "asOne/openPixelControl/scoreboard/ipAddress") {
    var host = message[0] + "." + message[1] + "." + message[2] + "." + message[3];
    if(host != opcHost.host) {
      console.log("scoreboard seen on " + host);
      opcHost.setHost(host);
    }
  }
});
