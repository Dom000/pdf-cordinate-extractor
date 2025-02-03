import Link from "next/link";
import { Github, Twitter, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-4  bg-gray-100">
      <div className="container mx-auto px-4 flex justify-center items-center space-x-4">
        <Link
          href="https://github.com/dom000"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
        >
          <Github size={20} />
          <span>GitHub</span>
        </Link>
        <span className="text-gray-400">|</span>
        <Link
          href="https://x/dom000_dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
        >
          <Twitter size={20} />
          <span>X (Twitter)</span>
        </Link>
        <span className="text-gray-400">|</span>
        <Link
          href="https://buymeacoffee.com/dom000"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
        >
          <Heart size={20} className="text-red-500" />
          <span>Support</span>
        </Link>
      </div>
    </footer>
  );
}
