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
const Music = lazy(() => import('./pages/Music'))
const Discover = lazy(() => import('./pages/Discover'))
const Bingo = lazy(() => import('./pages/Bingo'))
const Weather = lazy(() => import('./pages/Weather'))
const Quiz = lazy(() => import('./pages/Quiz'))
const Budget = lazy(() => import('./pages/Budget'))

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
              <Route path="/music" element={<Music />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/bingo" element={<Bingo />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/budget" element={<Budget />} />
            </Routes>
          </Suspense>
        </main>
        <BottomNav />
      </HashRouter>
    </AuthProvider>
  )
}
