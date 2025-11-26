// app/api/location/route.js - 位置信息 API
export async function GET(request: { headers: any }) {
  try {
    // 🎯 从请求头获取 Middleware 设置的地理信息
    const headers = request.headers
    const country = headers.get('x-detected-country') || 'US'
    const city = headers.get('x-detected-city') || 'Unknown'
    const region = headers.get('x-detected-region') || 'Unknown'
    const locale = headers.get('x-locale') || 'en'
    const greeting = headers.get('x-greeting') || 'Default greeting'
    const subtitle = headers.get('x-subtitle') || 'Default subtitle'
    
    // 🎯 返回位置信息
    return Response.json({
      success: true,
      source: 'vercel-geo',
      timestamp: new Date().toISOString(),
      location: {
        country: country,
        city: city,
        region: region,
        locale: locale
      },
      content: {
        greeting: greeting,
        subtitle: subtitle
      },
      headers: Object.fromEntries(headers.entries())
    })
    
  } catch (error) {
    console.error('API 错误:', error)
    return Response.json({
      success: false,
      error: 'Failed to get location info',
      source: 'fallback'
    })
  }
}