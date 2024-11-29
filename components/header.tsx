"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { HEADER_TITLES } from "../lib/constants/header-titles"
import { ReactNode, useEffect, useState } from "react"

export default function Header({ title, children }: { children?: ReactNode, title?: string }) {
  const pathname = usePathname()
  const [isSticky, setIsSticky] = useState(false)

  const getHeaderTitle = (pathname: string): string => {
    const match = HEADER_TITLES.find(({ path }) => {
      if (path.includes("*")) {
        const basePath = path.replace("/*", "");
        return pathname.startsWith(basePath);
      }
      return path === pathname;
    });

    return match?.title || "Página no encontrada";
  }

  const headerTitle = getHeaderTitle(pathname)

  useEffect(() => {
    setIsSticky(window.scrollY > 17)

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsSticky(scrollPosition > 17)
    }

    const onScroll = () => {
      window.requestAnimationFrame(() => {
        handleScroll()
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="sticky top-0 z-50">
      <header className={`
        flex h-16 shrink-0 px-4 items-center gap-2 
        ${isSticky
          ? 'bg-background border-b'
          : ''}
        group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12
      `}>
        <div className="flex items-center gap-2 w-full">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-lg font-medium tracking-tight">{title || headerTitle}</h1>
        </div>
        {children}
      </header>
    </div>
  )
}