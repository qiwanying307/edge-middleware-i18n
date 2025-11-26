// middleware.js - 修复本地开发和字符编码问题
import { type NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge', // req.geo 仅在 Edge Runtime 中可用
  matcher: '/',
}

export default function middleware(req: any) {
  console.log('=== Middleware 调试信息 ===')
  console.log('环境变量 NODE_ENV:', process.env.NODE_ENV)
  console.log('请求的 IP:', req.ip || req.headers.get('x-forwarded-for'))
  console.log('Host:', req.headers.get('host'))
  
  // 🎯 判断是否为本地开发环境
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                       req.headers.get('host')?.includes('localhost') ||
                       req.headers.get('host')?.includes('127.0.0.1')
  
  console.log('是否为开发环境:', isDevelopment)
  
  // 🎯 详细的 geo 信息检查
  console.log('req.geo 存在:', !!req.geo)
  if (req.geo) {
    console.log('req.geo 完整对象:', JSON.stringify(req.geo, null, 2))
  }
  
  // 🎯 检查 Vercel 特定的头部信息
  const vercelCountry = req.headers.get('x-vercel-ip-country')
  const vercelCity = req.headers.get('x-vercel-ip-city')
  console.log('x-vercel-ip-country:', vercelCountry)
  console.log('x-vercel-ip-city:', vercelCity)
  
  // 🎯 获取地理位置信息（多源策略）
  let country = 'US'
  let city = 'Unknown'
  let region = 'Unknown'
  let detectionMethod = 'default'
  
  // 策略 1: Vercel Geo (仅在生产环境)
  if (!isDevelopment && req.geo?.country) {
    country = req.geo.country
    city = req.geo.city || 'Unknown'
    region = req.geo.region || 'Unknown'
    detectionMethod = 'vercel-geo'
    console.log('✅ 使用 Vercel Geo 数据')
  }
  // 策略 2: Vercel 头部信息 (仅在生产环境)
  else if (!isDevelopment && vercelCountry) {
    country = vercelCountry || 'US'
    city = vercelCity || 'Unknown'
    detectionMethod = 'vercel-headers'
    console.log('✅ 使用 Vercel 头部数据')
  }
  
  console.log(`🎯 最终检测结果: ${country} (检测方法: ${detectionMethod})`)
  
  // 🎯 根据国家代码设置本地化内容
  let locale = 'en'
  // 🔧 修复：使用 ASCII 字符的字符串，避免 Header 编码问题
  let greetKey = 'en_default'
  let subtitleKey = 'en_subtitle'
  
  // 使用键值对而不是直接的中文字符串
  switch (country) {
    case 'CN':  // 中国
      locale = 'zh'
      greetKey = 'zh_greet'
      subtitleKey = 'zh_subtitle'
      break
    case 'JP':  // 日本
      locale = 'ja'
      greetKey = 'ja_greet'
      subtitleKey = 'ja_subtitle'
      break
    case 'US':  // 美国
      locale = 'en'
      greetKey = 'en_greet'
      subtitleKey = 'en_subtitle'
      break
    case 'KR':  // 韩国
      locale = 'ko'
      greetKey = 'ko_greet'
      subtitleKey = 'ko_subtitle'
      break
    case 'DE':  // 德国
      locale = 'de'
      greetKey = 'de_greet'
      subtitleKey = 'de_subtitle'
      break
    default:    // 其他国家默认英语
      locale = 'en'
      greetKey = 'en_default'
      subtitleKey = 'en_subtitle'
  }
  
  // 🎯 重写 URL 到本地化页面
  const normalizedCountry = country.toLowerCase()
  req.nextUrl.pathname = `/${locale}/${normalizedCountry}`
  
  console.log('重写到路径:', req.nextUrl.pathname)
  
  // 🎯 创建响应
  const response = NextResponse.rewrite(req.nextUrl)
  
  // 🔧 修复：只设置 ASCII 字符的 Header，避免编码问题
  response.headers.set('x-detected-country', country)
  response.headers.set('x-detected-city', city)
  response.headers.set('x-detected-region', region)
  response.headers.set('x-locale', locale)
  response.headers.set('x-detection-method', detectionMethod)
  response.headers.set('x-greet-key', greetKey)      // 使用键值
  response.headers.set('x-subtitle-key', subtitleKey) // 使用键值
  response.headers.set('x-is-development', isDevelopment.toString())
  
  // 🧪 开发环境：设置 Cookie 以便测试
  if (isDevelopment && req.nextUrl.searchParams.get('set-cookie')) {
    response.cookies.set('user-country-preference', country, { 
      maxAge: 60 * 60 * 24, // 24小时
      httpOnly: false,
      sameSite: 'lax'
    })
    console.log('🍪 设置测试 Cookie:', country)
  }
  
  console.log('=== Middleware 执行完成 ===')
  return response
}