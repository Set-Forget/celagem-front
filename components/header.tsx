"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode, useEffect, useState } from "react";

interface HeaderProps {
  children?: ReactNode;
  title?: string | ReactNode;
}

export default function Header({ children, title }: HeaderProps) {
  const [isSticky, setIsSticky] = useState(false);

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
          {typeof title === "string" ? (
            <h1 className="text-lg font-medium tracking-tight">
              {title}
            </h1>
          ) : (
            title
          )}
        </div>
        {children}
      </header>
    </div>
  );
}