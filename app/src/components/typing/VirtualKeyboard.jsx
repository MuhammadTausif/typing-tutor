import clsx from 'clsx'

// Maps each key to a finger index 0–7 (left-pinky → right-pinky)
const FINGER_MAP = {
  // left pinky (0)
  '`':0,'1':0,'q':0,'a':0,'z':0,
  // left ring (1)
  '2':1,'w':1,'s':1,'x':1,
  // left middle (2)
  '3':2,'e':2,'d':2,'c':2,
  // left index (3)
  '4':3,'r':3,'f':3,'v':3,'5':3,'t':3,'g':3,'b':3,
  // right index (4)
  '6':4,'y':4,'h':4,'n':4,'7':4,'u':4,'j':4,'m':4,
  // right middle (5)
  '8':5,'i':5,'k':5,',':5,
  // right ring (6)
  '9':6,'o':6,'l':6,'.':6,
  // right pinky (7)
  '0':7,'p':7,';':7,'/':7,'-':7,'=':7,'[':7,']':7,"'":7,'\\':7,
}

const FINGER_COLORS = [
  'bg-pink-600/30   border-pink-500/50   text-pink-300',   // 0 left-pinky
  'bg-orange-600/30 border-orange-500/50 text-orange-300', // 1 left-ring
  'bg-amber-600/30  border-amber-500/50  text-amber-300',  // 2 left-middle
  'bg-green-700/30  border-green-500/50  text-green-300',  // 3 left-index
  'bg-teal-700/30   border-teal-500/50   text-teal-300',   // 4 right-index
  'bg-blue-700/30   border-blue-500/50   text-blue-300',   // 5 right-middle
  'bg-indigo-600/30 border-indigo-500/50 text-indigo-300', // 6 right-ring
  'bg-violet-600/30 border-violet-500/50 text-violet-300', // 7 right-pinky
]

const ROWS = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','='],
  ['q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  ['a','s','d','f','g','h','j','k','l',';',"'"],
  ['z','x','c','v','b','n','m',',','.','/'],
]

function Key({ k, highlighted, active }) {
  const finger  = FINGER_MAP[k] ?? -1
  const color   = finger >= 0 ? FINGER_COLORS[finger] : 'bg-slate-800/60 border-slate-700 text-slate-400'
  const isHome  = 'asdfghjkl;'.includes(k)

  return (
    <kbd
      className={clsx(
        'inline-flex items-center justify-center rounded-md border text-xs font-mono font-semibold',
        'min-w-[2.2rem] h-9 px-1 transition-all duration-100',
        highlighted ? [color, 'scale-105 shadow-lg shadow-black/30 brightness-125'] : color,
        active && 'scale-95 brightness-150',
        isHome && 'ring-1 ring-white/10',
      )}
    >
      {k === ';' ? ';' : k}
    </kbd>
  )
}

export default function VirtualKeyboard({ activeKeys = [], highlightKeys = [] }) {
  const activeSet    = new Set(activeKeys.map(k => k.toLowerCase()))
  const highlightSet = new Set(highlightKeys.map(k => k.toLowerCase()))

  return (
    <div className="card p-4 space-y-1.5 select-none">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1 justify-center">
          {ri === 1 && <div className="w-6" />}
          {ri === 2 && <div className="w-10" />}
          {ri === 3 && <div className="w-14" />}
          {row.map(k => (
            <Key
              key={k}
              k={k}
              highlighted={highlightSet.has(k)}
              active={activeSet.has(k)}
            />
          ))}
        </div>
      ))}
      {/* Spacebar row */}
      <div className="flex gap-1 justify-center">
        <div className="w-28" />
        <kbd className={clsx(
          'inline-flex items-center justify-center rounded-md border text-xs font-mono font-semibold',
          'w-64 h-9 transition-all duration-100',
          activeSet.has(' ')
            ? 'bg-slate-700/60 border-slate-500 text-slate-300 scale-95'
            : 'bg-slate-800/60 border-slate-700 text-slate-400',
        )}>
          space
        </kbd>
      </div>
    </div>
  )
}
