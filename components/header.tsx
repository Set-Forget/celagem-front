"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { HEADER_TITLES } from "../lib/constants/header-titles";
import React, { ReactNode, useEffect, useState } from "react";

interface HeaderProps {
  children?: ReactNode;
  title?: string | ReactNode;
}

function getHeaderTitle(pathname: string): string {
  const match = HEADER_TITLES.find(({ path }) => {
    if (path.includes("*")) {
      const basePath = path.replace("/*", "");
      return pathname.startsWith(basePath);
    }
    return path === pathname;
  });

  return match?.title || "Página no encontrada";
}

export default function Header({ children, title }: HeaderProps) {
  const pathname = usePathname();

  const [isSticky, setIsSticky] = useState(false);

  const defaultTitle = getHeaderTitle(pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 17);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const displayedTitle = title ?? defaultTitle;

  return (
    <div className="sticky top-0 border-b z-[50]">
      <header
        className={`
          flex h-12 shrink-0 px-4 items-center gap-2
          ${isSticky ? "bg-background" : ""}
          group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12
        `}
      >
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />

          {typeof displayedTitle === "string" ? (
            <h1 className="text-lg font-medium tracking-tight">
              {displayedTitle}
            </h1>
          ) : (
            displayedTitle
          )}
        </div>
        {children}
      </header>
    </div>
  );
}