const i18n = {
  en: {
    title: "🎨 RYB Palette",
    sub: "Generating painter-style color palettes using the RYB color wheel.",
    colorLabel: "Color:",
    rotLabel: "RYB rotation:",
    generate: "Generate",
    loremTitle: "Sample title",
    loremText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer accumsan, est non interdum cursus, arcu nisi luctus elit.",
    loremNote: "CSS variables generated below are used to color this preview."
  },
  fr: {
    title: "🎨 Palette RYB",
    sub: "Génère des palettes de couleurs de style peintre selon la roue RYB.",
    colorLabel: "Couleur :",
    rotLabel: "Rotation RYB :",
    generate: "Générer",
    loremTitle: "Titre d’exemple",
    loremText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer accumsan, est non interdum cursus, arcu nisi luctus elit.",
    loremNote: "Les variables CSS ci-dessous colorent cet aperçu typographique."
  }
}

function detectLang() {
  const stored = localStorage.getItem('lang')
  if (stored) return stored
  const nav = navigator.language || navigator.userLanguage || 'en'
  return nav.startsWith('fr') ? 'fr' : 'en'
}

let currentLang = detectLang()

function setLang(lang) {
  currentLang = lang
  localStorage.setItem('lang', lang)
  const t = i18n[lang]
  document.getElementById('t-title').textContent = t.title
  document.getElementById('t-sub').textContent = t.sub
  document.getElementById('t-color-label').childNodes[0].textContent = t.colorLabel + ' '
  document.getElementById('t-rot-label').childNodes[0].textContent = t.rotLabel + ' '
  document.getElementById('gen').textContent = t.generate
  const h3 = document.querySelector('#lorem h3')
  const ps = document.querySelectorAll('#lorem p')
  if (h3) h3.textContent = t.loremTitle
  if (ps[0]) ps[0].textContent = t.loremText
  if (ps[1]) ps[1].textContent = t.loremNote
  document.querySelectorAll('.lang-switch button').forEach(b=>{
    b.classList.toggle('active', b.dataset.lang === lang)
  })
}

document.addEventListener('click', e=>{
  if (e.target.matches('.lang-switch button')) {
    setLang(e.target.dataset.lang)
  }
})

window.addEventListener('DOMContentLoaded', ()=>{
  setLang(currentLang)
})
