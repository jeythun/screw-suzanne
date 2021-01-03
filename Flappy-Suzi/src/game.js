import Player from "./player";
import Level from "./level";
import * as CHAR_INFO from "./character_info";
import Toolbox from "./toolbox";

export default class Game {
    constructor(canvas){
        this.tools = new Toolbox();
        this.ctx = canvas.getContext("2d");
        this.dimensions = {
            width: canvas.width,
            height: canvas.height
        };
        this.level = null;
        this.player = null;
        this.selectedChar = "";
        this.running = false;
        this.score = 0;
        this.highScore = 0;
        this.addEvents();
        this.reset();
        this.toggleTitleScreen();
    }

    _toggleVisibility(element){
        //receives reference to element, toggles visibility
        element.id = (element.id !== "show") ? "show" : "no-show";
    }

    _showMenu(menuElement, titleElement){
        //receives menu and title elements, toggles background and menu visibility
        const backBoxElement = document.querySelector(".backBox");
        [menuElement, titleElement, backBoxElement].forEach( ele => {
            this._toggleVisibility(ele);
        });
    }

    toggleTitleScreen(){
        //runs title screen animation, starting game goes to character selection screen
        this._toggleVisibility(document.querySelector(".startButton")); //show start button
        
        //run pipe animation until start button clicked
    }

    toggleCharacterSelectionScreen(){
        //presents character selection, initializes player object and calls startGame
        const charSelection = document.querySelector(".charSelection");
        const menuTitle = document.querySelector(".menuTitle");
        menuTitle.innerHTML = "Choose your character!";
        this._showMenu(charSelection, menuTitle);
    }

    toggleEndGameScreen(){
        //presents end game screen and options to try again or choose character
        const endScreen = document.querySelector(".endScreen");
        const menuTitle = document.querySelector(".menuTitle");
        menuTitle.innerHTML = "GAME OVER";
        this.showFinalScore();
        this._showMenu(endScreen, menuTitle);
    }

    handleStartButton(){
        //closes start screen, opens character selection, plays background music
        return (e) => {
            e.preventDefault();
            this._toggleVisibility(document.querySelector(".startButton"));
            this.toggleCharacterSelectionScreen();
            this.tools.audio.startMusic();
        }
    }

    handleSelection(){
        return (e) => {
            e.preventDefault();
            //retrieve selected char details and initialize player instance
            this.selectedChar = e.target.id;

            //close character selection menu
            this.toggleCharacterSelectionScreen();

            //start game
            this.play();
        }
    }

    handleEndScreen(option){
        return (e) => {
            e.preventDefault();
            
            //close end screen menu
            this.toggleEndGameScreen();

            //redirect based on option chosen
            this.reset();
            if (option === "restart"){  //restart with same character
                this.play();
            } else {                    //reselect character
                this.toggleCharacterSelectionScreen();
            }
        }
    }

    handleCanvasClick(){
        //clicking makes player fly up if game is running
        if (this.running) this.player.flap();
    }

    addEvents(){
        //adds all event listeners to the appropriate elements

        //click on canvas makes player fly
        this.ctx.canvas.addEventListener("mousedown", () => this.handleCanvasClick());

        //start button leads to character selection screen
        const startButton = document.querySelector(".startButton");
        startButton.addEventListener("click", this.handleStartButton());

        //load characters to character selection menu
        const charSelection = document.querySelector(".charSelection");
        CHAR_INFO.createCharacterMenu(charSelection, this.handleSelection());

        //endscreen buttons, options to restart or choose characer
        const restartButton = document.getElementById("restart");
        restartButton.addEventListener("click", this.handleEndScreen("restart"));
        const changeCharButton = document.getElementById("charSelect");
        changeCharButton.addEventListener("click", this.handleEndScreen("charSelect"));

        //prevent double clicking from highlighting text
        this.ctx.canvas.onselectstart = () => { return false; };
    }

    drawScore() {
        //draws the score at the top of the canvas
        const currentScore = document.querySelector(".show-score");
        currentScore.innerHTML = this.score;
    }

    showFinalScore(){
        //adds current score and high score to end game screen
        const currentScoreBox = document.querySelector(".currentScore");
        const highScoreBox = document.querySelector(".highScore");

        //get score texts
        const currentScoreText = `Score: ${this.score}`;
        let highScoreText = `Best: ${this.highScore}`;
        if (this.score > this.highScore){
            //update high score
            this.highScore = this.score;
            highScoreText = `[NEW] Best: ${this.highScore}`;
        }

        //add to box element
        currentScoreBox.innerHTML = currentScoreText;
        highScoreBox.innerHTML = highScoreText;
    }

    reset(){
        //reset the level, player, running status, then call animate
        this.level = new Level(this.dimensions);
        this.player = null;
        this.score = 0;
        this.running = false;
        this.animate();
    }

    play(){
        //begin playing game: set running status, initializes character, and start animation
        this.running = true;
        this.player = new Player(this.dimensions, CHAR_INFO.getCharDetails(this.selectedChar));
        this.animate();
    }

    gameOver(){
        //returns true if player collides with pipe
        return this.level.collidesWith(this.player.getBounds());
    }

    animate(){
        //creates images on canvas while the game is running
        if (!this.running) return;
        this.level.animate(this.ctx);
        this.player.animate(this.ctx);

        //draw fps counter if activated
        if (this.tools.frameCounter.showFPS) this.tools.frameCounter.drawFPS(this.ctx);

        //check for collisions, end game if player hits pipe
        if (this.gameOver()){
            this.toggleEndGameScreen();
            return;
        }

        //update and draw score
        this.level.updateScore(this.player.getBounds(), () => this.score++ );
        this.drawScore();

        //get next animation frame
        requestAnimationFrame(() => this.animate());
    }

}