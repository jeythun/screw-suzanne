const CONSTANTS = {
    GAP_HEIGHT: 150,
    PIPE_WIDTH: 50,
    PIPE_SPACING: 220,
    EDGE_BUFFER: 50,
    PIPE_SPEED: 2,
    FOREGROUND_HEIGHT: 30,
    PIPE_IMAGE_HEIGHT: 480,
    DEFAULT_IMAGES: {
        BACKGROUND: "assets/images/bgDay.png",              //600x480
        FOREGROUND: "assets/images/fgDay.png",              //480x60
        TOP_PIPE: "assets/images/pipesTop2.png",    //52x480
        BTM_PIPE: "assets/images/pipesBtm2.png"     //52x480
    }
};

export default class Level {
    constructor(dimensions){
        this.dimensions = dimensions;
        this.setLevelAssets(CONSTANTS.DEFAULT_IMAGES);
        //pipe images
        const initialSpawn = this.dimensions.width + (60 * CONSTANTS.PIPE_SPEED);
        this.pipes = [
            this.getRandomPipe(initialSpawn),
            this.getRandomPipe(initialSpawn + CONSTANTS.PIPE_SPACING),
            this.getRandomPipe(initialSpawn + 2 * CONSTANTS.PIPE_SPACING)
        ];
        //background scrolling
        this.backgroundX = 0;
    }

    getImage(link){
        //receives a link to an image asset, returns image element
        const newImage = new Image();
        newImage.src = link;
        return newImage;
    }

    setLevelAssets(imagePaths){
        //receives object of image paths, sets level variables for the appropriate images
        const {BACKGROUND, FOREGROUND, TOP_PIPE, BTM_PIPE} = imagePaths;
        this.setBackgroundImage(BACKGROUND);
        this.setForegroundImage(FOREGROUND);
        this.setPipeImages(TOP_PIPE, BTM_PIPE);
    }
    
    setBackgroundImage(path){
        //receives path string and sets level background image
        this.backgroundImage = this.getImage(path);
    }

    setForegroundImage(path){
        //receives path string and sets level foreground image
        this.foregroundImage = this.getImage(path);
    }

    setPipeImages(topPipePath, btmPipePath){
        //receives paths strings for top and bottom pipes, sets images
        this.topPipeImage = this.getImage(topPipePath);
        this.btmPipeImage = this.getImage(btmPipePath);
    }

    collidesWith(birdBounds){
        //returns true if bird collides with any pipe, false otherwise
        let hitDetection = false;
        this.pipes.forEach( pipeSet => {
            const topHit = this._overlap(pipeSet.topPipe, birdBounds);
            const bottomHit = this._overlap(pipeSet.bottomPipe, birdBounds);
            if (topHit || bottomHit) hitDetection = true; 
        });

        //if bird hits foreground, return true
        const groundLevel = this.dimensions.height - CONSTANTS.FOREGROUND_HEIGHT;
        if (birdBounds.bottom >= groundLevel) hitDetection = true;

        return hitDetection;
    }

    _overlap(box1, box2){
        //returns true if box1 overlaps with box2, false otherwise
        if (box1.left > box2.right || box1.right < box2.left) return false; //no overlap in x direction
        if (box1.top > box2.bottom || box1.bottom < box2.top) return false; //no overlap in y direction
        return true;
    }

    getRandomPipe(x){
        //receives starting x coord, returns new pipe object
        const heightRange = this.dimensions.height - (2 * CONSTANTS.EDGE_BUFFER) - CONSTANTS.GAP_HEIGHT;
        const gapTop = (Math.random() * heightRange) + CONSTANTS.EDGE_BUFFER;
        const pipe = {
            topPipe: {
                left: x,
                right: x + CONSTANTS.PIPE_WIDTH,
                top: 0,
                bottom: gapTop
            },
            bottomPipe: {
                left: x,
                right: x + CONSTANTS.PIPE_WIDTH,
                top: gapTop + CONSTANTS.GAP_HEIGHT,
                bottom: this.dimensions.height
            },
            passed: false
        };
        return pipe;
    }

    movePipes(){
        //moves pipes across screen
        this.pipes.forEach ( pipe => {
            pipe.topPipe.left -= CONSTANTS.PIPE_SPEED;
            pipe.topPipe.right -= CONSTANTS.PIPE_SPEED;
            pipe.bottomPipe.left -= CONSTANTS.PIPE_SPEED;
            pipe.bottomPipe.right -= CONSTANTS.PIPE_SPEED;
        });

        //remove from array when offscreen and add new pipe w/ new gap
        if (this.pipes[0].topPipe.right <= 0){
            this.pipes.shift();
            const nextX = this.pipes[1].topPipe.left + CONSTANTS.PIPE_SPACING;
            this.pipes.push(this.getRandomPipe(nextX));
        }
    }

    drawPipes(ctx){
        //receives cavnas context, draws pipes onto canvas
        this.pipes.forEach( pipe => {
            ctx.drawImage(                  //draw top pipe image
                this.topPipeImage,          //image
                pipe.topPipe.left,          //left edge of image
                pipe.topPipe.bottom - CONSTANTS.PIPE_IMAGE_HEIGHT, //top edge of image 
                CONSTANTS.PIPE_WIDTH,       //image width
                CONSTANTS.PIPE_IMAGE_HEIGHT //image height
            );
            ctx.drawImage(                  //draw bottom pipe image
                this.btmPipeImage,          //image
                pipe.bottomPipe.left,       //left edge of image
                pipe.bottomPipe.top,        //top edge of image
                CONSTANTS.PIPE_WIDTH,       //image width
                CONSTANTS.PIPE_IMAGE_HEIGHT //image height
            );
        })
    }

    drawBackground(ctx){
        //receives canvas context, draws background twice to maintain infinte scrolling effect
        this.backgroundX--;
        if (Math.abs(this.backgroundX) >= this.dimensions.width) this.backgroundX = 0;
        ctx.drawImage(this.backgroundImage, this.backgroundX, 0);
        ctx.drawImage(this.backgroundImage, this.backgroundX + this.dimensions.width, 0);
    }

    drawForeground(ctx){
        //receives canvas context, draws foreground
        ctx.drawImage(this.foregroundImage, 0, this.dimensions.height - CONSTANTS.FOREGROUND_HEIGHT);
    }

    updateScore(birdBounds, addToScore){
        //receives bird hitbox and addToScore function, adds 1 to score if pipe is successfully passed
        this.pipes.forEach( pipeSet => {
            if (pipeSet.topPipe.right < birdBounds.left){
                if (!pipeSet.passed){
                    pipeSet.passed = true;
                    addToScore();
                }
            }
        });
    }

    animate(ctx){
        //receives canvas context, draws structures in the level
        this.drawBackground(ctx);

        //update and draw pipes
        this.movePipes();
        this.drawPipes(ctx);

        //draw foreground
        this.drawForeground(ctx);
    }
}