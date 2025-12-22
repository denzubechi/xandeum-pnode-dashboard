"use client";

import { Network } from "lucide-react";
import Link from "next/link";
import { NavTabs } from "@/components/nav-tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
export function NetworkHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Image
                src="/xandium-logo.png"
                alt="Xandeum Logo"
                width={32}
                height={32}
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Xandeum
              </h1>
              <p className="text-xs text-muted-foreground">
                pNode Analytics Dashboard
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <NavTabs />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
