// app/page.js - 主页面 (会被 Middleware 重写)
export default function HomePage() {
  // 这个页面实际上不会直接显示
  // 因为 Middleware 会将 "/" 重写为 "/{locale}/{country}"
  return null
}