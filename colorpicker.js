function hslToRgb(h, s, l){
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255*f(0), 255*f(8), 255*f(4)];
}

function rgbToHsl(r,g,b){
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max+min)/2;
  if(max===min){ h=s=0; }
  else {
    const d = max-min;
    s = l > .5 ? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h = (g-b)/d + (g < b ? 6 : 0); break;
      case g: h = (b-r)/d + 2; break;
      case b: h = (r-g)/d + 4; break;
    }
    h *= 60;
  }
  return [Math.round(h), Math.round(s*100), Math.round(l*100)];
}

function rgbToHex(r,g,b){
  const toHex = x => Math.round(x).toString(16).padStart(2,'0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function updateFromHSL(){
  const h = +document.getElementById('h').value;
  const s = +document.getElementById('s').value;
  const l = +document.getElementById('l').value;
  const [r,g,b] = hslToRgb(h,s,l);
  document.getElementById('r').value = r;
  document.getElementById('g').value = g;
  document.getElementById('b').value = b;
  const hex = rgbToHex(r,g,b);
  document.getElementById('colorHex').value = hex;
}

function updateFromRGB(){
  const r = +document.getElementById('r').value;
  const g = +document.getElementById('g').value;
  const b = +document.getElementById('b').value;
  const [h,s,l] = rgbToHsl(r,g,b);
  document.getElementById('h').value = h;
  document.getElementById('s').value = s;
  document.getElementById('l').value = l;
  const hex = rgbToHex(r,g,b);
  document.getElementById('colorHex').value = hex;
}

function updateFromHex(){
  const hex = document.getElementById('colorHex').value;
  const r = parseInt(hex.substr(1,2),16);
  const g = parseInt(hex.substr(3,2),16);
  const b = parseInt(hex.substr(5,2),16);
  const [h,s,l] = rgbToHsl(r,g,b);
  document.getElementById('r').value = r;
  document.getElementById('g').value = g;
  document.getElementById('b').value = b;
  document.getElementById('h').value = h;
  document.getElementById('s').value = s;
  document.getElementById('l').value = l;
}

['h','s','l'].forEach(id=>{
  document.getElementById(id).addEventListener('input', updateFromHSL);
});
['r','g','b'].forEach(id=>{
  document.getElementById(id).addEventListener('input', updateFromRGB);
});
document.getElementById('colorHex').addEventListener('input', updateFromHex);
