class Scoreboard {
  constructor() {
    this.leftScore = 0;
    this.rightScore = 0;

    this.fps = 30; // frames per second
    this.leftNextFrameTime = 0;
    this.rightNextFrameTime = 0;

    this.running = false;

    this.main = this.main.bind(this);
  }

  setLeft(score) {
    this.leftScore = score;
  }

  setRight(score) {
    this.leftScore = score;
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

  main() {
    if( ! this.running ) {
      console.log("stopped");
      return;
    }
    let now = (new Date()).getTime();

    if(this.leftNextFrameTime <= now) {
      this.updateLeft();
    } else {
      if(this.rightNextFrameTime <= now) {
        this.updateRight()
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

    console.log("LEFT " + this.leftScore);
  }

  updateRight() {
    let now = (new Date()).getTime();
    this.rightNextFrameTime = now + this.frameDuration();

    console.log("RIGHT " + this.rightScore);
  }
}

export default Scoreboard;
