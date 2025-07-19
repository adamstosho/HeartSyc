import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Heart, Users, Shield, Sparkles, ArrowRight } from "lucide-react"

function Home() {
  const features = [
    {
      icon: Heart,
      title: "Cultural Compatibility",
      description: "Find matches based on shared values, traditions, and cultural understanding.",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Verified profiles and robust security measures to protect your privacy.",
    },
    {
      icon: Users,
      title: "Quality Matches",
      description: "Advanced matching algorithm focused on long-term compatibility.",
    },
    {
      icon: Sparkles,
      title: "Success Stories",
      description: "Join thousands of couples who found their perfect match on HeartSync.",
    },
  ]

  const testimonials = [
    {
      name: "Adunni & Kemi",
      location: "Lagos",
      text: "HeartSync helped us find each other despite being from different tribes. Our families are now one!",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Ibrahim & Fatima",
      location: "Abuja",
      text: "The cultural matching was perfect. We understood each other from day one.",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Chidi & Ngozi",
      location: "Port Harcourt",
      text: "Two years married and counting! Thank you HeartSync for bringing us together.",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Navigation */}
      <nav className="bg-deep-navy shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-heart-red p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">HeartSync</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-white hover:text-heart-red transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-6xl font-bold text-deep-navy mb-6">
                Find Your
                <span className="text-heart-red"> Perfect Match</span>
                <br />
                in Nigeria
              </h1>
              <p className="text-xl text-slate-gray mb-8 leading-relaxed">
                Connect with like-minded individuals who share your values, culture, and vision for a beautiful future
                together.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register" className="btn-primary flex items-center justify-center space-x-2">
                  <span>Start Your Journey</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/login" className="btn-outline">
                  Sign In
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-heart-red to-sky-blue rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">10K+</div>
                    <div className="text-sm opacity-90">Happy Couples</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">50K+</div>
                    <div className="text-sm opacity-90">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">36</div>
                    <div className="text-sm opacity-90">States Covered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">95%</div>
                    <div className="text-sm opacity-90">Success Rate</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mb-4">Why Choose HeartSync?</h2>
            <p className="text-xl text-slate-gray max-w-3xl mx-auto">
              We understand Nigerian culture and values, making it easier to find someone who truly complements your
              lifestyle and beliefs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-heart-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-heart-red" />
                </div>
                <h3 className="text-xl font-semibold text-deep-navy mb-2">{feature.title}</h3>
                <p className="text-slate-gray">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-soft-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mb-4">How It Works</h2>
            <p className="text-xl text-slate-gray">Simple steps to find your perfect match</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Profile",
                description: "Share your story, values, and what you're looking for in a partner.",
              },
              {
                step: "2",
                title: "Get Matched",
                description: "Our algorithm finds compatible matches based on your preferences.",
              },
              {
                step: "3",
                title: "Start Connecting",
                description: "Chat, meet, and build meaningful relationships with your matches.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="bg-heart-red text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-deep-navy mb-2">{item.title}</h3>
                <p className="text-slate-gray">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mb-4">Success Stories</h2>
            <p className="text-xl text-slate-gray">Real couples, real love stories</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card text-center"
              >
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <p className="text-slate-gray mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-deep-navy">{testimonial.name}</div>
                  <div className="text-sm text-slate-gray">{testimonial.location}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-heart-red to-sky-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Perfect Match?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of Nigerians who have found love and happiness through HeartSync. Your perfect match is
              waiting for you.
            </p>
            <Link
              to="/register"
              className="bg-white text-heart-red hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>Start Your Love Story Today</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-heart-red p-2 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">HeartSync</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Connecting hearts across Nigeria with cultural understanding and modern technology.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-heart-red transition-colors">
                    About Us
                  </a>
                </li>
                
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-heart-red transition-colors">
                    Help Center
                  </a>
                </li>
                
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 HeartSync. All rights reserved. Made with ❤️ by ART_Redox @ DLT_Africa</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
