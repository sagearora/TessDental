import { Header } from './Header'
import { Outlet } from 'react-router-dom'

export function DefaultLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
