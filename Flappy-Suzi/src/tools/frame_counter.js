import * as UTILITY from "./utility";

const CONSTANTS = {
    BUTTON_NAME: "FPS",
    STATUS_CLASS: "fps-status",
    SLIDE_EFFECT_CLASS: "show-status",
    MSG_ON: "Framerate counter on!",
    MSG_OFF: "Framerate counter off!",
    FPS_CORNER: {
        x: 10,
        y: 20
    }
};

export default class FrameCounter {
    constructor(container){
        this.toolbox = container;               //parent container element for all tools
        this.button = this.addFpsButton();      //create and add fps button to toolbox
        this.statusMessage = this.addStatus();  //create and add element for fps button status
        this.showFPS = false;                   //tracks visibility
        this.startTime = 0;
        this.frameNumber = 0;
    }

    addFpsButton(){
        //creates button to toggle frame counter, adds button to the toolbox element, then returns button
        const newButton = this._createFpsButton();
        this.toolbox.appendChild(newButton);
        return newButton;
    }

    _createFpsButton(){
        //creates and returns button to toggle fps counter
        const newButton = document.createElement("button");
        newButton.innerHTML = CONSTANTS.BUTTON_NAME;

        //add event listeners
        newButton.addEventListener("click", this.handleFpsClick());
        newButton.addEventListener("mouseover", () => this.toggleStatus());
        newButton.addEventListener("mouseout", () => this.toggleStatus());
        
        //add initial styling
        UTILITY.toggleSelectedStatus(newButton);
        return newButton;
    }

    addStatus(){
        //creates and returns element for fps button status message
        const newElement = this._createStatusUpdate();
        this.toolbox.appendChild(newElement);
        return newElement;
    }

    _createStatusUpdate(){
        //creates and returns element 
        const newElement = document.createElement("div");
        newElement.setAttribute("class", CONSTANTS.STATUS_CLASS);

        //set initial message
        newElement.innerHTML = CONSTANTS.MSG_OFF;

        return newElement;
    }

    toggleStatus(){
        //updates button status message
        if (this.statusMessage.id !== CONSTANTS.SLIDE_EFFECT_CLASS){
            this.statusMessage.setAttribute("id", CONSTANTS.SLIDE_EFFECT_CLASS);
        } else {
            this.statusMessage.removeAttribute("id", CONSTANTS.SLIDE_EFFECT_CLASS);
        }
    }

    handleFpsClick(){
        //when fps button is clicked, fps counter is drawn to upper left corner of canvas
        return (e) => {
            e.preventDefault();
            const fpsButton = e.target;
            this.showFPS = !this.showFPS;
            this.statusMessage.innerHTML = this.showFPS ? CONSTANTS.MSG_ON : CONSTANTS.MSG_OFF;
            //change styling to indicate button is selected
            UTILITY.toggleSelectedStatus(fpsButton);
        }
    }
    
    getFPS(){
        //calculates and returns frames per second
        this.frameNumber++;
        const d = new Date().getTime();
        const currentTime = (d - this.startTime) / 1000;
        const result = Math.floor(this.frameNumber / currentTime);
        if (currentTime > 1){
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }
        return result;
    }

    drawFPS(ctx){
        //receives canvas context, prints current frames per second
        ctx.font = "18px Helvetica";
        ctx.fillStyle = "black";
        ctx.fillText("FPS : " + this.getFPS(), CONSTANTS.FPS_CORNER.x, CONSTANTS.FPS_CORNER.y);
    }

}