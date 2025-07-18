import { Heart, Mail, MapPin } from "lucide-react"

function Footer() {
  return (
    <footer className="bg-deep-navy text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-heart-red p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">HeartSync</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Connecting hearts across Nigeria with cultural understanding and modern technology. Find your perfect
              match for a lifetime of love and happiness.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-heart-red transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-heart-red transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-heart-red transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-heart-red transition-colors">
                  Safety Tips
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-heart-red transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-heart-red transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-heart-red transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">support@heartsync.ng</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 HeartSync. All rights reserved. Made with ❤️ in Nigeria.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
