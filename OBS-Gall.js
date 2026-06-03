const artFolder = "./Assets/Art/";
const logoFolder = "./Assets/Logos/";

/**
 * @typedef {Object} Elements
 * @property {?HTMLElement} img - HTML Image element
 * @property {?HTMLElement} name - HTML Artist name element
 * @property {?HTMLElement} handle - HTML Artist handle element
 * @property {?HTMLElement} icon - HTML Artist icon element
 */

/**
 *
 * @param {string} [image] - HTML ID for image
 * @param {string} [name] - HTML ID for name
 * @param {string} [handle] - HTML ID for handle
 * @param {string} [icon] - HTML ID for icon
 * @returns {Elements} - Object with img, name, handle, and icon values
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
 * Object for the artist data used in the config json
 * @typedef {Object} Artist
 * @property {string} name
 * @property {?string} tag
 * @property {?string} icon
 */

/**
 * Object for the artwork data used in the config json
 * @typedef {Object} Artwork
 * @property {string} file
 * @property {string} artist
 */

/**
 * Main object for the config json
 * @typedef {Object} Config
 * @property {Array<Artwork>} images
 * @property {Object<string, Artist>} artists
 */

/** @typedef {Artwork & Artist} CurrentArtwork */

/**
 * Manager for the Artwork Gallery
 * - Compared to the older method, now the gallery will be shuffled, and then displayed, making sure all artwork show sbefore repeats.
 * - Using {@link Gallery.next()} it will advance to the next artwork.
 * - Using {@link Gallery.applyArtwork()} it will apply the current artwork, and relative data to the gallery display
 */
class Gallery {
    /**
     * All of the elements used by the gallery
     * @type {Elements}
     * @readonly
     */
    ele = {};

    /**
     * Array of all of the images used by the gallery
     * - Pulled from {@link Config}
     * @type {Array<Artwork>}
     * @readonly
     */
    images = [];

    /**
     * Object of all of the artists used by the gallery
     * - Pulled from {@link Config}
     * @type {Object<string, Artist>}
     * @readonly
     */
    artists = {};

    index = 0;

    /**
     * The current queue of artwork
     * @see {@link Gallery.shuffle()}
     * @type {Array<Artwork>}
     */
    queue = [];

    /**
     * @param {Config} config
     * @param {Elements} elements
     */
    constructor(config, elements) {
        this.images = config.images;
        this.artists = config.artists;
        this.ele = elements;
        this.shuffle();
    }

    /**
     * Advance the current artwork to the next in the queue
     * @param {boolean} shuffle - Will shuffle the queue when the last item is reached
     * @see {@link Gallery.queue}
     * @see {@link Gallery.shuffle()}
     */
    next(shuffle = true) {
        const len = this.queue.length;
        if (this.index + 1 >= len) {
            if (shuffle) this.shuffle();
            this.index = 0;
        } else {
            this.index += 1;
        }
    }

    /**
     * Shuffle all of the artwork randomly, then apply to the queue property
     * @returns {Array<Artwork>} - Returns the new queue, also set to {@link Gallery.queue}
     */
    shuffle() {
        const result = [...this.images];

        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        this.queue = result;
        return this.queue;
    }

    /**
     * Apply the artwork, either a specific one, or the current artwork to the elements
     * @param {CurrentArtwork} [artwork] - Defaults to {@link Gallery.current}
     */
    applyArtwork(artwork = this.current) {
        const { img, name, handle, icon } = this.ele;

        img.setAttribute("src", artFolder + artwork.file);
        name.innerHTML = artwork.name;
        if (!(artwork.tag === undefined)) {
            handle.innerHTML = artwork.tag;
            icon.setAttribute("src", logoFolder + artwork.icon);
            icon.style.display = "inline-block";
        } else {
            console.log("No tag");
            handle.innerHTML = "";
            icon.style.display = "none";
        }
    }

    /**
     * Gets the currently active artwork
     * @returns {CurrentArtwork} - Combination of {@link Artwork} and {@link Artist}
     * @see {@link Gallery.getArtwork()}
     */
    get current() {
        return this.getArtwork(this.index);
    }

    /**
     * Gets the artwork, and artist data at a specific index
     * @param {number} index
     * @returns {CurrentArtwork} - Combination of {@link Artwork} and {@link Artist}
     */
    getArtwork(index) {
        const artwork = this.queue[index];
        const artist = this.artists[artwork.artist];
        return {
            ...artwork,
            ...artist,
        };
    }
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
 * To use this function it must be called with await before it
 * @param {number} seconds - The number of seconds to wait
 * @returns {Promise}
 */
function sleep(seconds) {
    let ms = seconds * 1000;
    return new Promise((resolve) => setTimeout(resolve, ms || DEF_DELAY));
}

export { Gallery, animation, sleep, getElements };
