const artFolder = "./Assets/Art/";
const logoFolder = "./Assets/Logos/";

const history = [];

/**
 * @typedef {Object} elements
 * @property {HTMLElement} img - HTML Image element
 * @property {HTMLElement} name - HTML Artist name element
 * @property {HTMLElement} handle - HTML Artist handle element
 * @property {HTMLElement} icon - HTML Artist icon element
 */

/**
 *
 * @param {string} [image=image] - HTML ID for image
 * @param {string} [name=artist] - HTML ID for name
 * @param {string} [handle=handle] - HTML ID for handle
 * @param {string} [icon=icon] - HTML ID for icon
 * @returns {elements} - Object with img, name, handle, and icon values
 */
function getElements(image, name, handle, icon) {
    if (!image) image = "image";
    if (!name) name = "artist";
    if (!handle) handle = "handle";
    if (!icon) icon = "icon";

    image = document.getElementById(image);
    name = document.getElementById(name);
    handle = document.getElementById(handle);
    icon = document.getElementById(icon);

    return { img: image, name: name, handle: handle, icon: icon };
}

/**
 * This function runs an animation for the element, with the inputed style and duration
 * @param {HTMLElement[]} element - An array HTML elements that will have the animation affected
 * @param {'fadeIn' | 'fadeOut' | 'slideInR' | 'slideOutR' | 'slideInL' | 'slideOutL'} style - A string of the type of animation
 * @param {number} duration - The duration of the animation in seconds
 */

function animation(element, style, duration) {
    return new Promise((resolve) => {
        console.log(element);
        for (let el of element) {
            el.style.animation = `${style} ${duration}s forwards`;
        }
        element[0].addEventListener("animationend", resolve, { once: true });
    });
}

/**
 * This function will get a random image, and update all elements based on those values
 * @param {object} [image] - An HTML image element
 * @param {object} [name] - An HTML elment for the artist name
 * @param {object} [handle] - An HTML elment for the artist handle
 * @param {object} [icon] - An HTML elemnt for the artist socail icon
 */

function randomImage(data, image, name, handle, icon) {
    console.log(data.artists);
    let images = data.images;
    let artists = data.artists;
    if (!image) image = document.getElementById("image");
    if (!name) name = document.getElementById("artist");
    if (!handle) handle = document.getElementById("handle");
    if (!icon) icon = document.getElementById("icon");

    let index = Math.floor(Math.random() * images.length);
    console.log(index);

    while (history.includes(images[index].file)) {
        index = Math.floor(Math.random() * images.length);
    }
    console.log(history);
    if (history.length > 3) history.shift();
    history.push(images[index].file);
    image.setAttribute("src", artFolder + images[index].file);
    let artistData = artists[images[index].artist];
    console.log(artistData);
    name.innerHTML = artistData.name;

    if (!(artistData.tag === undefined)) {
        handle.innerHTML = artistData.tag;
        icon.setAttribute("src", logoFolder + artistData.icon);
        icon.style.display = "inline-block";
    } else {
        console.log("No tag");
        handle.innerHTML = "";
        icon.style.display = "none";
        // handle.innerHTML = "PLACEHOLDER"
        // icon.setAttribute("src", socials.tiktok)
    }
}

/**
 * To use this function it must be called with await before it
 * @param {number} seconds - The number of seconds to wait
 * @returns {Promise}
 */
function sleep(seconds) {
    let ms = seconds * 1000;
    return new Promise((resolve) => setTimeout(resolve, ms || DEF_DELAY));
}

export { animation, randomImage, sleep, getElements };
