import { DOMParser } from '@edge-runtime/deno-dom'

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')

  if (!url) {
    return new Response(JSON.stringify({ error: 'Missing URL parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const response = await fetch(url)
    const html = await response.text()

    const doc = new DOMParser().parseFromString(html, 'text/html')
    if (!doc) {
      throw new Error('Failed to parse HTML')
    }

    const title = doc.querySelector('title')?.textContent || ''
    const description =
      doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
      doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      ''
    const icon =
      doc.querySelector('link[rel="icon"]')?.getAttribute('href') ||
      doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
      doc.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href') ||
      ''

    const absoluteIcon = icon?.startsWith('http') ? icon : new URL(icon || '', url).href

    const result = {
      url,
      title,
      description,
      icon: absoluteIcon,
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch or parse the webpage', detail: String(err) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}