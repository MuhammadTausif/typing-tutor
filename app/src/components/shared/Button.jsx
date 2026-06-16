import clsx from 'clsx'

const VARIANTS = {
  primary: 'bg-vel-violet hover:bg-vel-violet/90 text-white shadow-lg shadow-vel-violet/20',
  secondary: 'bg-panel border border-vel-border hover:border-vel-violet/60 text-slate-200 hover:text-white',
  ghost: 'hover:bg-white/5 text-slate-400 hover:text-slate-200',
  danger: 'bg-red-600/80 hover:bg-red-600 text-white',
}

const SIZES = {
  sm:  'h-8 px-3 text-sm gap-1.5',
  md:  'h-10 px-4 text-sm gap-2',
  lg:  'h-12 px-6 text-base gap-2',
}

export default function Button({
  variant = 'primary',
  size    = 'md',
  icon,
  iconRight,
  disabled,
  loading,
  className,
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150',
        'focus-visible:ring-2 focus-visible:ring-vel-violet/60',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="shrink-0 size-4">{icon}</span>
      ) : null}
      {children}
      {iconRight && <span className="shrink-0 size-4">{iconRight}</span>}
    </button>
  )
}
