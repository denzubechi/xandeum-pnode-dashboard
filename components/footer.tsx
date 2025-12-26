import { Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center text-sm text-muted-foreground sm:text-left">
            <p>
              Built with <span className="text-red-500">❤</span> for Xandeum | ©{" "}
              {currentYear} Xandeum Network
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/docs"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Documentation
            </Link>
            <a
              href="https://github.com/denzubechi/xandeum-pnode-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              title="View on GitHub"
            >
              <Github className="size-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
