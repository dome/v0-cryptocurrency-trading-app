"use client"

import { Button } from "@/components/ui/button"
import { Coins, Search, Bell, User, LogOut, Wallet } from "lucide-react"
import { getCurrentUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import type { User as UserType } from "@/lib/auth"

export function Navigation() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="h-14 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-amber-500 flex items-center justify-center">
            <Coins className="h-5 w-5 text-slate-900" />
          </div>
          <span className="font-bold text-slate-50 text-lg">CryptoTrade</span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-slate-50 hover:bg-slate-800">
            ซื้อ Crypto
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-slate-50 hover:bg-slate-800">
            ตลาด
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-amber-500 hover:text-amber-400 hover:bg-slate-800 font-medium"
          >
            เทรด
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-slate-50 hover:bg-slate-800">
            Futures
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-slate-50 hover:bg-slate-800">
            Earn
          </Button>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-50 hover:bg-slate-800">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-50 hover:bg-slate-800">
          <Bell className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-slate-50 hover:bg-slate-800"
          onClick={() => router.push("/wallet")}
        >
          <Wallet className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-50 hover:bg-slate-800">
          <User className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-red-400 hover:bg-slate-800"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-1" />
          ออกจากระบบ
        </Button>
        {user && (
          <div className="hidden lg:block text-sm text-slate-400 border-l border-slate-700 pl-3">
            <span className="text-slate-500">ยินดีต้อนรับ</span>{" "}
            <span className="text-slate-200 font-medium">{user.name}</span>
          </div>
        )}
      </div>
    </div>
  )
}
