const CONSTANTS = {
    VOL_SLIDER_SETTINGS: {
        class: "vol-slider",
        type: "range",
        min: 0,
        max: 0.1,
        step: 0.001,
        value: 0.05
    },
    DEFAULT_AUDIO_SRC: "assets/audio/rick_astley.mp3",
    ICON_MUTE: '<i class="fas fa-volume-mute"></i>',
    ICON_VOL_OFF: '<i class="fas fa-volume-off"></i>',
    ICON_VOL_LOW: '<i class="fas fa-volume-down"></i>',
    ICON_VOL_HIGH: '<i class="fas fa-volume-up"></i>'
};

export default class GameAudio {
    constructor(container){
        this.toolbox = container;       //parent container element for all tools
        this.addVolumeControls();       //create and add audio element and button to toolbox
    }

    addVolumeControls(){
        //adds button to adjust and/or mute game volume
        const audioElement = this._createAudioElement();
        const volContainer = this._createVolControls();
        this.toolbox.appendChild(audioElement);
        this.toolbox.appendChild(volContainer);
    }

    _createAudioElement(){
        //creates and return button to toggle audio controls

        //create audio element
        const audioElement = document.createElement("audio");
        audioElement.setAttribute("id", "audio");

        //add default audio
        const defaultAudioSource = CONSTANTS.DEFAULT_AUDIO_SRC;
        this._addAudioSource(audioElement, defaultAudioSource);        
        
        //set default audio properties        
        audioElement.loop = true;
        audioElement.volume = CONSTANTS.VOL_SLIDER_SETTINGS.value;
        
        //instance variable for audio element reference
        this.audioElement = audioElement;

        return audioElement;
    }

    _addAudioSource(bgAudio, sourcePath){
        //receives audio element and a url path string, sets string as the audio element source
        const bgSource = document.createElement("source");
        bgSource.src = sourcePath;
        bgSource.type = "audio/mp3";
        bgAudio.appendChild(bgSource);
    }

    _createVolControls(){
        //creates mute button and volume slider for audio element, returns the volume controls container element
        
        //create container for button and slider
        const container = document.createElement("div");
        container.setAttribute("class", "audio-controls");

        //create button
        const muteButton = document.createElement("button");
        muteButton.setAttribute("id", "mute-button");

        //instance variable for mute button reference
        this.muteButton = muteButton;
        
        //create default button icon
        muteButton.innerHTML = CONSTANTS.ICON_VOL_OFF;

        //add volume slider to mute button element
        const volSlider = this._createVolumeSlider();

        //add event listeners for mute and volume controls
        muteButton.addEventListener("click", this.toggleMute());
        container.addEventListener("mouseover", this.showVolumeSlider(volSlider));
        container.addEventListener("mouseout", this.hideVolumeSlider(volSlider));
        
        //add button and slider to container
        container.appendChild(muteButton);
        container.appendChild(volSlider);

        return container;
    }

    _createVolumeSlider(){
        //create volume slider
        const volSlider = document.createElement("input");
        
        //apply default slider settings
        Object.keys(CONSTANTS.VOL_SLIDER_SETTINGS).forEach( attribute => {
            volSlider.setAttribute(attribute, CONSTANTS.VOL_SLIDER_SETTINGS[attribute]);
        })

        //add event listener to change volume
        volSlider.addEventListener("change", this.setVolume(volSlider.value));

        return volSlider;
    }

    showVolumeSlider(volSlider){
        //receives volume slider element, adds attribute for slide animation
        return () => {
            volSlider.setAttribute("id", "slide-in");
        }
    }

    hideVolumeSlider(volSlider){
        //receives volume slider element, removes attribute for slide animation
        return () => {
            volSlider.removeAttribute("id", "slide-in");
        }
    }

    toggleMute(){
        //toggles audio muted status
        return (e) => {
            e.preventDefault();
            if (this.audioElement.muted){
                this.audioElement.muted = false;
                this.setButtonIcon(this.audioElement.volume);
            } else {
                this.audioElement.muted = true;
                this.setButtonIcon(0);
            }
        }
    }

    setVolume(val){
        //sets audio volume to the selected range value
        return (e) => {
            e.preventDefault();
            const chosenVal = e.target.value;
            this.audioElement.volume = chosenVal;
            this.setButtonIcon(chosenVal);
        }
    }

    setButtonIcon(currentVol){
        //receives current volume level, calls getVolIcon and sets button icon based on volume level
        const volIcon = this.getVolIcon(currentVol);
        this.muteButton.innerHTML = volIcon;
    }

    getVolIcon(currentVol){
        //receives current volume level, returns the icon element string corresponding to the current volume level
        let volIcon = '';
        if (this.audioElement.muted){                                       //muted
            volIcon = CONSTANTS.ICON_MUTE;
        } else if (currentVol === 0){                                       //off
            volIcon = CONSTANTS.ICON_VOL_OFF;
        } else if (currentVol < (CONSTANTS.VOL_SLIDER_SETTINGS.max / 2)){   //low vol
            volIcon = CONSTANTS.ICON_VOL_LOW;
        } else {                                                            //high vol
            volIcon = CONSTANTS.ICON_VOL_HIGH;
        }
        return volIcon;
    }

    startMusic(){
        //unmutes audio and updates mute button text
        this.audioElement.play();
        this.setButtonIcon(this.audioElement.volume);
    }
}