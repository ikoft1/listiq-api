const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// Keyword → category ID map
const CATEGORY_MAP = {
  // Γαλακτοκομικά
  'γαλ': 'b2a17c2ad4235ea8574d6027636cb739',
  'τυρ': 'b2a17c2ad4235ea8574d6027636cf85d',
  'γιαουρτ': 'b2a17c2ad4235ea8574d6027636cf9c5',
  'αυγ': 'b2a17c2ad4235ea8574d6027636c6884',
  'βουτυρ': 'b2a17c2ad4235ea8574d602763678945',
  'κρεμ': '10c35e2fcbe94c9cbe0d0d3d47bedc02',
  // Κρεατικά
  'αλλαντ': 'b2a17c2ad4235ea8574d6027636ca82c',
  'ζαμπον': 'b2a17c2ad4235ea8574d6027636ca82c',
  // Βασικά τρόφιμα
  'ζυμαρ': 'b2a17c2ad4235ea8574d6027635d7c07',
  'μακαρον': 'b2a17c2ad4235ea8574d6027635d7c07',
  'σπαγ': 'b2a17c2ad4235ea8574d6027635d7c07',
  'ρυζ': 'b2a17c2ad4235ea8574d602763773ab5',
  'οσπρι': 'b2a17c2ad4235ea8574d60276377f2ba',
  'φακ': 'b2a17c2ad4235ea8574d60276377f2ba',
  'φασολ': 'b2a17c2ad4235ea8574d60276377f2ba',
  'ρεβυθ': 'b2a17c2ad4235ea8574d60276377f2ba',
  'ψωμ': 'b2a17c2ad4235ea8574d602763721135',
  // Λάδια
  'λαδ': 'b2a17c2ad4235ea8574d6027636cbda9',
  'ελαιολαδ': 'b2a17c2ad4235ea8574d602763785257',
  'ηλιελαι': 'b2a17c2ad4235ea8574d602763786edf',
  // Ποτά
  'καφ': 'b2a17c2ad4235ea8574d602763685e44',
  'μπυρ': 'b2a17c2ad4235ea8574d602763965cf7',
  'κρασ': 'b2a17c2ad4235ea8574d60276395d5d4',
  'νερ': 'b2a17c2ad4235ea8574d60276397e910',
  'αναψυκτ': 'b2a17c2ad4235ea8574d602763921e32',
  'χυμ': 'b2a17c2ad4235ea8574d60276396b33f',
  // Σνακ
  'πατατακ': 'b2a17c2ad4235ea8574d6027636c473a',
  'σοκολατ': 'b2a17c2ad4235ea8574d6027636c5545',
  'μπισκοτ': 'b2a17c2ad4235ea8574d6027637a69f1',
  'σνακ': 'b2a17c2ad4235ea8574d6027637a599a',
  // Άλλα
  'κατεψυγ': 'b2a17c2ad4235ea8574d60276393ddb0',
  'κονσερβ': '8c7d31ae-f578-443f-95c2-9b5b0d2b1803',
  'τον': 'b2a17c2ad4235ea8574d6027639109e5',
}

function normalize(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function getCategoryId(query) {
  const q = normalize(query)
  for (const [keyword, catId] of Object.entries(CATEGORY_MAP)) {
    if (q.includes(normalize(keyword))) return catId
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
          sort_by: 'name',
          sort_order: 'asc',
          title: q,
          countries: ['GR'],
        }
        if (categoryId) body.category = categoryId

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
