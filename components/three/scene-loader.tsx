"use client"

import { Component, type ReactNode, useEffect, useState } from "react"
import dynamic from "next/dynamic"

const GravityScene = dynamic(() => import("./gravity-scene"), { ssr: false })

/* ------------------------------------------------------------------ */
/* WebGL support probe                                                 */
/*                                                                     */
/* R3F v8 swallows context-creation failure inside its own internal    */
/* boundary: the canvas silently never appears and non-WebGL visitors  */
/* are left with bare --void. Probe support BEFORE mounting so those   */
/* visitors get the themed static backdrop instead of flat black.      */
/* ------------------------------------------------------------------ */

function webglSupported(): boolean {
  try {
    if (typeof window.WebGLRenderingContext === "undefined") return false
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"))
  } catch {
    return false
  }
}

/* Themed stand-in matching the scene's composition: an accretion-style
 * radial glow in brand orange over the void ground. Pure CSS, static by
 * construction — reduced-motion visitors lose nothing when it stands in.
 * Fills/borders keep raw #FF6A00; this is a fill, not text. */
function StaticBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0"
      style={{
        background:
          "radial-gradient(ellipse 62% 48% at 50% 46%, rgba(255, 106, 0, 0.20) 0%, rgba(255, 106, 0, 0.07) 40%, rgba(10, 9, 8, 0) 72%), var(--void)",
      }}
    />
  )
}

/* Second net: catches runtime render errors inside the Canvas tree (shader
 * compile failure, context loss mid-session) that the pre-mount probe
 * cannot see, swapping in the same backdrop. */
class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true }
  }

  componentDidCatch(error: unknown): void {
    console.error("[scene] WebGL render failed — showing static backdrop", error)
  }

  render() {
    return this.state.failed ? <StaticBackdrop /> : this.props.children
  }
}

export default function SceneLoader() {
  const [support, setSupport] = useState<"probing" | "ok" | "unsupported">("probing")

  useEffect(() => {
    setSupport(webglSupported() ? "ok" : "unsupported")
  }, [])

  if (support === "unsupported") return <StaticBackdrop />
  // One tick while probing — same blank-until-loaded behavior as before.
  if (support === "probing") return null

  return (
    <SceneErrorBoundary>
      <GravityScene />
    </SceneErrorBoundary>
  )
}
