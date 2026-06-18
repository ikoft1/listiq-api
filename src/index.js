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
    const q = url.searchParams.get('q') || ''
    const page = parseInt(url.searchParams.get('page') || '1')

    try {
      if (path === '/search') {
        const res = await fetch('https://api.posokanei.gov.gr/products/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page, page_size: 30, sort_by: 'name', sort_order: 'asc', title: q })
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
