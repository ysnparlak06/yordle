import {WORDS} from "./tr10Words.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];

console.log(rightGuessString);

function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div");
        row.className = "letter-row";

        for (let j = 0; j < 10; j++) {
            let box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }

        board.appendChild(row);
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor;
            if (oldColor === "green") {
                return;
            }

            if (oldColor === "yellow" && color !== "green") {
                return;
            }

            elem.style.backgroundColor = color;
            break;
        }
    }
}

function deleteLetter() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let box = row.children[nextLetter - 1];
    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuess.pop();
    nextLetter -= 1;
}

function checkGuess() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let guessString = "";
    let rightGuess = Array.from(rightGuessString);

    for (const val of currentGuess) {
        guessString += val;
    }

    if (guessString.length !== 10) {
        toastr.error("Yeterli harf yok!");
        return;
    }

    if (!WORDS.includes(guessString)) {
        toastr.error("Kelime listede yok!");
        return;
    }

    var letterColor = ["gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray"];

    for (let i = 0; i < 10; i++) {
        if (rightGuess[i] === currentGuess[i]) {
            letterColor[i] = "green";
            rightGuess[i] = "#";
        }
    }

    for (let i = 0; i < 10; i++) {
        if (letterColor[i] === "green") continue;

        for (let j = 0; j < 10; j++) {
            if (rightGuess[j] === currentGuess[i]) {
                letterColor[i] = "yellow";
                rightGuess[j] = "#";
            }
        }
    }

    for (let i = 0; i < 10; i++) {
        let box = row.children[i];
        let delay = 240 * i;
        setTimeout(() => {
            animateCSS(box, "flipInX");
            box.style.backgroundColor = letterColor[i];
            shadeKeyBoard(guessString.charAt(i) + "", letterColor[i]);
        }, delay);
    }

    if (guessString === rightGuessString) {
        toastr.success("Doğru tahmin ettiniz! Oyun bitti!");
        guessesRemaining = 0;
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            toastr.error("Tahmin hakkınız bitti! Oyun bitti!");
            toastr.info(`Aranan kelime: "${rightGuessString}"`);
        }
    }
}

function insertLetter(pressedKey) {
    if (nextLetter === 10) {
        return;
    }

    pressedKey = pressedKey.toLowerCase();
    pressedKey = handleTurkishCharacters(pressedKey);

    console.log(pressedKey);

    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let box = row.children[nextLetter];
    animateCSS(box, "pulse");
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    currentGuess.push(pressedKey);
    nextLetter += 1;
}

function handleTurkishCharacters(char) {
    const turkishMap = {
        'ı': 'ı',
        'ğ': 'ğ',
        'ü': 'ü',
        'ş': 'ş',
        'ö': 'ö',
        'ç': 'ç'
    };

    return turkishMap[char.toLowerCase()] || char;
}

const animateCSS = (element, animation, prefix = "animate__") =>
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = element;
        node.style.setProperty("--animate-duration", "0.3s");

        node.classList.add(`${prefix}animated`, animationName);

        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve("Animation ended");
        }

        node.addEventListener("animationend", handleAnimationEnd, {once: true});
    });

document.addEventListener("keyup", (e) => {
    if (guessesRemaining === 0) {
        return;
    }

    let pressedKey = String(e.key);

    pressedKey = handleTurkishCharacters(pressedKey);

    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    if (pressedKey === "Enter") {
        checkGuess();
        return;
    }

    let found = pressedKey.match(/[a-zçğıüşö]/gi);
    if (!found || found.length > 1) {
    } else {
        insertLetter(pressedKey);
    }
});

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target;

    if (!target.classList.contains("keyboard-button")) {
        return;
    }

    let key = target.textContent;

    if (key === "ç") {
        key = "ç";
    } else if (key === "ğ") {
        key = "ğ";
    } else if (key === "ü") {
        key = "ü";
    } else if (key === "ş") {
        key = "ş";
    } else if (key === "ı") {
        key = "ı";
    } else if (key === "ö") {
        key = "ö";
    } else {
        key = key.toLowerCase();
    }

    if (key === "del") {
        key = "Backspace";
    }

    document.dispatchEvent(new KeyboardEvent("keyup", {key: key}));
});

initBoard();
