import { useState, useEffect, useMemo } from 'react'
import PageShell from '../components/PageShell'
import { BrainIcon, RefreshIcon, TrophyIcon, ShareIcon } from '../components/Icons'
import { questions, categoryColors, categoryLabels, type QuizCategory, type QuizQuestion } from '../data/quiz'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type QuizState = 'start' | 'playing' | 'answered' | 'done'

const QUESTIONS_PER_GAME = 15

export default function Quiz() {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [state, setState] = useState<QuizState>('start')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | 'all'>('all')
  const [history, setHistory] = useState<{ correct: boolean; q: QuizQuestion }[]>([])

  useEffect(() => { document.title = 'Hardstyle Quiz — Defqon Companion' }, [])

  const categories: Array<QuizCategory | 'all'> = ['all', 'history', 'artists', 'music', 'vocabulary', 'festival']

  const startQuiz = () => {
    const pool = selectedCategory === 'all' ? questions : questions.filter((q) => q.category === selectedCategory)
    const picked = shuffle(pool).slice(0, QUESTIONS_PER_GAME)
    setQuizQuestions(picked.map((q) => {
      const correctText = q.answers[q.correct]
      const shuffledAnswers = shuffle([...q.answers])
      return { ...q, answers: shuffledAnswers, correct: shuffledAnswers.indexOf(correctText) }
    }))
    setCurrentIdx(0)
    setScore(0)
    setHistory([])
    setSelectedAnswer(null)
    setState('playing')
  }

  const currentQ = quizQuestions[currentIdx]

  const selectAnswer = (answerIdx: number) => {
    if (state !== 'playing') return
    setSelectedAnswer(answerIdx)
    setState('answered')
    const isCorrect = answerIdx === currentQ.correct
    if (isCorrect) setScore((s) => s + 1)
    setHistory((h) => [...h, { correct: isCorrect, q: currentQ }])
  }

  const next = () => {
    if (currentIdx + 1 >= quizQuestions.length) {
      setState('done')
    } else {
      setCurrentIdx((i) => i + 1)
      setSelectedAnswer(null)
      setState('playing')
    }
  }

  const shareResult = async () => {
    const pct = Math.round((score / quizQuestions.length) * 100)
    const grade = pct >= 90 ? 'Hardstyle Legend' : pct >= 70 ? 'Experienced raver' : pct >= 50 ? 'Festival-goer' : 'Q-dance newcomer'
    const text = `I scored ${score}/${quizQuestions.length} on the Defqon.1 Hardstyle Quiz! Level: ${grade} 🎵 #Defqon1 #Hardstyle`
    if (navigator.share) {
      await navigator.share({ title: 'Hardstyle Quiz Result', text })
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  const grade = useMemo(() => {
    const pct = quizQuestions.length ? (score / quizQuestions.length) * 100 : 0
    if (pct >= 90) return { label: 'Hardstyle Legend', color: '#d4a20a' }
    if (pct >= 70) return { label: 'Experienced Raver', color: '#e040a0' }
    if (pct >= 50) return { label: 'Festival-Goer', color: '#4a00e0' }
    return { label: 'Q-dance Newcomer', color: '#a8a8a8' }
  }, [score, quizQuestions.length])

  // ─── Start screen ──────────────────────────────────────────────────────────
  if (state === 'start') {
    return (
      <PageShell title="Hardstyle Quiz" subtitle="Test your knowledge of hardstyle culture">
        <div className="mx-auto w-full max-w-md space-y-5 pb-4">
          <div className="rounded-xl border border-border bg-surface-card p-5 text-center">
            <BrainIcon size={32} className="mx-auto mb-3 text-accent" />
            <p className="text-sm text-text-secondary">
              {QUESTIONS_PER_GAME} questions · History, Artists, Music, Vocabulary & Festival
            </p>
            <p className="mt-1 text-xs text-text-muted">Can you score like a Hardstyle Legend?</p>
          </div>

          <div>
            <p className="defqon-heading mb-2 text-xs tracking-widest text-text-muted">Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-accent text-white'
                      : 'border border-border bg-surface-card text-text-muted hover:border-border-hover'
                  }`}
                  style={
                    selectedCategory === cat && cat !== 'all'
                      ? { backgroundColor: categoryColors[cat as QuizCategory] }
                      : {}
                  }
                >
                  {cat === 'all' ? 'All categories' : categoryLabels[cat as QuizCategory]}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-opacity active:opacity-80"
          >
            Start Quiz
          </button>
        </div>
      </PageShell>
    )
  }

  // ─── Done screen ───────────────────────────────────────────────────────────
  if (state === 'done') {
    const pct = Math.round((score / quizQuestions.length) * 100)
    return (
      <PageShell title="Result" subtitle="How did you do?">
        <div className="mx-auto w-full max-w-md space-y-4 pb-4">
          <div className="rounded-xl border border-border bg-surface-card p-6 text-center">
            <div className="mx-auto mb-3 w-fit" style={{ color: grade.color }}><TrophyIcon size={36} /></div>
            <p className="text-3xl font-bold text-text-primary">{score} / {quizQuestions.length}</p>
            <p className="mt-1 text-lg font-semibold" style={{ color: grade.color }}>{grade.label}</p>
            <p className="mt-1 text-sm text-text-muted">{pct}% correct</p>
            <div className="mx-auto mt-4 h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-surface-alt">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: grade.color }}
              />
            </div>
          </div>

          {/* Wrong answers breakdown */}
          {history.filter((h) => !h.correct).length > 0 && (
            <div>
              <p className="defqon-heading mb-2 text-xs tracking-widest text-text-muted">Learn from mistakes</p>
              <div className="space-y-2">
                {history.filter((h) => !h.correct).map(({ q }) => (
                  <div key={q.id} className="rounded-xl border border-border bg-surface-card p-3">
                    <p className="text-xs font-semibold text-text-primary">{q.question}</p>
                    <p className="mt-1 text-xs text-green-400">✓ {q.answers[q.correct]}</p>
                    <p className="mt-1 text-[11px] text-text-muted italic">{q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={shareResult}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface-card py-3 text-sm font-medium text-text-secondary"
            >
              <ShareIcon size={16} /> Share
            </button>
            <button
              onClick={() => setState('start')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-bold text-white"
            >
              <RefreshIcon size={16} /> Try again
            </button>
          </div>
        </div>
      </PageShell>
    )
  }

  // ─── Playing ───────────────────────────────────────────────────────────────
  if (!currentQ) return null

  const progress = ((currentIdx + (state === 'answered' ? 1 : 0)) / quizQuestions.length) * 100
  const catColor = categoryColors[currentQ.category]

  return (
    <PageShell title="Hardstyle Quiz" subtitle={`Question ${currentIdx + 1} of ${quizQuestions.length}`}>
      <div className="mx-auto w-full max-w-md space-y-4 pb-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>{currentIdx + 1} / {quizQuestions.length}</span>
            <span className="font-semibold text-green-400">{score} correct</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-alt">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Category badge */}
        <span
          className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: catColor }}
        >
          {categoryLabels[currentQ.category]}
        </span>

        {/* Question */}
        <div className="rounded-xl border border-border bg-surface-card p-4">
          <p className="text-base font-semibold leading-snug text-text-primary">{currentQ.question}</p>
        </div>

        {/* Answers */}
        <div className="space-y-2">
          {currentQ.answers.map((answer, i) => {
            const isCorrect = answer === currentQ.answers[currentQ.correct]
            const isSelected = selectedAnswer === i
            let cls = 'border border-border bg-surface-card text-text-primary hover:border-border-hover'

            if (state === 'answered') {
              if (isCorrect) cls = 'border-green-500 bg-green-500/15 text-green-300'
              else if (isSelected) cls = 'border-red-500 bg-red-500/15 text-red-300'
              else cls = 'border-border bg-surface-card text-text-muted opacity-50'
            }

            return (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                disabled={state === 'answered'}
                className={`w-full rounded-xl p-3.5 text-left text-sm font-medium transition-all ${cls}`}
              >
                {answer}
              </button>
            )
          })}
        </div>

        {/* Explanation + Next */}
        {state === 'answered' && (
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-surface-card p-3">
              <p className="text-xs font-semibold text-text-muted">Did you know?</p>
              <p className="mt-1 text-sm text-text-secondary">{currentQ.explanation}</p>
            </div>
            <button
              onClick={next}
              className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold uppercase tracking-wider text-white"
            >
              {currentIdx + 1 >= quizQuestions.length ? 'See Results' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </PageShell>
  )
}
