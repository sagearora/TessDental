import { Header } from './Header'
import { PersonNavigator } from './PersonNavigator'
import { Outlet, useLocation } from 'react-router-dom'

export function DefaultLayout() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')
  const isImagingPage = location.pathname.startsWith('/imaging/')

  // Header is always 64px (h-16), PersonNavigator is 48px (h-12) when visible
  // PersonNavigator only shows on non-admin pages
  const mainPaddingTop = isAdminPage ? 'pt-16' : 'pt-28'
  // Imaging page needs overflow-hidden for its flex layout; other pages need scroll
  const mainOverflow = isImagingPage ? 'overflow-hidden' : 'overflow-y-auto'
  const mainPaddingBottom = isImagingPage ? '' : 'pb-6'

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <Header />
      <PersonNavigator />
      <main className={`flex-1 min-h-0 ${mainOverflow} ${mainPaddingTop} ${mainPaddingBottom}`}>
        <Outlet />
      </main>
    </div>
  )
}
