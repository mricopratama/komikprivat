import { supabase } from '../lib/supabase'
import { sampleComics, sampleChapterTitles, samplePageImages } from '../lib/seed-data'

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await supabase.from('pages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('chapters').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('comics').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Insert comics
    console.log('📚 Inserting comics...')
    const { data: comics, error: comicsError } = await supabase
      .from('comics')
      .insert(sampleComics.map(comic => ({
        title: comic.title,
        slug: comic.slug,
        author: comic.author,
        synopsis: comic.synopsis,
        status: comic.status,
        cover_image_url: comic.cover_image_url,
        genres: comic.genres
      })))
      .select()

    if (comicsError) {
      console.error('Error inserting comics:', comicsError)
      return
    }

    console.log(`✅ Inserted ${comics.length} comics`)

    // Insert chapters for each comic
    console.log('📖 Inserting chapters...')
    for (const comic of comics) {
      const chapters = []
      for (let i = 1; i <= 10; i++) {
        chapters.push({
          chapter_number: i,
          title: sampleChapterTitles[i - 1] || `Chapter ${i}`,
          comic_id: comic.id
        })
      }

      const { data: insertedChapters, error: chaptersError } = await supabase
        .from('chapters')
        .insert(chapters)
        .select()

      if (chaptersError) {
        console.error('Error inserting chapters:', chaptersError)
        continue
      }

      console.log(`✅ Inserted ${insertedChapters.length} chapters for ${comic.title}`)

      // Insert pages for each chapter
      console.log(`📄 Inserting pages for ${comic.title}...`)
      for (const chapter of insertedChapters) {
        const pages = []
        const pageCount = 15 + Math.floor(Math.random() * 10) // 15-25 pages per chapter

        for (let j = 1; j <= pageCount; j++) {
          pages.push({
            page_number: j,
            image_url: samplePageImages[j % samplePageImages.length],
            chapter_id: chapter.id
          })
        }

        const { error: pagesError } = await supabase
          .from('pages')
          .insert(pages)

        if (pagesError) {
          console.error('Error inserting pages:', pagesError)
          continue
        }

        console.log(`✅ Inserted ${pages.length} pages for Chapter ${chapter.chapter_number}`)
      }
    }

    console.log('🎉 Database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  }
}

// Run the seeding function
seedDatabase()