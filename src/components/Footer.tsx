import Link from "next/link";
import { Github, Twitter, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t-4 border-ink bg-white py-5">
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-sm">
        <Link
          href="https://github.com/dom000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-medium text-ink/70 hover:text-ink"
        >
          <Github size={18} />
          <span>GitHub</span>
        </Link>
        <span className="text-ink/20">|</span>
        <Link
          href="https://x/dom000_dev"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-medium text-ink/70 hover:text-ink"
        >
          <Twitter size={18} />
          <span>X (Twitter)</span>
        </Link>
        <span className="text-ink/20">|</span>
        <Link
          href="https://buymeacoffee.com/dom000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-medium text-ink/70 hover:text-ink"
        >
          <Heart size={18} className="text-coral" />
          <span>Support</span>
        </Link>
      </div>
    </footer>
  );
}
