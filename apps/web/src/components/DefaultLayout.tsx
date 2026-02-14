import { Header } from './Header'
import { PersonNavigator } from './PersonNavigator'
import { Outlet, useLocation } from 'react-router-dom'

export function DefaultLayout() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')
  
  // Header is always 64px (h-16), PersonNavigator is 48px (h-12) when visible
  // PersonNavigator only shows on non-admin pages
  const mainPaddingTop = isAdminPage ? 'pt-16' : 'pt-28'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PersonNavigator />
      <main className={mainPaddingTop}>
        <Outlet />
      </main>
    </div>
  )
}
