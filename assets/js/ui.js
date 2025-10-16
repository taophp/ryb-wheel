function clamp(v, min, max){ return Math.min(Math.max(v, min), max); }

function hslToRgb(h,s,l){
  s/=100; l/=100;
  const k=n=>(n+h/30)%12;
  const a=s*Math.min(l,1-l);
  const f=n=>l - a*Math.max(-1, Math.min(k(n)-3, Math.min(9-k(n),1)));
  return [255*f(0),255*f(8),255*f(4)];
}

function rgbToHsl(r,g,b){
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h,s,l=(max+min)/2;
  if(max===min){h=s=0;}
  else{
    const d=max-min;
    s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){
      case r:h=(g-b)/d+(g<b?6:0);break;
      case g:h=(b-r)/d+2;break;
      default:h=(r-g)/d+4;
    }
    h*=60;
  }
  return [Math.round(h),Math.round(s*100),Math.round(l*100)];
}

function rgbToHex(r,g,b){
  const toHex=x=>Math.round(x).toString(16).padStart(2,'0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex){
  hex=hex.replace('#','');
  if(hex.length===3) hex=hex.split('').map(c=>c+c).join('');
  const n=parseInt(hex,16);
  return [(n>>16)&255,(n>>8)&255,n&255];
}

function updateUIFromHSL(){
  const h=+hInp.value, s=+sInp.value, l=+lInp.value;
  const [r,g,b]=hslToRgb(h,s,l);
  syncRGB(r,g,b);
  syncHex(rgbToHex(r,g,b));
  updateMainColor(rgbToHex(r,g,b));
}

function updateUIFromRGB(){
  const r=+rInp.value, g=+gInp.value, b=+bInp.value;
  const [h,s,l]=rgbToHsl(r,g,b);
  syncHSL(h,s,l);
  syncHex(rgbToHex(r,g,b));
  updateMainColor(rgbToHex(r,g,b));
}

function updateUIFromHex(){
  const hex=colorHex.value;
  if(!/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex)) return;
  const [r,g,b]=hexToRgb(hex);
  syncRGB(r,g,b);
  const [h,s,l]=rgbToHsl(r,g,b);
  syncHSL(h,s,l);
  updateMainColor(hex);
  syncHex(hex);
}

function syncHSL(h,s,l){
  hInp.value=h; sInp.value=s; lInp.value=l;
  hVal.value=h; sVal.value=s; lVal.value=l;
}
function syncRGB(r,g,b){
  rInp.value=r; gInp.value=g; bInp.value=b;
  rVal.value=r; gVal.value=g; bVal.value=b;
}
function syncHex(hex){
  colorHex.value=hex.toLowerCase();
  colorNative.value=hex;
}

function updateMainColor(hex){
  document.documentElement.style.setProperty('--main', hex);
  generate();
}

const hInp=document.getElementById('h');
const sInp=document.getElementById('s');
const lInp=document.getElementById('l');
const rInp=document.getElementById('r');
const gInp=document.getElementById('g');
const bInp=document.getElementById('b');
const hVal=document.getElementById('hVal');
const sVal=document.getElementById('sVal');
const lVal=document.getElementById('lVal');
const rVal=document.getElementById('rVal');
const gVal=document.getElementById('gVal');
const bVal=document.getElementById('bVal');
const colorHex=document.getElementById('colorHex');
const colorNative=document.getElementById('colorNative');

[hInp,sInp,lInp].forEach(inp=>inp.addEventListener('input',()=>{
  hVal.value=hInp.value; sVal.value=sInp.value; lVal.value=lInp.value;
  updateUIFromHSL();
}));
[hVal,sVal,lVal].forEach(inp=>inp.addEventListener('input',()=>{
  hInp.value=hVal.value; sInp.value=sVal.value; lInp.value=lVal.value;
  updateUIFromHSL();
}));

[rInp,gInp,bInp].forEach(inp=>inp.addEventListener('input',()=>{
  rVal.value=rInp.value; gVal.value=gInp.value; bVal.value=bInp.value;
  updateUIFromRGB();
}));
[rVal,gVal,bVal].forEach(inp=>inp.addEventListener('input',()=>{
  rInp.value=rVal.value; gInp.value=gVal.value; bInp.value=bVal.value;
  updateUIFromRGB();
}));

colorHex.addEventListener('input', updateUIFromHex);
colorNative.addEventListener('input', e=>{
  colorHex.value=e.target.value;
  updateUIFromHex();
});

// init
updateUIFromHex();


function drawRYBWheel() {
  const wheel = document.getElementById('rybWheel');
  const ctx = wheel.getContext('2d');
  const size = wheel.width;
  const r = size / 2;
  const imgData = ctx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - r, dy = y - r;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist > r) continue;
      let angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360 + 90) % 360;
      const rybHue = spin_ryb(angle, 0);
      const [rr, gg, bb] = hslToRgb(rybHue, 100, 50);
      const i = (y * size + x) * 4;
      imgData.data[i] = rr;
      imgData.data[i + 1] = gg;
      imgData.data[i + 2] = bb;
      imgData.data[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

const rybWheel = document.getElementById('rybWheel');
const ctx = rybWheel.getContext('2d');
const img = new Image();
img.src = 'ryb-wheel.png'; // ton image circulaire RYB
img.onload = () => ctx.drawImage(img, 0, 0, 256, 256);

rybWheel.addEventListener('click', e => {
  const rect = rybWheel.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const data = ctx.getImageData(x, y, 1, 1).data;
  const [r, g, b] = data;
  const hex = rgbToHex(r, g, b);
  colorHex.value = hex;
  updateUIFromHex();
});



window.addEventListener('DOMContentLoaded', drawRYBWheel);
