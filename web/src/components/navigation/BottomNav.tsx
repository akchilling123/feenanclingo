import { Link, useLocation } from 'react-router-dom'

const TABS = [
  { label: 'Home', path: '/' },
  { label: 'Practice', path: '/practice' },
  { label: 'Review', path: '/review' },
  { label: 'Progress', path: '/progress' },
] as const

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav aria-label="Main navigation" className="fixed bottom-0 left-0 right-0 h-14 bg-navy-light/95 backdrop-blur-md border-t border-gold/10 z-50">
      <div className="flex h-full items-stretch max-w-lg mx-auto">
        {TABS.map(tab => {
          const isActive = pathname === tab.path
          return (
            <Link
              key={tab.path}
              to={tab.path}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center relative transition-colors duration-200 ${
                isActive ? 'text-gold' : 'text-cream-dark/60 hover:text-cream-dark'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-gold rounded-full" />
              )}
              <span className="text-xs tracking-wider uppercase font-medium">
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
