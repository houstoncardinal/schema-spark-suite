import React, { useState, useEffect, CSSProperties } from 'react'

export interface CybercoreBackgroundProps {
  /** Number of animated light beams */
  beamCount?: number
}

const DEFAULT_BEAM_COUNT = 70

const CybercoreBackground: React.FC<CybercoreBackgroundProps> = ({
  beamCount = DEFAULT_BEAM_COUNT,
}) => {
  const [beams, setBeams] = useState<
    Array<{ id: number; type: 'primary' | 'secondary'; style: CSSProperties }>
  >([])

  useEffect(() => {
    const generated = Array.from({ length: beamCount }).map((_, i) => {
      const riseDur = Math.random() * 3 + 5
      const fadeDur = riseDur
      const type: 'primary' | 'secondary' = Math.random() < 0.15 ? 'secondary' : 'primary'
      return {
        id: i,
        type,
        style: {
          left: `${Math.random() * 100}%`,
          width: `${Math.floor(Math.random() * 2) + 1}px`,
          animationDelay: `${Math.random() * 6}s`,
          animationDuration: `${riseDur}s, ${fadeDur}s`,
        } as CSSProperties,
      }
    })
    setBeams(generated)
  }, [beamCount])

  return (
    <div className="cybercore-bg">
      {/* Main glow */}
      <div className="cybercore-main-glow" />

      {/* Moving grid */}
      <div className="cybercore-grid" />

      {/* Beams container */}
      <div className="cybercore-beams">
        {beams.map((beam) => (
          <div
            key={beam.id}
            className={`cybercore-beam ${beam.type === 'secondary' ? 'cybercore-beam--secondary' : ''}`}
            style={beam.style}
          />
        ))}
      </div>

      {/* Floor glow */}
      <div className="cybercore-floor-glow" />
    </div>
  )
}

export default CybercoreBackground
