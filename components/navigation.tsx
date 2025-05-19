"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileText, Database, Settings, ChevronLeft, ChevronRight, LogOut } from "lucide-react"

export function Navigation() {
  const [isExpanded, setIsExpanded] = useState(true)
  const pathname = usePathname()

  const navItems = [
    {
      name: "データ読み取り",
      href: "/dashboard",
      icon: FileText,
    },
    {
      name: "データ管理",
      href: "/dashboard/data-management",
      icon: Database,
    },
    {
      name: "管理者機能",
      href: "#",
      icon: Settings,
    },
  ]

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-300",
        isExpanded ? "w-[200px]" : "w-[60px]",
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-3">
        {isExpanded && <span className="font-semibold">UBE OCR</span>}
        <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="ml-auto">
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                !isExpanded && "justify-center px-0",
              )}
            >
              <item.icon size={20} />
              {isExpanded && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-2">
        <Link href="/">
          <Button
            variant="ghost"
            size={isExpanded ? "default" : "icon"}
            className={cn("w-full", !isExpanded && "justify-center px-0")}
          >
            <LogOut size={18} className="mr-2" />
            {isExpanded && "ログアウト"}
          </Button>
        </Link>
      </div>
    </div>
  )
}
