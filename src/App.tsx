import { lazy, Suspense, Component, type ReactNode } from 'react'
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
const News = lazy(() => import('./pages/News'))
const Festival = lazy(() => import('./pages/Festival'))
const More = lazy(() => import('./pages/More'))
const GenreFamily = lazy(() => import('./pages/GenreFamily'))

function PageLoader() {
  return <div className="flex flex-1 items-center justify-center"><span className="text-gray-500">...</span></div>
}

class PageErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false }
  static getDerivedStateFromError() { return { error: true } }
  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="text-sm text-text-secondary">Page failed to load.</p>
          <button
            onClick={() => { this.setState({ error: false }); window.location.reload() }}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <main className="flex-1">
          <PageErrorBoundary>
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
              <Route path="/news" element={<News />} />
              <Route path="/festival" element={<Festival />} />
              <Route path="/more" element={<More />} />
              <Route path="/genre-family" element={<GenreFamily />} />
            </Routes>
          </Suspense>
          </PageErrorBoundary>
        </main>
        <BottomNav />
      </HashRouter>
    </AuthProvider>
  )
}
