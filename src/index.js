const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function normalize(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

const CATEGORY_MAP = [
  // --- ΓΑΛΑ ---
  ['φρεσκο γαλ', 'b2a17c2ad4235ea8574d602763927bee'],
  ['γαλ υψηλης', 'b2a17c2ad4235ea8574d6027639286fb'],
  ['σοκολατουχ', 'b2a17c2ad4235ea8574d60276393167b'],
  ['εβαπορε', 'b2a17c2ad4235ea8574d60276392aa67'],
  ['γαλ', 'b2a17c2ad4235ea8574d6027636cb739'],
  // --- ΤΥΡΙΑ ---
  ['φετ', '5f277dd598114bc2902432b1045806df'],
  ['γκουντ', '24aa501ae45b4e3e8a1269d8b96bfde5'],
  ['γραβιερ', '18082a808952446192226936b3f6e6c0'],
  ['κεφαλογραβιερ', '06b6142f30cf4875a7a70406d7b3dcf7'],
  ['κεφαλοτυρ', '075d3f88e16d4522a4c86d669b43eb94'],
  ['κασερ', 'e6d74d0fbca34796839a7c41ab5ac85f'],
  ['μοτσαρελ', '460cbeab752d4303b28623cf2f6f1275'],
  ['κοτατζ', '5b944f78182f4f4880a201d10925bc92'],
  ['κρεμ τυρ', '5b944f78182f4f4880a201d10925bc92'],
  ['εμμενταλ', 'ec9d6e942f2e477280e19481650ca9bd'],
  ['τσενταρ', 'da8bc870ee6c4309b0b2fdef1c8c7991'],
  ['ανθοτυρ', '776904c861024191b6bb1293d4e29f2b'],
  ['μυζηθρ', 'c4909950b6c64621904680b5dc6d9051'],
  ['χαλουμ', '216b9448913140ea91da7d2cdab510c1'],
  ['τυρ', 'b2a17c2ad4235ea8574d6027636cf85d'],
  // --- ΓΙΑΟΥΡΤΙ ---
  ['στραγγιστ', 'b2a17c2ad4235ea8574d60276393776f'],
  ['παιδικο γιαουρτ', 'b2a17c2ad4235ea8574d602763939296'],
  ['γιαουρτ', 'b2a17c2ad4235ea8574d6027636cf9c5'],
  // --- ΑΥΓΑ ---
  ['αυγ', 'b2a17c2ad4235ea8574d6027636c6884'],
  // --- ΒΟΥΤΥΡΟ ---
  ['μαργαριν', 'b2a17c2ad4235ea8574d602763789c5c'],
  ['βουτυρ', 'b2a17c2ad4235ea8574d602763678945'],
  // --- ΚΡΕΜΑ ΓΑΛΑΚΤΟΣ ---
  ['κρεμ γαλ', '10c35e2fcbe94c9cbe0d0d3d47bedc02'],
  ['σαντιγυ', 'b2a17c2ad4235ea8574d60276393ab81'],
  // --- ΑΛΛΑΝΤΙΚΑ ---
  ['αλλαντ', 'b2a17c2ad4235ea8574d6027636ca82c'],
  ['ζαμπον', 'b2a17c2ad4235ea8574d6027636ca82c'],
  ['γαλοπουλ', 'b2a17c2ad4235ea8574d6027636ca82c'],
  // --- ΖΥΜΑΡΙΚΑ ---
  ['σπαγγετ', 'b2a17c2ad4235ea8574d602763764783'],
  ['πεννε', 'b2a17c2ad4235ea8574d602763764b5a'],
  ['κριθαρακ', 'b2a17c2ad4235ea8574d60276376c578'],
  ['λαζαν', 'b2a17c2ad4235ea8574d602763765afd'],
  ['ζυμαρ', 'b2a17c2ad4235ea8574d6027635d7c07'],
  ['μακαρον', 'b2a17c2ad4235ea8574d6027635d7c07'],
  // --- ΡΥΖΙ ---
  ['μπασματ', 'b2a17c2ad4235ea8574d6027637749d7'],
  ['καρολιν', '07115c52d43244a8ab996e5522e2cfb7'],
  ['ρυζ', 'b2a17c2ad4235ea8574d602763773ab5'],
  // --- ΟΣΠΡΙΑ ---
  ['φακ', 'b2a17c2ad4235ea8574d6027637803b7'],
  ['φασολ', 'b2a17c2ad4235ea8574d60276377eda9'],
  ['ρεβυθ', 'b2a17c2ad4235ea8574d602763780cc2'],
  ['οσπρι', 'b2a17c2ad4235ea8574d60276377f2ba'],
  // --- ΨΩΜΙ ---
  ['ψωμ', 'b2a17c2ad4235ea8574d602763721135'],
  // --- ΛΑΔΙ ---
  ['ελαιολαδ', 'b2a17c2ad4235ea8574d602763785257'],
  ['ηλιελαι', 'b2a17c2ad4235ea8574d602763786edf'],
  ['αραβοσιτελαι', 'b2a17c2ad4235ea8574d6027637877fd'],
  ['λαδ', 'b2a17c2ad4235ea8574d6027636cbda9'],
  ['ξυδ', 'b2a17c2ad4235ea8574d6027636ce8fa'],
  // --- ΚΑΦΕΣ ---
  ['εσπρεσ', 'KcvsdeGnF3J6812z2iUBIbN1QllU1Ptk'],
  ['ελληνικ καφ', 'b2a17c2ad4235ea8574d60276381f3aa'],
  ['στιγμιαι', 'b2a17c2ad4235ea8574d6027637cbb6e'],
  ['καφ', 'b2a17c2ad4235ea8574d602763685e44'],
  // --- ΠΟΤΑ ---
  ['μπυρ', 'b2a17c2ad4235ea8574d602763965cf7'],
  ['κρασ', 'b2a17c2ad4235ea8574d60276395d5d4'],
  ['νερ', 'b2a17c2ad4235ea8574d60276397e910'],
  ['αναψυκτ', 'b2a17c2ad4235ea8574d602763921e32'],
  ['χυμ', 'b2a17c2ad4235ea8574d60276396b33f'],
  // --- ΣΝΑΚ ---
  ['πατατακ', 'b2a17c2ad4235ea8574d6027636c473a'],
  ['γαριδακ', 'b2a17c2ad4235ea8574d6027637a8ee6'],
  ['νατσ', 'b2a17c2ad4235ea8574d6027637aa80e'],
  ['σνακ', 'b2a17c2ad4235ea8574d6027637a599a'],
  // --- ΣΟΚΟΛΑΤΕΣ / ΜΠΙΣΚΟΤΑ ---
  ['σοκολατ γαλακτ', 'b2a17c2ad4235ea8574d6027637b09c3'],
  ['μαυρη σοκολατ', 'b2a17c2ad4235ea8574d6027637b1519'],
  ['σοκολατ', 'b2a17c2ad4235ea8574d6027636c5545'],
  ['μπισκοτ', 'b2a17c2ad4235ea8574d6027637a69f1'],
  // --- ΚΑΤΕΨΥΓΜΕΝΑ ---
  ['παγωτ', 'b2a17c2ad4235ea8574d6027636c8a38'],
  ['κατεψυγ', 'b2a17c2ad4235ea8574d60276393ddb0'],
  // --- ΚΟΝΣΕΡΒΕΣ ---
  ['τον', 'b2a17c2ad4235ea8574d6027639109e5'],
  // --- ΑΛΛΑ ---
  ['δημητριακ', 'b2a17c2ad4235ea8574d60276384b26a'],
  ['μελ', 'b2a17c2ad4235ea8574d6027636c99fc'],
  ['χαρτ', 'b2a17c2ad4235ea8574d6027639e561f'],
]

function getCategoryId(q) {
  const norm = normalize(q)
  for (const [keyword, catId] of CATEGORY_MAP) {
    if (norm.includes(normalize(keyword))) return catId
  }
  return null
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS })

    const url = new URL(request.url)
    const path = url.pathname
    const q = url.searchParams.get('q') || ''
    const page = parseInt(url.searchParams.get('page') || '1')

    try {
      if (path === '/search') {
        const categoryId = getCategoryId(q)
        const body = {
          page,
          page_size: 30,
          sort_by: 'unit_price',
          sort_order: 'asc',
          countries: ['GR'],
        }

        if (categoryId) {
          // Έχουμε exact category match → μόνο category, χωρίς title
          // Αλλιώς φέρνει πίτες/άσχετα που απλώς "αναφέρουν" τη λέξη
          body.category = categoryId
        } else {
          // Δεν ξέρουμε κατηγορία → free text search
          body.title = q
        }

        const res = await fetch('https://api.posokanei.gov.gr/products/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        const data = await res.json()
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json', ...CORS }
        })
      }

      if (path.startsWith('/barcode/')) {
        const barcode = path.split('/barcode/')[1]
        const res = await fetch('https://api.posokanei.gov.gr/products/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page: 1, page_size: 5, barcode })
        })
        const data = await res.json()
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json', ...CORS }
        })
      }

      return new Response('Not found', { status: 404, headers: CORS })

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS }
      })
    }
  }
}
