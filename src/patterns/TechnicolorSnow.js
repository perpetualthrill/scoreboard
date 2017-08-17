import Pixels from '../Pixels.js'

class TechnicolorSnow {
  constructor(scoreboard) {
    this.scoreboard = scoreboard;
  }

  render(time) {
    var pixels = new Pixels();
    var numberDisplays = [this.scoreboard.leftDisplay, this.scoreboard.rightDisplay];
    var displays = [this.scoreboard.leftDisplay, this.scoreboard.rightDisplay, this.scoreboard.logoDisplay, this.scoreboard.timerDisplay];
    for(var d = 0; d < displays.length; d++) {
      displays[d].paint(pixels, function(x,y) {
        return [
          Math.random(),
          Math.random(),
          Math.random(),
          1,
        ];
      });
    }
    return pixels;
  }
}

export default TechnicolorSnow;
