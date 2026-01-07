import { WORDS } from "../Tr5/tr5Words.js";

/* =========================
   TÜRKÇE HARF DÖNÜŞÜMLERİ
   ========================= */

function toTrLower(str = "") {
    return str
        .replace(/İ/g, "i")
        .replace(/I/g, "ı")
        .toLowerCase();
}

function toTrUpper(str = "") {
    return str
        .replace(/i/g, "İ")
        .replace(/ı/g, "I")
        .toUpperCase();
}

/* =========================
   URL PARAMETRESİ
   ========================= */

const params = new URLSearchParams(window.location.search);
const WORD_LENGTH = parseInt(params.get("len")) || 5;

/* =========================
   YEŞİL / SARI KUTULAR
   ========================= */

const greenRow = document.getElementById("green-row");
const yellowRow = document.getElementById("yellow-row");

function createInputs(container, count) {
    for (let i = 0; i < count; i++) {
        const input = document.createElement("input");
        input.maxLength = 1;
        container.appendChild(input);
    }
}

createInputs(greenRow, WORD_LENGTH);
createInputs(yellowRow, WORD_LENGTH);

/* =========================
   GRİ KUTULAR (18 ADET)
   ========================= */

const BAD_LETTER_COUNT = 18;
const badGrid = document.getElementById("bad-letters-grid");

for (let i = 0; i < BAD_LETTER_COUNT; i++) {
    const input = document.createElement("input");
    input.maxLength = 1;
    input.className = "bad-letter-box";
    badGrid.appendChild(input);
}

/* =========================
   INPUT KONTROLÜ
   HER ZAMAN BÜYÜK YAZ
   ========================= */

document.addEventListener("input", (e) => {
    if (e.target.tagName !== "INPUT") return;

    let val = e.target.value.slice(0, 1);
    e.target.value = toTrUpper(val);
});

/* =========================
   SOLVE BUTTON
   ========================= */

document.getElementById("solve-btn").addEventListener("click", solve);

/* =========================
   SOLVER
   ========================= */

function solve() {
    const greens = [...greenRow.children].map(i => toTrLower(i.value));
    const yellows = [...yellowRow.children].map(i => toTrLower(i.value));

    const bad = [...document.querySelectorAll(".bad-letter-box")]
        .map(i => toTrLower(i.value))
        .filter(Boolean);

    const results = WORDS
        .map(w => toTrLower(w))
        .filter(word => {
            if (word.length !== WORD_LENGTH) return false;

            // 🟩 Yeşiller
            for (let i = 0; i < WORD_LENGTH; i++) {
                if (greens[i] && word[i] !== greens[i]) return false;
            }

            // 🟨 Sarılar
            for (let i = 0; i < WORD_LENGTH; i++) {
                if (yellows[i]) {
                    if (!word.includes(yellows[i])) return false;
                    if (word[i] === yellows[i]) return false;
                }
            }

            // ⬜ Gri harfler
            for (const b of bad) {
                if (word.includes(b)) return false;
            }

            return true;
        });

    renderResults(results);
}

/* =========================
   SONUÇLAR
   ========================= */

function renderResults(words) {
    const el = document.getElementById("results");
    el.innerHTML = words.map(w => `<span>${w}</span>`).join("");
}
