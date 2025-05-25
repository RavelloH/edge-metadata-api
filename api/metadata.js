export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')

  if (!url) {
    return new Response(JSON.stringify({ error: 'Missing URL parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }

  try {
    // 先发送 HEAD 请求检查 Content-Type
    const headResponse = await fetch(url, { method: 'HEAD' })
    const contentType = headResponse.headers.get('content-type') || ''
    
    if (!contentType.includes('text/html')) {
      return new Response(
        JSON.stringify({ error: 'URL does not point to an HTML document', contentType }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        }
      )
    }

    // 发送 GET 请求获取 HTML 内容
    const response = await fetch(url)
    const html = await response.text()

    // 使用正则表达式提取元数据
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ''

    const descriptionMatch =
      html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
      html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:description["']/i)
    const description = descriptionMatch ? descriptionMatch[1].trim() : ''

    const iconMatch =
      html.match(/<link[^>]*rel=["']icon["'][^>]*href=["']([^"']*)["']/i) ||
      html.match(/<link[^>]*rel=["']shortcut icon["'][^>]*href=["']([^"']*)["']/i) ||
      html.match(/<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']*)["']/i) ||
      html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']icon["']/i) ||
      html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']shortcut icon["']/i) ||
      html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']apple-touch-icon["']/i)
    const icon = iconMatch ? iconMatch[1].trim() : ''

    const absoluteIcon = icon?.startsWith('http') ? icon : new URL(icon || '', url).href

    const result = {
      url,
      title,
      description,
      icon: absoluteIcon,
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch or parse the webpage', detail: String(err) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    )
  }
}