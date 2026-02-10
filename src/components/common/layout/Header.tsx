"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationLinks } from "../navigation/NavigationLinks";
import { DialogTitle } from "@/components/ui/dialog";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="py-6 px-6 md:px-12 z-10 border-b border-kuralis-200">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tighter-custom">
          kuralis
        </Link>

        {/* デスクトップ */}
        <div className="hidden md:flex space-x-8">
          <NavigationLinks variant="desktop" />
        </div>

        {/* モバイル */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="md:hidden text-kuralis-700 hover:text-kuralis-900 transition-colors duration-300"
              aria-label="メニューを開く"
              title="メニューを開く"
            >
              <FiMenu size={20} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs p-0">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-kuralis-100">
                <DialogTitle asChild>
                  <h2 className="text-xl font-bold tracking-tighter-custom">
                    kuralis メニュー
                  </h2>
                </DialogTitle>
              </div>
              <nav className="flex-1 p-6">
                <div className="space-y-6">
                  <NavigationLinks
                    variant="mobile"
                    onLinkClick={() => setOpen(false)}
                  />
                </div>
              </nav>
              <div className="p-6 border-t border-kuralis-100">
                <p className="text-xs text-kuralis-500">
                  © {new Date().getFullYear()} kuralis
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
