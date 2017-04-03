import Scoreboard from './Scoreboard.js'
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var scoreboard = new Scoreboard();
scoreboard.start();

var ask = function() {
  rl.question('L BPM? ', (answer) => {
    if(answer === ''){
      rl.close();
    } else {
      scoreboard.setLeft(answer);
      rl.question('R BPM ? ', (answer) => {
        if(answer === ''){
          rl.close();
        } else {
          scoreboard.setRight(answer);
          setTimeout(ask, 1000);
        }
      });
    }
  });
}

ask();
