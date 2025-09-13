import { cn } from "@/lib/utils"

export function GridBackground() {
  return (
    <div className="fixed inset-0 md:hidden z-0">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]", // Slightly larger grid
          "[background-image:linear-gradient(to_right,rgba(255,107,53,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,107,53,0.15)_1px,transparent_1px)]",
        )}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_70%)]"></div>
    </div>
  )
}
