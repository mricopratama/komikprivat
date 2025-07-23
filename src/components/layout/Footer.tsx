import Link from 'next/link'
import { Book, Github, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 text-white mb-4">
              <Book className="h-8 w-8" />
              <span className="text-xl font-bold">ComicHub</span>
            </Link>
            <p className="text-gray-400 max-w-md">
              Your ultimate destination for reading comics online. Discover thousands of comics 
              from various genres and enjoy high-quality reading experience.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/comics" className="block text-gray-400 hover:text-white transition-colors">
                All Comics
              </Link>
              <Link href="/latest" className="block text-gray-400 hover:text-white transition-colors">
                Latest Releases
              </Link>
              <Link href="/popular" className="block text-gray-400 hover:text-white transition-colors">
                Popular Comics
              </Link>
              <Link href="/genres" className="block text-gray-400 hover:text-white transition-colors">
                Browse by Genre
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="block text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <p className="text-center text-gray-400">
            © 2025 ComicHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}