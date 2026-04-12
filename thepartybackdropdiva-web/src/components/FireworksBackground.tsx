import { Fireworks } from '@fireworks-js/react'

export function FireworksBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <Fireworks
        options={{
          opacity: 0.5,
          hue: {
            min: 0,
            max: 360
          },
          delay: {
            min: 60,
            max: 120
          },
          rocketsPoint: {
            min: 50,
            max: 50
          },
          lineWidth: {
            explosion: {
              min: 1,
              max: 2
            },
            trace: {
              min: 0.1,
              max: 1
            }
          },
          brightness: {
            min: 50,
            max: 80
          },
          decay: {
            min: 0.015,
            max: 0.03
          },
          mouse: {
            click: false,
            move: false,
            max: 1
          }
        }}
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          position: 'absolute',
          background: 'transparent'
        }}
      />
    </div>
  )
}
