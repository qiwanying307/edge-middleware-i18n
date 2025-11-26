// middleware.js - 使用 Vercel request.geo 获取国家信息
import { type NextRequest, NextResponse } from 'next/server'

// only run middleware on home page
export const config = {
  matcher: '/',
}

export default function middleware(req: any) {
  // 🎯 使用 Vercel 内置的 geo 信息 (无需额外依赖)
  const country = req.geo?.country || 'US'  // 如: "CN", "JP", "US"
  const city = req.geo?.city || 'Unknown'
  const region = req.geo?.region || 'Unknown'

  console.log(`🌍 检测到地理位置: 国家=${country}, 城市=${city}, 地区=${region}`)
  console.log('req.geo:',  req.geo);
  
  // 🎯 根据国家代码设置本地化内容
  let locale = 'en'
  let greet = 'Hello!, we could not detect your locale so we defaulted to english.'
  let subtitle = 'Localized text based on geolocation headers'

  // 根据国家设置内容
  switch (country) {
    case 'CN':  // 中国
      locale = 'zh'
      greet = '你好！我们检测到您在中国，已为您显示中文内容。'
      subtitle = '基于地理位置的智能内容分发'
      break
    case 'JP':  // 日本
      locale = 'ja'
      greet = 'こんにちは！日本からのアクセスを検出しました。'
      subtitle = '地理位置ヘッダーに基づくローカライズされたテキスト'
      break
    case 'US':  // 美国
      locale = 'en'
      greet = 'Hello! We detected you are in the United States.'
      subtitle = 'Localized text based on geolocation headers'
      break
    case 'KR':  // 韩国
      locale = 'ko'
      greet = '안녕하세요! 한국에서 접속을 감지했습니다.'
      subtitle = '지리적 위치 기반의 지능형 콘텐츠 배포'
      break
    case 'DE':  // 德国
      locale = 'de'
      greet = 'Hallo! Wir haben erkannt, dass Sie sich in Deutschland befinden.'
      subtitle = 'Intelligente Inhaltsverteilung basierend auf Geolokalisierung'
      break
    default:    // 其他国家默认英语
      locale = 'en'
      greet = 'Hello!, we could not detect your locale so we defaulted to english.'
      subtitle = 'Localized text based on geolocation headers'
  }

  // 🎯 重写 URL 到本地化页面
  // 格式: /en/us, /zh/cn, /ja/jp
  const normalizedCountry = country.toLowerCase()
  req.nextUrl.pathname = `/${locale}/${normalizedCountry}`

  console.log('req.nextUrl:', req.nextUrl);
  
  // 🎯 创建响应并设置自定义 Header
  const response = NextResponse.rewrite(req.nextUrl)

  // // 设置自定义 Header，供前端页面使用
  // response.headers.set('x-detected-country', country)
  // response.headers.set('x-detected-city', city)
  // response.headers.set('x-detected-region', region)
  // response.headers.set('x-locale', locale)
  // response.headers.set('x-greeting', greet)
  // response.headers.set('x-subtitle', subtitle)
  
  return response
}