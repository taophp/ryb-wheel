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

function spin_ryb(h, amount) {
  const clamp = (x,a,b)=>Math.min(Math.max(x,a),b)
  const interp = (a,b,t)=>a+(b-a)*t
  const findSeg = h => {
    for (let i=0;i<wheel.length-1;i++){
      const [x1]=wheel[i],[x2]=wheel[i+1]
      if (h>=x1 && h<=x2) return i
    }
    return wheel.length-2
  }
  h = ((h%360)+360)%360
  let i = findSeg(h)
  const [h1,ryb1] = wheel[i], [h2,ryb2] = wheel[i+1]
  const t = (h - h1) / (h2 - h1 || 1)
  let a = interp(ryb1, ryb2, t)
  a = (a + amount + 360) % 360
  let j
  for (j=0;j<wheel.length-1;j++){
    const [r1]=wheel[j],[r2]=wheel[j+1]
    if (a>=r1 && a<=r2) break
  }
  const [r1,ry1]=wheel[j],[r2,ry2]=wheel[j+1]
  const tt = (a - ry1) / (ry2 - ry1 || 1)
  const newHue = interp(r1, r2, tt)
  return ((newHue%360)+360)%360
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
