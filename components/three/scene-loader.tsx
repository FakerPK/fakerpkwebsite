"use client"

import dynamic from "next/dynamic"

const GravityScene = dynamic(() => import("./gravity-scene"), { ssr: false })

export default function SceneLoader() {
  return <GravityScene />
}
