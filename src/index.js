const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS })

    const url = new URL(request.url)
    const path = url.pathname

    // Search: GET /search?q=γάλα
    if (path === '/search') {
      const q = url.searchParams.get('q') || ''
      const res = await fetch('https://api.posokanei.gov.gr/products/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 1, page_size: 15, sort_by: 'name', sort_order: 'asc', title: q })
      })
      const data = await res.json()
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', ...CORS }
      })
    }

    // Barcode: GET /barcode/5201234567890
    if (path.startsWith('/barcode/')) {
      const barcode = path.split('/barcode/')[1]
      const res = await fetch('https://api.posokanei.gov.gr/products/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 1, page_size: 5, barcode: barcode })
      })
      const data = await res.json()
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', ...CORS }
      })
    }

    // Product prices: GET /prices/PRODUCT_ID
    if (path.startsWith('/prices/')) {
      const id = path.split('/prices/')[1]
      const res = await fetch(`https://api.posokanei.gov.gr/products/${id}/prices`, {
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.json()
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', ...CORS }
      })
    }

    return new Response('Not found', { status: 404, headers: CORS })
  }
}
