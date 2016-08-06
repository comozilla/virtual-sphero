export default class SpeedController {
	constructor(){
    this._element = document.getElementById("speed");
    this.speed = 0.2;
    this._element.value = this.speed;
    this._element.addEventListener("change", () => {
      if (this._element.value !== "" && !isNaN(this._element.value)) {
        this.speed = parseFloat(this._element.value);
      }
    });
  }
}
