import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Brain,
  LineChartIcon as ChartLine,
  Dumbbell,
  Lightbulb,
  MessageSquare,
  Sparkles,
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Your Personal Gym for the Brain</h1>
              <p className="text-xl md:text-2xl opacity-90">
                Combat cognitive decline with AI-powered mental workouts tailored just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild className="bg-white text-purple-700 hover:bg-gray-100">
                  <Link href="/dashboard">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-4 bg-white/30 rounded-full animate-pulse animation-delay-300"></div>
                <div className="absolute inset-8 bg-white/40 rounded-full animate-pulse animation-delay-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="h-32 w-32 md:h-40 md:w-40 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How Brain Gym Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Dumbbell className="h-8 w-8 text-purple-600" />}
              title="Personalized Brain Workouts"
              description="AI-curated daily challenges tailored to your cognitive profile, interests, and goals."
            />
            <FeatureCard
              icon={<ChartLine className="h-8 w-8 text-purple-600" />}
              title="Cognitive Skill Tracking"
              description="Monitor your progress across memory, focus, problem-solving, creativity, and language skills."
            />
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-purple-600" />}
              title="Adaptive Difficulty"
              description="Exercises that adjust in real-time to keep you in the optimal learning zone."
            />
            <FeatureCard
              icon={<Lightbulb className="h-8 w-8 text-purple-600" />}
              title="Learn Something New Daily"
              description="Expand your knowledge with bite-sized lessons on fascinating topics."
            />
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8 text-purple-600" />}
              title="AI Brain Coach"
              description="Chat with your personal AI coach for guidance, motivation, and custom tips."
            />
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-purple-600" />}
              title="Mindfulness Integration"
              description="Balance mental workouts with relaxation exercises for optimal brain health."
            />
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/dashboard">Start Your Brain Journey</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Users Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="I've noticed significant improvements in my memory and focus after just 3 weeks of daily brain workouts."
              author="Sarah J., 42"
            />
            <TestimonialCard
              quote="The personalized challenges keep me engaged, and I love seeing my progress on the dashboard."
              author="Michael T., 65"
            />
            <TestimonialCard
              quote="As a student, Brain Gym helps me stay sharp and improve my learning efficiency."
              author="Aisha K., 22"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Boost Your Brain Power?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are strengthening their minds and preventing cognitive decline.
          </p>
          <Button size="lg" asChild className="bg-white text-purple-700 hover:bg-gray-100">
            <Link href="/signup">Create Free Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Brain Gym</h3>
              <p className="opacity-70">Your AI-powered cognitive enhancement platform.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 opacity-70">
                <li>
                  <Link href="/exercises">Brain Exercises</Link>
                </li>
                <li>
                  <Link href="/tracking">Progress Tracking</Link>
                </li>
                <li>
                  <Link href="/coach">AI Coach</Link>
                </li>
                <li>
                  <Link href="/mindfulness">Mindfulness</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 opacity-70">
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
                <li>
                  <Link href="/science">The Science</Link>
                </li>
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="/support">Support</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 opacity-70">
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/cookies">Cookie Policy</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center opacity-70">
            <p>&copy; {new Date().getFullYear()} Brain Gym. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
      <div className="text-purple-600 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
        </svg>
      </div>
      <p className="text-gray-700 mb-4">{quote}</p>
      <p className="font-semibold">{author}</p>
    </div>
  )
}
