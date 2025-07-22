'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, BookOpen, Star, ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { supabase, Comic, Chapter } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ComicDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [comic, setComic] = useState<Comic | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchComicData()
    }
  }, [slug])

  const fetchComicData = async () => {
    try {
      // Fetch comic details
      const { data: comicData, error: comicError } = await supabase
        .from('comics')
        .select('*')
        .eq('slug', slug)
        .single()

      if (comicError) throw comicError

      // Fetch chapters
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .select('*')
        .eq('comic_id', comicData.id)
        .order('chapter_number', { ascending: false })

      if (chaptersError) throw chaptersError

      setComic(comicData)
      setChapters(chaptersData || [])
    } catch (error) {
      console.error('Error fetching comic data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="aspect-[3/4] bg-gray-800 rounded-lg" />
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-12 bg-gray-800 rounded w-3/4" />
                  <div className="h-6 bg-gray-800 rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800 rounded" />
                    <div className="h-4 bg-gray-800 rounded" />
                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!comic) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Comic Not Found</h1>
            <p className="text-gray-400 mb-8">The comic you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild>
              <Link href="/comics">Browse Comics</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Breadcrumb */}
        <div className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex text-sm">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link href="/comics" className="text-gray-400 hover:text-white transition-colors">
                Comics
              </Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-white">{comic.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Comic Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Cover Image */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                <Image
                  src={comic.cover_image_url || 'https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg'}
                  alt={comic.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                {chapters.length > 0 && (
                  <>
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                      <Link href={`/comics/${comic.slug}/${chapters[chapters.length - 1].chapter_number}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Start Reading
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                      <Link href={`/comics/${comic.slug}/${chapters[0].chapter_number}`}>
                        Continue Latest
                      </Link>
                    </Button>
                  </>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-white hover:bg-gray-800">
                    <Star className="mr-2 h-4 w-4" />
                    4.8
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-white hover:bg-gray-800">
                    Bookmark
                  </Button>
                </div>
              </div>
            </div>

            {/* Comic Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">{comic.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <Badge 
                    className={comic.status === 'ONGOING' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                    }
                  >
                    {comic.status}
                  </Badge>
                  <div className="flex items-center text-gray-400">
                    <User className="h-4 w-4 mr-1" />
                    <span>{comic.author}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(comic.created_at)}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{chapters.length} Chapters</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {comic.genres.map((genre) => (
                    <Badge key={genre} variant="secondary" className="bg-gray-800 text-gray-300 hover:bg-gray-700">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed">
                  {comic.synopsis || 'No synopsis available for this comic.'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-gray-800/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">4.8</div>
                  <div className="text-sm text-gray-400">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{chapters.length}</div>
                  <div className="text-sm text-gray-400">Chapters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">1.2K</div>
                  <div className="text-sm text-gray-400">Bookmarks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">15K</div>
                  <div className="text-sm text-gray-400">Views</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Chapters</h2>
              <div className="flex items-center text-gray-400">
                <Clock className="h-4 w-4 mr-2" />
                <span>Last updated: {formatDate(comic.updated_at)}</span>
              </div>
            </div>

            {chapters.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Chapters Available</h3>
                  <p className="text-gray-400">This comic doesn&apos;t have any chapters yet. Check back later!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {chapters.map((chapter, index) => (
                  <Card key={chapter.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-colors group">
                    <CardContent className="p-4">
                      <Link 
                        href={`/comics/${comic.slug}/${chapter.chapter_number}`}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="text-blue-400 font-semibold">
                              Ch. {chapter.chapter_number}
                            </div>
                            <div className="text-white group-hover:text-blue-400 transition-colors">
                              {chapter.title || `Chapter ${chapter.chapter_number}`}
                            </div>
                            {index === 0 && (
                              <Badge className="bg-red-600 text-white">NEW</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {formatDate(chapter.created_at)}
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}