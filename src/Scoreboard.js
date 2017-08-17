import NumberDisplay from './NumberDisplay.js'
import Numeric from './patterns/Numeric.js'
import TechnicolorSnow from './patterns/TechnicolorSnow.js'
import Fireflow from './patterns/Fireflow.js'
import DifferenceShader from './patterns/DifferenceShader.js'
import WhiteSpark from './patterns/WhiteSpark.js'
import RedCells from './patterns/RedCells.js'
import MergePatterns from './patterns/MergePatterns.js'
import MaskPattern from './patterns/MaskPattern.js'
import ThinNumeric from './patterns/ThinNumeric.js'
import TinyNumeric from './patterns/TinyNumeric.js'
import BlinkyTimer from './patterns/BlinkyTimer.js'
import HueFade from './patterns/HueFade.js'
import ThinWords from './patterns/ThinWords.js'
import StatePatternSwitch from './patterns/StatePatternSwitch.js'
import Off from './patterns/Off.js'

class Scoreboard {
  constructor(leftDisplay, rightDisplay, timerDisplay, logoDisplay) {
    this.leftScore = 0;
    this.rightScore = 0;
    this.state = 0; // idle

    this.fps = 32; // frames per second
    this.leftNextFrameTime = 0;
    this.rightNextFrameTime = (new Date()).getTime() + this.frameDuration() / 2; // interlace left and right updates

    this.running = false;

    this.leftDisplay = leftDisplay;
    this.rightDisplay = rightDisplay;
    this.timerDisplay = timerDisplay;
    this.logoDisplay = logoDisplay;

    let bpmPattern = new MaskPattern(
      new MergePatterns([ new Fireflow(this), new DifferenceShader(this)]),
      new MergePatterns([ new ThinNumeric(this.leftDisplay), new ThinNumeric(this.rightDisplay) ])
    );

    let timerPattern = new MaskPattern(
      new BlinkyTimer(this.timerDisplay),
      new TinyNumeric(this.timerDisplay)
    );

    let logoPattern = new HueFade(this.logoDisplay);

    let activePattern = new MergePatterns([ bpmPattern, timerPattern, logoPattern ]);

    let idlePattern = new MaskPattern(
      new MergePatterns([new Off(this), new Fireflow(this)]),
      new MergePatterns([new ThinWords(this.leftDisplay, this.rightDisplay), new Off(this)])
    );

    let wonPattern = new TechnicolorSnow(this); // FIXME: fade numbers to rainbows

    this.pattern = new StatePatternSwitch(this, [idlePattern, activePattern, wonPattern])

    this.main = this.main.bind(this);
  }

  setState(state) {
    this.state = state;
  }

  setLeft(score) {
    this.leftScore = score;
    this.leftDisplay.update(this.leftScore);
  }

  setRight(score) {
    this.rightScore = score;
    this.rightDisplay.update(this.rightScore);
  }

  setTimer(seconds) {
    this.timerDisplay.update(seconds);
  }

  setLogoColor(color) {
    this.logoDisplay.update(color);
  }

  start() {
    console.log("STARTING SCOREBOARD UPDATES");
    this.running = true;
    setImmediate(this.main);
  }

  stop() {
    this.running = false;
  }

  frameDuration() { // in milliseconds
    return 1000 / this.fps;
  }

  renderPattern() {
    var pixels = this.pattern.render(new Date().getTime() / 1000);

    pixels.write({
      "0": this.rightDisplay.channel,
      "1": this.logoDisplay.channel,
      "2": this.timerDisplay.channel,
      "3": this.leftDisplay.channel,
    });
  }

  main() {
    if( ! this.running ) {
      console.log("stopped");
      return;
    }
    let now = (new Date()).getTime();

    this.renderPattern();

    if(this.leftNextFrameTime <= now) {
      this.updateLeft();
      this.leftDisplay.channel.sendPixels();
      this.timerDisplay.channel.sendPixels();
    } else {
      if(this.rightNextFrameTime <= now) {
        this.updateRight()
        this.rightDisplay.channel.sendPixels();
        this.logoDisplay.channel.sendPixels();
      }
    }

    let msTilNextUpdate = Math.min(
      this.leftNextFrameTime,
      this.rightNextFrameTime,
    ) - now;

    setTimeout(this.main, msTilNextUpdate);
  }

  updateLeft() {
    let now = (new Date()).getTime();
    this.leftNextFrameTime = now + this.frameDuration();
  }

  updateRight() {
    let now = (new Date()).getTime();
    this.rightNextFrameTime = now + this.frameDuration();
  }
}

export default Scoreboard;
