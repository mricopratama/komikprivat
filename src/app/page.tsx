'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ComicCard from '@/components/comics/ComicCard'
import { supabase, Comic } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  const [latestComics, setLatestComics] = useState<Comic[]>([])
  const [popularComics, setPopularComics] = useState<Comic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComics()
  }, [])

  const fetchComics = async () => {
    try {
      // Fetch latest updated comics
      const { data: latest } = await supabase
        .from('comics')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(8)

      // Fetch popular comics (for demo, we'll use the same data)
      const { data: popular } = await supabase
        .from('comics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)

      setLatestComics(latest || [])
      setPopularComics(popular || [])
    } catch (error) {
      console.error('Error fetching comics:', error)
    } finally {
      setLoading(false)
    }
  }

  // Early return for loading state
  if (loading) {
    return (
      <div>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-800">
            <div className="absolute inset-0 bg-gray-900 opacity-20" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Discover Amazing
                  <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Comics
                  </span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Dive into thousands of captivating stories with our premium comic reading experience. 
                  From action-packed adventures to heartwarming romances.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/comics">
                      Browse Comics <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                    <Link href="/latest">Latest Releases</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-400">1,000+</div>
                  <div className="text-gray-400">Comics Available</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-purple-400">10,000+</div>
                  <div className="text-gray-400">Chapters Read</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-400">500+</div>
                  <div className="text-gray-400">Active Readers</div>
                </div>
              </div>
            </div>
          </section>

          {/* Loading Latest Releases */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-blue-400" />
                  <h2 className="text-3xl font-bold text-white">Latest Releases</h2>
                </div>
                <Button asChild variant="ghost" className="text-blue-400 hover:text-white">
                  <Link href="/latest">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="bg-gray-800 animate-pulse">
                    <div className="aspect-[3/4] bg-gray-700 rounded-t-lg" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                      <div className="h-3 bg-gray-700 rounded w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Loading Popular Comics */}
          <section className="py-16 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-y border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                  <h2 className="text-3xl font-bold text-white">Trending Now</h2>
                </div>
                <Button asChild variant="ghost" className="text-purple-400 hover:text-white">
                  <Link href="/popular">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-gray-800 animate-pulse">
                    <div className="aspect-[3/4] bg-gray-700 rounded-t-lg" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                      <div className="h-3 bg-gray-700 rounded w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-800">
          <div className="absolute inset-0 bg-gray-900 opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Discover Amazing
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Comics
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Dive into thousands of captivating stories with our premium comic reading experience. 
                From action-packed adventures to heartwarming romances.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/comics">
                    Browse Comics <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  <Link href="/latest">Latest Releases</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-400">1,000+</div>
                <div className="text-gray-400">Comics Available</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-400">10,000+</div>
                <div className="text-gray-400">Chapters Read</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-400">500+</div>
                <div className="text-gray-400">Active Readers</div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Releases */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-blue-400" />
                <h2 className="text-3xl font-bold text-white">Latest Releases</h2>
              </div>
              <Button asChild variant="ghost" className="text-blue-400 hover:text-white">
                <Link href="/latest">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestComics.map((comic) => (
                <ComicCard key={comic.id} comic={comic} />
              ))}
            </div>
          </div>
        </section>

        {/* Popular Comics */}
        <section className="py-16 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-purple-400" />
                <h2 className="text-3xl font-bold text-white">Trending Now</h2>
              </div>
              <Button asChild variant="ghost" className="text-purple-400 hover:text-white">
                <Link href="/popular">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularComics.map((comic, index) => (
                <Card key={comic.id} className="group relative bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-purple-500 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-purple-600 text-white font-semibold">
                      #{index + 1}
                    </Badge>
                  </div>
                  <ComicCard comic={comic} />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-12 border border-gray-800">
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of readers and discover your next favorite story today.
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/register">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}