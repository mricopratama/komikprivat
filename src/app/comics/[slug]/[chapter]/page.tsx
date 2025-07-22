'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Home, Menu, Settings, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { supabase, Comic, Chapter, Page } from '@/lib/supabase'

interface ComicReaderProps {
  comic: Comic
  chapter: Chapter
  pages: Page[]
  allChapters: Chapter[]
}

function ComicReader({ comic, chapter, pages, allChapters }: ComicReaderProps) {
  const router = useRouter()
  const [showNavigation, setShowNavigation] = useState(true)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  const currentChapterIndex = allChapters.findIndex(c => c.id === chapter.id)
  const prevChapter = allChapters[currentChapterIndex + 1]
  const nextChapter = allChapters[currentChapterIndex - 1]

  useEffect(() => {
    const handleScroll = () => {
      setShowNavigation(true)
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setShowNavigation(false)
      }, 3000)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  const handleChapterChange = (chapterNumber: string) => {
    router.push(`/comics/${comic.slug}/${chapterNumber}`)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Top Navigation */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent transition-transform duration-300 ${
        showNavigation ? 'transform translate-y-0' : 'transform -translate-y-full'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Link href={`/comics/${comic.slug}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-white text-sm">
                <span className="font-medium">{comic.title}</span>
                <span className="text-gray-400 ml-2">
                  Ch. {chapter.chapter_number}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Navigation */}
      <div className={`fixed top-16 left-0 right-0 z-40 bg-gradient-to-b from-black/80 to-transparent transition-transform duration-300 ${
        showNavigation ? 'transform translate-y-0' : 'transform -translate-y-full'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              asChild
              variant="outline"
              size="sm"
              className={`border-gray-600 text-white hover:bg-gray-800 ${
                !prevChapter ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!prevChapter}
            >
              {prevChapter ? (
                <Link href={`/comics/${comic.slug}/${prevChapter.chapter_number}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Link>
              ) : (
                <span>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </span>
              )}
            </Button>

            <Select value={chapter.chapter_number.toString()} onValueChange={handleChapterChange}>
              <SelectTrigger className="w-48 bg-gray-900 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                {allChapters.map((ch) => (
                  <SelectItem key={ch.id} value={ch.chapter_number.toString()}>
                    Ch. {ch.chapter_number} {ch.title && `- ${ch.title}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              asChild
              variant="outline"
              size="sm"
              className={`border-gray-600 text-white hover:bg-gray-800 ${
                !nextChapter ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!nextChapter}
            >
              {nextChapter ? (
                <Link href={`/comics/${comic.slug}/${nextChapter.chapter_number}`}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              ) : (
                <span>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Comic Pages */}
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          {pages.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-white text-xl mb-4">No pages available</div>
              <div className="text-gray-400">This chapter doesn't have any pages yet.</div>
            </div>
          ) : (
            <div className="space-y-1">
              {pages.map((page, index) => (
                <div key={page.id} className="relative">
                  <Image
                    src={page.image_url}
                    alt={`Page ${page.page_number}`}
                    width={800}
                    height={1200}
                    className="w-full h-auto"
                    loading={index < 3 ? 'eager' : 'lazy'}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg'
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {page.page_number}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 to-transparent transition-transform duration-300 ${
        showNavigation ? 'transform translate-y-0' : 'transform translate-y-full'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-4">
            <Button
              asChild
              variant="outline"
              className={`border-gray-600 text-white hover:bg-gray-800 ${
                !prevChapter ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!prevChapter}
            >
              {prevChapter ? (
                <Link href={`/comics/${comic.slug}/${prevChapter.chapter_number}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Ch. {prevChapter.chapter_number}
                </Link>
              ) : (
                <span>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </span>
              )}
            </Button>

            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href={`/comics/${comic.slug}`}>
                <Menu className="h-4 w-4 mr-2" />
                Chapters
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className={`border-gray-600 text-white hover:bg-gray-800 ${
                !nextChapter ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!nextChapter}
            >
              {nextChapter ? (
                <Link href={`/comics/${comic.slug}/${nextChapter.chapter_number}`}>
                  Ch. {nextChapter.chapter_number}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              ) : (
                <span>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChapterPage() {
  const params = useParams()
  const slug = params.slug as string
  const chapterNumber = params.chapter as string
  
  const [comic, setComic] = useState<Comic | null>(null)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [pages, setPages] = useState<Page[]>([])
  const [allChapters, setAllChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug && chapterNumber) {
      fetchChapterData()
    }
  }, [slug, chapterNumber])

  const fetchChapterData = async () => {
    try {
      // Fetch comic
      const { data: comicData, error: comicError } = await supabase
        .from('comics')
        .select('*')
        .eq('slug', slug)
        .single()

      if (comicError) throw comicError

      // Fetch all chapters for navigation
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .select('*')
        .eq('comic_id', comicData.id)
        .order('chapter_number', { ascending: false })

      if (chaptersError) throw chaptersError

      // Find current chapter
      const currentChapter = chaptersData.find(
        ch => ch.chapter_number.toString() === chapterNumber
      )

      if (!currentChapter) {
        throw new Error('Chapter not found')
      }

      // Fetch pages for current chapter
      const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .eq('chapter_id', currentChapter.id)
        .order('page_number', { ascending: true })

      if (pagesError) throw pagesError

      setComic(comicData)
      setChapter(currentChapter)
      setPages(pagesData || [])
      setAllChapters(chaptersData || [])
    } catch (err) {
      console.error('Error fetching chapter data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <div className="text-white">Loading chapter...</div>
        </div>
      </div>
    )
  }

  if (error || !comic || !chapter) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Chapter Not Found</h1>
          <p className="text-gray-400 mb-8">
            {error || 'The chapter you are looking for does not exist.'}
          </p>
          <Button asChild>
            <Link href="/comics">Browse Comics</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ComicReader
      comic={comic}
      chapter={chapter}
      pages={pages}
      allChapters={allChapters}
    />
  )
}