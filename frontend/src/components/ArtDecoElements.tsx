export function ArtDecoLine() {
  return (
    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent my-2.5"></div>
  )
}

export function ArtDecoDiamonds() {
  return (
    <div className="flex justify-center items-center gap-2.5">
      <span className="block w-3 h-3 bg-gold rotate-45"></span>
      <span className="block w-3 h-3 bg-gold rotate-45"></span>
      <span className="block w-3 h-3 bg-gold rotate-45"></span>
    </div>
  )
}

export function ArtDecoTop() {
  return (
    <div className="text-center mb-5">
      <ArtDecoLine />
      <ArtDecoDiamonds />
      <ArtDecoLine />
    </div>
  )
}

export function CornerOrnament({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const positionClasses = {
    'top-left': 'top-6 left-6 border-r-0 border-b-0',
    'top-right': 'top-6 right-6 border-l-0 border-b-0',
    'bottom-left': 'bottom-6 left-6 border-r-0 border-t-0',
    'bottom-right': 'bottom-6 right-6 border-l-0 border-t-0',
  }

  return (
    <div className={`absolute w-20 h-20 border-2 border-gold opacity-30 ${positionClasses[position]}`} style={{ borderColor: 'rgba(212, 175, 55, 1)' }}></div>
  )
}

export function CTAButton({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-row flex-wrap justify-center items-center w-full bg-gold text-dark-brown-2 px-4 py-4 text-base tracking-widest uppercase font-bold border-none cursor-pointer my-6 mx-0 transition-all duration-300 shadow-[0_6px_20px_rgba(212,175,55,0.4)] font-baskerville hover:bg-light-gold hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(212,175,55,0.6)] ${className}`}
      style={{ width: '100%' }}
    >
      {children}
    </button>
  )
}

