const CONSTANTS = {
    FLAP_SPEED: 7,
    GRAVITY: 0.4,
    TERMINAL_VELOCITY: 12
};

export default class Player {
    constructor(dimensions, charDetails){
        this.dimensions = dimensions;
        this.image = this.getImage(charDetails.link);
        this.width = charDetails.width;
        this.height = charDetails.height;
        this.x = this.dimensions.width / 3;
        this.y = 0;
        this.velocity = 0;
        this.callback = charDetails.callback;
        this.metaData = []; //general purpose storage helper for character trail callbacks
    }

    getImage(link){
        //receives image source link, creates and returns an image element
        const charImage = new Image;
        charImage.src = link;
        return charImage;
    }

    getBounds(){
        //returns an object with the current bounds of the player
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    drawPlayer(ctx){
        //receives canvas context, draws player
        const loc = [this.x, this.y];
        if (this.callback) this.callback(ctx, loc, this.metaData);
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    movePlayer(){
        //updates player velocity and position for each frame
        this.y = Math.max(0, this.y + this.velocity);   //update vertical position, prevent from going above top of canvas
        this.velocity += CONSTANTS.GRAVITY              //update acceleration due to gravity

        //prevent player from exceeding terminal velocity in positive and negative directions
        if (Math.abs(this.velocity) > CONSTANTS.TERMINAL_VELOCITY){
            if (this.velocity > 0){
                this.velocity = CONSTANTS.TERMINAL_VELOCITY;
            } else {
                this.velocity = -1 * CONSTANTS.TERMINAL_VELOCITY;
            }
        }
    }

    flap(){
        //adjusts velocity for player to fly up
        this.velocity = -1 * CONSTANTS.FLAP_SPEED;
    }

    animate(ctx){
        //receives canvas context, animates player movement and physics
        this.movePlayer();
        this.drawPlayer(ctx);
    }
}