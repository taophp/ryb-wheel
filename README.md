# RYB Wheel
**Interactive color wheel generating painter-style complementary palettes using the RYB model.**

Live demo (GitHub Pages): https://taophp.github.io/ryb-wheel/

---

## Overview

**RYB Wheel** is a small web demo showing how to derive harmonious color palettes from a single base color using the *Red–Yellow–Blue* (RYB) color model — the traditional *painter’s wheel*, rather than the additive RGB/HSL model used in computer graphics.

It demonstrates how to:
- Convert a base color to HSL,
- Rotate it across the RYB wheel using a continuous hue mapping,
- Generate lighter and darker shades,
- Compute painter-style complementary colors.

All color variables are rendered live in the browser, with a typographic preview (Lorem Ipsum) using the generated palette.

---

## Technical details

The core logic reproduces the concept of the **`spin_ryb`** function described in Stéphane Mourey’s article *“Sass : découverte et couleurs”* — rewritten here in pure JavaScript.

### Features

- Continuous hue transformation between **HSL** and **RYB** through a **monotone spline interpolation** of key hue anchors.
- Pure front-end implementation (HTML, CSS, JS) — no build system required.
- Automatic generation of CSS custom properties (`--main-50` → `--main-900`, `--compl-500`).
- Instant live preview and color editing.
- Works entirely offline and runs on any modern browser.

### Algorithm summary

1. The RYB hue mapping is defined as a series of anchor pairs HSL↔RYB (e.g. 0→0, 60→120, 120→180, 240→240, etc.).
2. Between anchors, hues are interpolated via a **monotonic cubic spline**, ensuring smooth and continuous color transitions without segment breaks.
3. The resulting mapping allows rotations (`spin_ryb(h, amount)`) that mimic the perceptual oppositions used by painters.
4. The palette generator derives light/dark variants and complementary hues using this transformed wheel.

---

## Project structure

ryb-wheel/
├── index.html # main web page and UI
├── style.css # layout and base styles
├── main.js # RYB rotation and palette generator
├── README.md
├── LICENSE # MIT
└── .nojekyll # disables Jekyll processing for GitHub Pages

---

## Possible extensions

- Add palette export (JSON or downloadable CSS file).
- Compare RYB spline mapping to LAB and LCH rotations.
- Implement inverse transformation (RYB → HSL).

---

## Credit
Prototype and code: Stéphane Mourey
Writing assistance and technical adaptation: GPT-5 Thinking mini (AI assistant)

---

> “Because not all complementary colors are born equal — painters knew that first.”
