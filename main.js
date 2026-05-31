import { sleep, animation, randomImage, getElements } from "./OBS-Gall.js";

window.onload = async function () {
    fetch("./config.json")
        .then((response) => response.json())
        .then(async (data) => {
            // This gets all of the default elements that are used
            let el = getElements();

            // This gets a random image, and requires for an image, name, handle, and icon HTML element
            randomImage(data, el.img, el.name, el.handle, el.icon);
            // This is a forever loop
            while (true) {
                // This tells the program to sleep (wait) for 5 seconds
                await sleep(5);
                // The first animation(s) is the disapear animation
                animation([el.name, el.handle, el.icon], "fadeOut", 3);
                await animation([el.img], "slideOutL", 2);
                console.log("Animation Done");
                // The last animations are the appear animation
                randomImage(data, el.img, el.name, el.handle, el.icon);
                animation([el.img], "slideInR", 2);
                await animation([el.name, el.handle, el.icon], "fadeIn", 3);
                await sleep(2);
            }
        });
};
