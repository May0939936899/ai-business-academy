import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

// Root layout is a minimal shell — the real layout lives in [locale]/layout.tsx
export default function RootLayout({ children }: Props) {
  return children
}
