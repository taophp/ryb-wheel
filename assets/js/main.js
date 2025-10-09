const wheel = [
  [0, 0], [22, 30], [33, 60], [47, 90],
  [60, 120], [78, 150], [120, 180],
  [192, 210], [240, 240], [360, 360]
]

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


function makePalette(h,s,l){
  const steps = [50,100,200,300,400,500,600,700,800,900]
  const vars = {}
  steps.forEach(st=>{
    const delta = (st-500)/10
    const nl = Math.max(0,Math.min(100,l - delta))
    vars[`--main-${st}`] = `hsl(${h} ${s}% ${nl}%)`
  })
  return vars
}

function genComplement(h,s,l,rot){
  const nh = spin_ryb(h,rot)
  return [nh,s,l]
}

function updateVars(vars, compl){
  const root = document.documentElement
  for(const k in vars) root.style.setProperty(k, vars[k])
  root.style.setProperty('--main', vars['--main-500'])
  root.style.setProperty('--compl-500', `hsl(${compl[0]} ${compl[1]}% ${compl[2]}%)`)
}

function renderPalette(vars, complHue){
  const mp = document.getElementById('mainPalette')
  const cp = document.getElementById('complPalette')
  mp.innerHTML=''; cp.innerHTML=''
  for(const k in vars){
    const div=document.createElement('div')
    div.className='swatch'
    div.textContent=k.replace('--','')
    div.style.background=vars[k]
    mp.appendChild(div)
  }
  const div=document.createElement('div')
  div.className='swatch'
  div.textContent='compl'
  div.style.background=`hsl(${complHue} 80% 50%)`
  cp.appendChild(div)
}

function listVars(vars, compl){
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
  const row=document.createElement('div')
  row.className='var-row'
  const s=document.createElement('div')
  s.className='var-sample'
  s.style.background=`hsl(${compl[0]} ${compl[1]}% ${compl[2]}%)`
  row.appendChild(s)
  row.append('--compl-500')
  box.appendChild(row)
}

function applyToLorem(){
  const lorem=document.getElementById('lorem')
  lorem.style.color='var(--main-900)'
  lorem.style.background='linear-gradient(90deg,var(--main-50),transparent)'
  lorem.querySelector('h3').style.color='var(--main-500)'
}

function generate(){
  const hex=document.getElementById('colorHex').value
  const rot=Number(document.getElementById('rot').value)
  const [r,g,b]=hexToRgb(hex)
  const [h,s,l]=rgbToHsl(r,g,b)
  const vars=makePalette(h,s,l)
  const compl=genComplement(h,s,l,rot)
  updateVars(vars,compl)
  renderPalette(vars,compl[0])
  listVars(vars,compl)
  applyToLorem()
}

document.getElementById('gen').onclick=generate
document.getElementById('rot').oninput=e=>{
  document.getElementById('rotVal').textContent=e.target.value+'°'
}
window.onload=generate
