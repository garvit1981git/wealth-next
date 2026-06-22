// app/actions/polyfill.js
import canvas from '@napi-rs/canvas';

if (typeof globalThis.DOMMatrix === 'undefined') {
  globalThis.DOMMatrix = canvas.DOMMatrix;
}
if (typeof globalThis.ImageData === 'undefined') {
  globalThis.ImageData = canvas.ImageData;
}