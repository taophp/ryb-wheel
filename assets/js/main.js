function hexToRgb(hex) {
  hex = hex.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
  const n = parseInt(hex, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) { h = 0; s = 0 }
  else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      default: h = (r - g) / d + 4
    }
    h *= 60
  }
  return [h, s * 100, l * 100]
}

// smooth monotone spline interpolation (Hermite variant)
function splineInterp(x, xs, ys) {
  const n = xs.length;
  if (x <= xs[0]) return ys[0];
  if (x >= xs[n - 1]) return ys[n - 1];
  let i = 1;
  while (x > xs[i]) i++;
  const x0 = xs[i - 1], x1 = xs[i];
  const y0 = ys[i - 1], y1 = ys[i];
  const t = (x - x0) / (x1 - x0);
  const d0 = (i > 1) ? (ys[i] - ys[i - 2]) / (xs[i] - xs[i - 2]) : (y1 - y0) / (x1 - x0);
  const d1 = (i < n - 1) ? (ys[i + 1] - ys[i - 1]) / (xs[i + 1] - xs[i - 1]) : (y1 - y0) / (x1 - x0);
  const t2 = t * t, t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  return h00 * y0 + h10 * d0 * (x1 - x0) + h01 * y1 + h11 * d1 * (x1 - x0);
}

// main RYB rotation using continuous spline mapping
function spin_ryb(h, amount) {
  const wheel = [
    [0, 0], [22, 30], [33, 60], [47, 90],
    [60, 120], [78, 150], [120, 180],
    [192, 210], [240, 240], [360, 360]
  ];

  const xs = wheel.map(([hsl]) => hsl);
  const ys = wheel.map(([, ryb]) => ryb);

  // normalize input hue 0–360
  h = ((h % 360) + 360) % 360;

  // forward transform (HSL→RYB)
  const ryb = splineInterp(h, xs, ys);

  // apply rotation
  let newRyb = (ryb + amount + 360) % 360;

  // inverse transform (RYB→HSL)
  const invXs = ys;
  const invYs = xs;
  const newHue = splineInterp(newRyb, invXs, invYs);

  return ((newHue % 360) + 360) % 360;
}


function updateVars(vars){
  const root = document.documentElement
  for(const k in vars) root.style.setProperty(k, vars[k])
}

function renderPalette(vars){
  const mp = document.getElementById('mainPalette')
  mp.innerHTML='';
  for(const k in vars){
    const div=document.createElement('div')
    div.className='swatch'
    div.textContent=k.replace('--','')
    div.style.background=vars[k]
    mp.appendChild(div)
  }
  const div=document.createElement('div')
}

function listVars(vars){
  const box=document.getElementById('varList')
  box.innerHTML=''
  for(const k in vars){
    const row=document.createElement('div')
    row.className='var-row'
    const s=document.createElement('div')
    s.className='var-sample'
    s.style.background=vars[k]
    row.appendChild(s)
    row.append(k+': '+vars[k])
    box.appendChild(row)
  }
}

function applyToLorem(){
  const lorem=document.getElementById('lorem')
  lorem.style.color='var(--main-900)'
  lorem.style.background='linear-gradient(90deg,var(--main-50),transparent)'
  lorem.querySelector('h3').style.color='var(--main-500)'
}

function generate(){
  const hex=document.getElementById('colorHex').value
  const rot=180
  const [r,g,b]=hexToRgb(hex);
  const [h,s,l]=rgbToHsl(r,g,b);
  const vars = generateSchemes(h,s,l);
  updateVars(vars)
  renderPalette(vars)
  listVars(vars)
  applyToLorem()
}

function generateSchemes(h, s, l) {
  const defs = {
    'main': 0,
    'main+adj': 30,
    'main+rect': 60,
    'main+triad': 120,
    'compl-rect': 120,  // 180-60
    'compl-adj': 150,  // 180-30
    'compl': 180,
    'compl+adj': 210,  // 180+30
    'compl+rect': 240, // 180+60
    'main-triad': -120, // 360-120 = 240
    'main-rect': -60, // 360-60 = 300
    'main-adj': -30, // 360-30 = 330
  };
  const vars = {};
  for (const k in defs) {
    const rot = defs[k];
    const newHue = spin_ryb(h, rot);
    vars[`--${k}`] = `hsl(${newHue} ${s}% ${l}%)`;
  }
  return vars;
}

document.getElementById('gen').onclick=generate

window.onload=generate
