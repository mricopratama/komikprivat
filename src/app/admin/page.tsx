'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Book, FileText, Users, BarChart3, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { supabase, Comic } from '@/lib/supabase'
import { getCurrentUser, AuthUser } from '@/lib/auth'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export default function AdminDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [comics, setComics] = useState<Comic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkAuthAndFetchData()
  }, [])

  const checkAuthAndFetchData = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser || currentUser.role !== 'ADMIN') {
        router.push('/login')
        return
      }

      setUser(currentUser)
      await fetchComics()
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchComics = async () => {
    try {
      const { data, error } = await supabase
        .from('comics')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setComics(data || [])
    } catch (error) {
      console.error('Error fetching comics:', error)
    }
  }

  const filteredComics = comics.filter(comic =>
    comic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comic.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
            <div className="text-white">Loading dashboard...</div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-400 mb-8">You don't have permission to access this page.</p>
            <Button asChild>
              <Link href="/">Go Home</Link>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user.username}. Manage your comic platform.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-600/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Comics</CardTitle>
                <Book className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{comics.length}</div>
                <p className="text-xs text-gray-400">+2 from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-600/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Active Comics</CardTitle>
                <BarChart3 className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {comics.filter(c => c.status === 'ONGOING').length}
                </div>
                <p className="text-xs text-gray-400">Ongoing series</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-600/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Chapters</CardTitle>
                <FileText className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">1,234</div>
                <p className="text-xs text-gray-400">+45 this week</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-yellow-600/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
                <Users className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">1,891</div>
                <p className="text-xs text-gray-400">+89 this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Button asChild className="h-20 bg-blue-600 hover:bg-blue-700">
              <Link href="/admin/comics/new" className="flex flex-col items-center space-y-2">
                <Plus className="h-6 w-6" />
                <span>Add New Comic</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-20 border-gray-600 text-white hover:bg-gray-800">
              <Link href="/admin/chapters/new" className="flex flex-col items-center space-y-2">
                <FileText className="h-6 w-6" />
                <span>Add Chapter</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-20 border-gray-600 text-white hover:bg-gray-800">
              <Link href="/admin/analytics" className="flex flex-col items-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span>View Analytics</span>
              </Link>
            </Button>
          </div>

          {/* Comics Management */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Comics Management</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your comic collection and chapters
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href="/admin/comics/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Comic
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search comics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-900 border-gray-600 text-white"
                  />
                </div>
              </div>

              {/* Comics Table */}
              <div className="space-y-4">
                {filteredComics.length === 0 ? (
                  <div className="text-center py-8">
                    <Book className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No comics found</h3>
                    <p className="text-gray-400">Start by adding your first comic.</p>
                  </div>
                ) : (
                  filteredComics.map((comic) => (
                    <div key={comic.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-16 bg-gray-700 rounded overflow-hidden">
                          <img
                            src={comic.cover_image_url || 'https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg'}
                            alt={comic.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{comic.title}</h3>
                          <p className="text-sm text-gray-400">{comic.author}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge 
                              className={comic.status === 'ONGOING' 
                                ? 'bg-green-600' 
                                : 'bg-blue-600'
                              }
                            >
                              {comic.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Updated {new Date(comic.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button asChild variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-800">
                          <Link href={`/admin/comics/${comic.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-800">
                          <Link href={`/admin/comics/${comic.id}/chapters`}>
                            Chapters
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-800">
                          <Link href={`/comics/${comic.slug}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}