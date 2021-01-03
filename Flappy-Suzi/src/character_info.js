//all character names
const FLAPPY_BIRD = "flappyBird";
const MARIO_FISH = "marioFish";
const NYAN_CAT = "nyanCat";
const ANGRY_BIRD = "angryBird";
const MARIO_CAPE = "marioCape";
const BANANYA_CAT = "bananyaCat";

//all character image info
const allCharInfo = {
    [FLAPPY_BIRD]: {
        link: "assets/images/flappyBird.png",     // 51x36
        width: 51,
        height: 36,
        callback: null,
        levelAssets: null
    },
    [MARIO_FISH]: {
        link: "assets/images/Fish.png",           // 40x40
        width: 40,
        height: 40,
        callback: null,
        levelAssets: {
            BACKGROUND: "",
            FOREGROUND: "",
            TOP_PIPE: "",
            BTM_PIPE: ""
        }
    },
    [NYAN_CAT]: {
        link: "assets/images/NyanCat.png",        // 65x40
        width: 65,
        height: 40,
        callback: (ctx, loc, metaData) => trailRainbow(ctx, loc, metaData),
        levelAssets: {
            BACKGROUND: "",
            FOREGROUND: "",
            TOP_PIPE: "",
            BTM_PIPE: ""
        }
    },
    [ANGRY_BIRD]: {
        link: "assets/images/angryBird.png",      // 50x46
        width: 50,
        height: 46,
        callback: null,
        levelAssets: {
            BACKGROUND: "",
            FOREGROUND: "",
            TOP_PIPE: "",
            BTM_PIPE: ""
        }
    },
    [MARIO_CAPE]: {
        link: "assets/images/marioCape.png",      // 56x56
        width: 56,
        height: 56,
        callback: null,
        levelAssets: {
            BACKGROUND: "",
            FOREGROUND: "",
            TOP_PIPE: "",
            BTM_PIPE: ""
        }
    },
    [BANANYA_CAT]: {
        link: "assets/images/Bananya.png",        // 32x55
        width: 32,
        height: 55,
        callback: null,
        levelAssets: {
            BACKGROUND: "",
            FOREGROUND: "",
            TOP_PIPE: "",
            BTM_PIPE: ""
        }
    }
}

const _getCharImage = imgSource => {
    //creates and returns an image element
    const pic = new Image();
    pic.src = imgSource;
    return pic;
}

//create array of image elements w/ event listeners
export const createCharacterMenu = (charSelectionBox, callback) => {
    const characterNames = Object.keys(allCharInfo);
    characterNames.forEach( (name, idx) => {
        const charImage = _getCharImage(allCharInfo[name].link);
        charImage.setAttribute("id", `${name}`);
        charImage.addEventListener("click", callback);
        charSelectionBox.appendChild(charImage);
    });
}

//retrieve individual character details and return as an object
export const getCharDetails = name => {
    return allCharInfo[name];
}

const trailRainbow = (ctx, location, pastHeights) => {
    //receives canvas context and player location object
    //draws rainbow trail behind the character image on the canvas
    const [x, y] = location;
    const xStartBuffer = 15;
    let xWalker = x + xStartBuffer;
    
    //callback effects
    const rainbowColors = ["255,0,0", "255,153,0", "255,255,0", "0,255,0", "0,102,255", "153,0,255"];
    const motionTrailLength = 50;
    const colorHeight = 6;
    const colorWidth = 4;
    let opacity = 0;
    let temp = 0;
    
    //maintain array of past heights
    if (pastHeights.length >= motionTrailLength) temp = pastHeights.shift();
    pastHeights.push(y);

    //draw trail length
    for (let i = pastHeights.length - 1; i >= 0; i--){
        let colorLevel = 0;
        opacity = (i + 1) / motionTrailLength;
        
        //draw all colors in trail slice
        for (let j = 0; j < rainbowColors.length; j++){ 
            ctx.beginPath();
            ctx.fillStyle = `rgba(${rainbowColors[j]},${opacity})`;
            ctx.fillRect(xWalker, pastHeights[i] + colorLevel, colorWidth, colorHeight);
            ctx.fill();
            colorLevel += colorHeight;
        }
        xWalker -= colorWidth;
    }
}

function trailJetpack(){
    let yPos = player.y;
    for (let i = 20; i >= 0; i--){
        opacity = ((i + 1)/(40));
        if (player.v <= 0){
            ctx.beginPath();
            ctx.fillStyle = "rgba(255,102,153, "+ opacity + ")";
            ctx.arc(player.x, yPos + (player.pHeight / 2), 7, 0, 2*Math.PI, true);
            ctx.fill();
        }
        yPos += 3;
    }
}