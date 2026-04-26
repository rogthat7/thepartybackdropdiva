import { Fireworks } from '@fireworks-js/react'

export function FireworksBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Standard Fireworks */}
      <Fireworks
        options={{
          opacity: 0.5,
          hue: { min: 0, max: 360 },
          delay: { min: 120, max: 240 },
          rocketsPoint: { min: 50, max: 50 },
          lineWidth: { explosion: { min: 1, max: 2 }, trace: { min: 0.1, max: 1 } },
          brightness: { min: 50, max: 80 },
          decay: { min: 0.01, max: 0.02 },
          mouse: { click: false, move: false, max: 1 }
        }}
        style={{ top: 0, left: 0, width: '100%', height: '100%', position: 'absolute', background: 'transparent' }}
      />
      
      {/* Glitter Bursts */}
      <Fireworks
        options={{
          opacity: 0.7,
          hue: { min: 40, max: 60 }, /* Gold/Yellow */
          delay: { min: 300, max: 600 }, /* Less frequent */
          rocketsPoint: { min: 50, max: 50 },
          particles: 250, /* Lots of small particles */
          flickering: 100, /* High flickering for glitter effect */
          lineWidth: { explosion: { min: 0.5, max: 1.5 }, trace: { min: 0.1, max: 0.5 } },
          brightness: { min: 70, max: 100 },
          decay: { min: 0.015, max: 0.03 },
          mouse: { click: false, move: false, max: 1 }
        }}
        style={{ top: 0, left: 0, width: '100%', height: '100%', position: 'absolute', background: 'transparent' }}
      />

      {/* Flower Petal Bursts */}
      <Fireworks
        options={{
          opacity: 0.6,
          hue: { min: 280, max: 340 }, /* Pink/Purple */
          delay: { min: 400, max: 800 }, /* Less frequent */
          rocketsPoint: { min: 50, max: 50 },
          particles: 80,
          friction: 0.96, /* Slows down quickly, mimicking petals floating */
          gravity: 1.2, /* Falls down faster after stopping */
          explosion: 4, /* Smaller explosion radius */
          lineWidth: { explosion: { min: 2, max: 4 }, trace: { min: 0.1, max: 0.5 } }, /* Thicker particles */
          brightness: { min: 50, max: 70 },
          decay: { min: 0.005, max: 0.01 }, /* Lasts very long */
          mouse: { click: false, move: false, max: 1 }
        }}
        style={{ top: 0, left: 0, width: '100%', height: '100%', position: 'absolute', background: 'transparent' }}
      />
    </div>
  )
}
