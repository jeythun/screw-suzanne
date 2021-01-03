//contains functions to toggle styling of tools

export const toggleSelectedStatus = (element) => {
    //receives element, toggles css class to indicate button is activated/deactivated
    element.id = (element.id && element.id !== "button-on") ? "button-on" : "button-off";
}