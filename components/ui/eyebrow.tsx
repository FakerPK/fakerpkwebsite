interface EyebrowProps {
  index: string
  label: string
  className?: string
}

/** Mono signage label: orange dash + numbered section marker. */
export default function Eyebrow({ index, label, className = "" }: EyebrowProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span aria-hidden="true" className="inline-block h-px w-6 bg-accent" />
      <span className="text-signage text-ink-muted">
        {index} · {label}
      </span>
    </span>
  )
}
