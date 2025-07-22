'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, Star, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Comic } from '@/lib/supabase'

interface ComicCardProps {
  comic: Comic
  latestChapter?: number
}

export default function ComicCard({ comic, latestChapter }: ComicCardProps) {
  return (
    <Card className="group overflow-hidden bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105">
      <Link href={`/comics/${comic.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={comic.cover_image_url || 'https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg'}
            alt={comic.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <Badge 
              variant={comic.status === 'ONGOING' ? 'default' : 'secondary'}
              className={comic.status === 'ONGOING' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
              }
            >
              {comic.status}
            </Badge>
          </div>

          {/* Latest Chapter */}
          {latestChapter && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                Ch. {latestChapter}
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/comics/${comic.slug}`}>
          <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {comic.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-400 mb-2">{comic.author}</p>

        <p className="text-xs text-gray-500 line-clamp-3 mb-3">
          {comic.synopsis}
        </p>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {comic.genres.slice(0, 2).map((genre) => (
            <Badge
              key={genre}
              variant="secondary"
              className="text-xs bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              {genre}
            </Badge>
          ))}
          {comic.genres.length > 2 && (
            <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300">
              +{comic.genres.length - 2}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Updated 2h ago</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3" />
            <span>4.8</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}