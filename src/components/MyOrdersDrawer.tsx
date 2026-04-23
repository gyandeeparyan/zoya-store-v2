"use client"

import { useRouter } from "next/navigation"

export function MyOrdersDrawer() {
  const router = useRouter()

  return (
    <button
      className=""
      onClick={() => router.push("/orders")}
    >
      Orders
    </button>
  )
}
