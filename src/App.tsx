import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'

const Colors = lazy(() => import('./pages/Colors'))
const Guide = lazy(() => import('./pages/Guide'))
const Timetable = lazy(() => import('./pages/Timetable'))
const Checklist = lazy(() => import('./pages/Checklist'))
const Settings = lazy(() => import('./pages/Settings'))
const MyEditions = lazy(() => import('./pages/MyEditions'))

function PageLoader() {
  return <div className="flex flex-1 items-center justify-center"><span className="text-gray-500">...</span></div>
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/colors" element={<Colors />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/checklist" element={<Checklist />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/my-editions" element={<MyEditions />} />
            </Routes>
          </Suspense>
        </main>
        <BottomNav />
      </HashRouter>
    </AuthProvider>
  )
}
