import { useRef } from 'react'
import { stageColors, type Stage, type Set } from '../data/lineup'

const PPM = 4.5 // pixels per minute

function toMin(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

interface Props {
  sets: Set[]
  stages: Stage[]
  savedSets: string[]
  friendSets: Record<string, string[]>
  onToggle: (id: string) => void
}

export default function GridTimetable({ sets, stages, savedSets, friendSets, onToggle }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (sets.length === 0) return null

  const allMins = sets.flatMap((s) => [toMin(s.startTime), toMin(s.endTime)])
  const dayStart = Math.min(...allMins)
  const dayEnd = Math.max(...allMins)
  const totalWidth = (dayEnd - dayStart) * PPM

  // Build hour ticks
  const ticks: number[] = []
  for (let m = Math.ceil(dayStart / 60) * 60; m <= dayEnd; m += 60) ticks.push(m)

  const LABEL_W = 52

  return (
    <div
      ref={scrollRef}
      className="overflow-x-auto -mx-4 select-none"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div style={{ width: totalWidth + LABEL_W + 16, paddingRight: 16 }}>

        {/* Time axis */}
        <div className="relative mb-1" style={{ height: 18, marginLeft: LABEL_W }}>
          {ticks.map((m) => (
            <span
              key={m}
              className="absolute text-[9px] text-text-muted"
              style={{ left: (m - dayStart) * PPM - 12, top: 0 }}
            >
              {String(m / 60).padStart(2, '0')}:00
            </span>
          ))}
        </div>

        {/* Grid lines */}
        <div className="relative" style={{ marginLeft: LABEL_W }}>
          {ticks.map((m) => (
            <div
              key={m}
              className="absolute top-0 bottom-0 w-px bg-white/5"
              style={{ left: (m - dayStart) * PPM }}
            />
          ))}
        </div>

        {/* Stage rows */}
        {stages.map((stage) => {
          const stageSets = sets.filter((s) => s.stage === stage)
          if (stageSets.length === 0) return null
          const color = stageColors[stage]

          return (
            <div key={stage} className="flex mb-1.5 items-center" style={{ height: 40 }}>
              {/* Stage label */}
              <div
                className="shrink-0 flex items-center justify-end pr-2"
                style={{ width: LABEL_W, minWidth: LABEL_W }}
              >
                <span
                  className="text-[9px] font-bold uppercase tracking-wider truncate"
                  style={{ color }}
                >
                  {stage}
                </span>
              </div>

              {/* Timeline row */}
              <div className="relative" style={{ width: totalWidth, height: 38 }}>
                {/* Row background */}
                <div className="absolute inset-0 rounded-md bg-white/3" />

                {stageSets.map((set) => {
                  const startMin = toMin(set.startTime)
                  const endMin = toMin(set.endTime)
                  const left = (startMin - dayStart) * PPM
                  const width = Math.max((endMin - startMin) * PPM - 2, 20)
                  const isSaved = savedSets.includes(set.id)
                  const friendCount = friendSets[set.id]?.length ?? 0

                  return (
                    <button
                      key={set.id}
                      onClick={() => onToggle(set.id)}
                      title={`${set.artist} · ${set.startTime}–${set.endTime}`}
                      className="absolute top-0.5 bottom-0.5 rounded overflow-hidden text-left transition-opacity hover:opacity-90 active:scale-95"
                      style={{
                        left,
                        width,
                        backgroundColor: isSaved ? color : color + '30',
                        borderLeft: `2px solid ${color}`,
                      }}
                    >
                      <div className="px-1 h-full flex flex-col justify-center">
                        <p
                          className="text-[8px] font-semibold leading-tight truncate"
                          style={{ color: isSaved ? '#fff' : color }}
                        >
                          {set.artist}
                        </p>
                        {width > 60 && (
                          <p className="text-[7px] leading-tight" style={{ color: isSaved ? 'rgba(255,255,255,0.7)' : color + 'aa' }}>
                            {set.startTime}
                          </p>
                        )}
                        {friendCount > 0 && (
                          <span className="absolute top-0.5 right-0.5 text-[7px] text-blue-300">
                            +{friendCount}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
