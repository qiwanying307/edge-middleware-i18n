// middleware.js - 修复本地开发和字符编码问题
import { type NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: '/',
}

export default function middleware(req: any) {
  console.log('=== Middleware 调试信息 ===')
  console.log('环境变量 NODE_ENV:', process.env.NODE_ENV)
  console.log('请求的 IP:', req.ip || req.headers.get('x-forwarded-for'))
  console.log('Host:', req.headers.get('host'))

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

  // 策略 1: Vercel Geo (仅在生产环境) 不可用
  if (req.geo?.country) {
    country = req.geo.country
    city = req.geo.city || 'Unknown'
    region = req.geo.region || 'Unknown'
    detectionMethod = 'vercel-geo'
    console.log('✅ 使用 Vercel Geo 数据')
  }
  // 策略 2: Vercel 头部信息 (仅在生产环境)
  else if (vercelCountry) {
    country = vercelCountry || 'US'
    city = vercelCity || 'Unknown'
    detectionMethod = 'vercel-headers'
    console.log('✅ 使用 Vercel 头部数据')
  }

  console.log(`🎯 最终检测结果: ${country} (检测方法: ${detectionMethod})`)

  let locale = 'en'
  let greetKey = 'en_default'
  let subtitleKey = 'en_subtitle'

  // 使用键值对而不是直接的中文字符串
  switch (country) {
    case 'CN':  // 中国
      locale = 'zh'
      break
    case 'HK':  // 中国
      locale = 'zh'
      break
    case 'TW':  // 中国
      locale = 'zh'
      break
    case 'JP':  // 日本
      locale = 'ja'
      break
    case 'US':  // 美国
      locale = 'en'
      break
    case 'KR':  // 韩国
      locale = 'ko'
      break
    case 'DE':  // 德国
      locale = 'de'
      break
    default:    // 其他国家默认英语
      locale = 'en'
  }

  // 🎯 重写 URL 到本地化页面
  const normalizedCountry = country.toLowerCase()
  req.nextUrl.pathname = `/${locale}/${normalizedCountry}`

  console.log('重写到路径:', req.nextUrl.pathname)

  // 🎯 创建响应
  const response = NextResponse.rewrite(req.nextUrl)

  response.headers.set('x-detected-country', country)
  response.headers.set('x-detected-city', city)
  response.headers.set('x-detected-region', region)
  response.headers.set('x-locale', locale)
  response.headers.set('x-detection-method', detectionMethod)
  response.headers.set('x-greet-key', greetKey)      // 使用键值
  response.headers.set('x-subtitle-key', subtitleKey) // 使用键值


  console.log('=== Middleware 执行完成 ===')
  return response
}