import { supabase, Comic, Chapter, Page, User } from './supabase'

// Comics API
export const comicsApi = {
  // Get all comics with optional filters
  async getComics(options?: {
    page?: number
    limit?: number
    genre?: string
    status?: string
    search?: string
    sortBy?: string
  }) {
    let query = supabase.from('comics').select('*')
    
    const { page = 1, limit = 20, genre, status, search, sortBy = 'updated_at' } = options || {}

    // Apply filters
    if (genre && genre !== 'all') {
      query = query.contains('genres', [genre])
    }
    
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`)
    }

    // Apply sorting
    const ascending = sortBy === 'title' || sortBy === 'author'
    query = query.order(sortBy, { ascending })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    return await query
  },

  // Get latest comics
  async getLatestComics(limit = 12) {
    return await supabase
      .from('comics')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit)
  },

  // Get comic by slug
  async getComicBySlug(slug: string) {
    return await supabase
      .from('comics')
      .select('*')
      .eq('slug', slug)
      .single()
  },

  // Create new comic (admin only)
  async createComic(comic: Partial<Comic>) {
    return await supabase
      .from('comics')
      .insert([comic])
      .select()
      .single()
  },

  // Update comic (admin only)
  async updateComic(id: string, updates: Partial<Comic>) {
    return await supabase
      .from('comics')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
  },

  // Delete comic (admin only)
  async deleteComic(id: string) {
    return await supabase
      .from('comics')
      .delete()
      .eq('id', id)
  }
}

// Chapters API
export const chaptersApi = {
  // Get chapters for a comic
  async getChaptersByComicId(comicId: string) {
    return await supabase
      .from('chapters')
      .select('*')
      .eq('comic_id', comicId)
      .order('chapter_number', { ascending: false })
  },

  // Get specific chapter
  async getChapter(comicSlug: string, chapterNumber: string | number) {
    const { data: comic } = await comicsApi.getComicBySlug(comicSlug)
    if (!comic) return { data: null, error: new Error('Comic not found') }

    return await supabase
      .from('chapters')
      .select('*')
      .eq('comic_id', comic.id)
      .eq('chapter_number', chapterNumber)
      .single()
  },

  // Create new chapter (admin only)
  async createChapter(chapter: Partial<Chapter>) {
    return await supabase
      .from('chapters')
      .insert([chapter])
      .select()
      .single()
  },

  // Update chapter (admin only)
  async updateChapter(id: string, updates: Partial<Chapter>) {
    return await supabase
      .from('chapters')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
  },

  // Delete chapter (admin only)
  async deleteChapter(id: string) {
    return await supabase
      .from('chapters')
      .delete()
      .eq('id', id)
  }
}

// Pages API
export const pagesApi = {
  // Get pages for a chapter
  async getPagesByChapterId(chapterId: string) {
    return await supabase
      .from('pages')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('page_number', { ascending: true })
  },

  // Create new page (admin only)
  async createPage(page: Partial<Page>) {
    return await supabase
      .from('pages')
      .insert([page])
      .select()
      .single()
  },

  // Update page (admin only)
  async updatePage(id: string, updates: Partial<Page>) {
    return await supabase
      .from('pages')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
  },

  // Delete page (admin only)
  async deletePage(id: string) {
    return await supabase
      .from('pages')
      .delete()
      .eq('id', id)
  },

  // Bulk create pages (admin only)
  async createPages(pages: Partial<Page>[]) {
    return await supabase
      .from('pages')
      .insert(pages)
      .select()
  }
}

// Users API (admin only)
export const usersApi = {
  // Get all users
  async getUsers() {
    return await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
  },

  // Update user role (admin only)
  async updateUserRole(id: string, role: 'USER' | 'ADMIN') {
    return await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select()
      .single()
  }
}

// Upload API
export const uploadApi = {
  // Upload image to Supabase storage
  async uploadImage(file: File, path: string) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${path}/${fileName}`

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return { data: { path: filePath, url: publicUrl }, error: null }
  },

  // Delete image from storage
  async deleteImage(path: string) {
    return await supabase.storage
      .from('images')
      .remove([path])
  }
}

// Search API
export const searchApi = {
  // Search comics
  async searchComics(query: string, limit = 10) {
    return await supabase
      .from('comics')
      .select('*')
      .or(`title.ilike.%${query}%,author.ilike.%${query}%,synopsis.ilike.%${query}%`)
      .limit(limit)
  }
}

// Analytics API (for admin dashboard)
export const analyticsApi = {
  // Get basic stats
  async getBasicStats() {
    const [comics, chapters, users] = await Promise.all([
      supabase.from('comics').select('*', { count: 'exact', head: true }),
      supabase.from('chapters').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true })
    ])

    return {
      totalComics: comics.count || 0,
      totalChapters: chapters.count || 0,
      totalUsers: users.count || 0
    }
  },

  // Get popular comics (can be enhanced with view tracking)
  async getPopularComics(limit = 10) {
    return await supabase
      .from('comics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
  }
}