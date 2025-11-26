// app/[locale]/[country]/page.tsx - 正确的 TSX 语法
'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// 定义内容接口
interface Content {
  title: string
  greet: string
  subtitle: string
}

export default function LocalizedContent() {
  const params = useParams()
  
  const [content, setContent] = useState<Content>({
    title: 'i18n Example',
    greet: 'Hello!, we could not detect your locale so we defaulted to english.',
    subtitle: 'Localized text based on geolocation headers',
  })

  useEffect(() => {
    // 🎯 从 URL 参数获取信息 - 添加类型安全
    const country = typeof params.country === 'string' ? params.country.toUpperCase() : 'US'
    const locale = typeof params.locale === 'string' ? params.locale : 'en'

    console.log(`显示本地化内容: ${locale}/${country}`)

    // 🎯 定义内容映射
    const contentMap: Record<string, Omit<Content, 'link'>> = {
      'CN': {
        title: '多语言示例',
        greet: '你好！我们检测到您在中国，已为您显示中文内容。',
        subtitle: '基于地理位置的智能内容分发'
      },
      'HK': {
        title: '多语言示例',
        greet: '你好！我们检测到您在中国，已为您显示中文内容。',
        subtitle: '基于地理位置的智能内容分发'
      },
      'TW': {
        title: '多语言示例',
        greet: '你好！我们检测到您在中国，已为您显示中文内容。',
        subtitle: '基于地理位置的智能内容分发'
      },
      'JP': {
        title: '多言語サンプル',
        greet: 'こんにちは！日本からのアクセスを検出しました。',
        subtitle: '地理位置ヘッダーに基づくローカライズされたテキスト'
      },
      'US': {
        title: 'Multilingual Example',
        greet: 'Hello! We detected you are in the United States.',
        subtitle: 'Localized text based on geolocation headers'
      },
      'KR': {
        title: '다국어 예제',
        greet: '안녕하세요! 한국에서 접속을 감지했습니다.',
        subtitle: '지리적 위치 기반의 지능형 콘텐츠 배포'
      },
      'DE': {
        title: 'Mehrsprachiges Beispiel',
        greet: 'Hallo! Wir haben erkannt, dass Sie sich in Deutschland befinden.',
        subtitle: 'Intelligente Inhaltsverteilung basierend auf Geolokalisierung'
      },
      'DEFAULT': {
        title: 'Multilingual Example',
        greet: 'Hello!, we could not detect your locale so we defaulted to english.',
        subtitle: 'Localized text based on geolocation headers'
      }
    }

    // 🎯 安全的类型检查和获取
    const countryKey = Object.keys(contentMap).includes(country) ? country : 'DEFAULT'
    const selectedContent = contentMap[countryKey]

    setContent(prev => ({
      ...prev,
      title: selectedContent.title,
      greet: selectedContent.greet,
      subtitle: selectedContent.subtitle
    }))

  }, [params])

  // 🎯 JSX 样式定义
  const styles = {
    container: {
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#fafafa',
      display: 'flex' as const,
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold' as const,
      color: '#0070f3',
      marginBottom: '2rem',
      textAlign: 'center' as const,
    },
    card: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      marginBottom: '1.5rem',
      maxWidth: '600px',
      width: '100%',
      textAlign: 'center' as const,
    },
    greet: {
      fontSize: '1.25rem',
      lineHeight: '1.6',
      color: '#333',
      margin: 0,
    },
    subtitle: {
      fontSize: '1.1rem',
      lineHeight: '1.5',
      color: '#666',
      margin: 0,
    },
    linkContainer: {
      marginBottom: '2rem',
    },
    link: {
      color: '#0070f3',
      textDecoration: 'none',
      fontSize: '1.1rem',
      fontWeight: '500' as const,
      padding: '0.75rem 1.5rem',
      border: '2px solid #0070f3',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      display: 'inline-block' as const,
    },
    debugCard: {
      backgroundColor: '#f8f9fa',
      padding: '1.5rem',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
      maxWidth: '600px',
      width: '100%',
      marginTop: '2rem',
    },
    debugButton: {
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      marginRight: '0.5rem',
      cursor: 'pointer',
      fontSize: '0.9rem',
    }
  }

  return (
    <main style={styles.container}>
      {/* 🎯 标题 - 使用 JSX 语法 */}
      <h1 style={styles.title}>{content.title}</h1>

      {/* 🎯 问候语 */}
      <div style={styles.card}>
        <p style={styles.greet}>{content.greet}</p>
      </div>

      {/* 🎯 副标题 */}
      <div style={styles.card}>
        <p style={styles.subtitle}>{content.subtitle}</p>
      </div>

    

      {/* 🎯 调试信息卡片 */}
      <div style={styles.debugCard}>
        <h3>地理位置信息</h3>
        <p>当前路径: /{params.locale}/{params.country}</p>
        <p>当前语言: {params.locale}</p>
        <p>当前国家: {params.country}</p>
      </div>
    </main>
  )
}