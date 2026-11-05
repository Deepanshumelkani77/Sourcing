import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getPublishedBlogs } from '../services/blogApi'

const ChevronDivider = () => (
  <svg
    className="w-4 h-4 text-white/50"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7.5 4.5L13 10l-5.5 5.5" />
  </svg>
)

const BLOG_HERO_IMAGE = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&h=800&fit=crop'

const Blog = () => {
  // Add custom scrollbar styles
  const scrollbarStyles = `
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [blogs, setBlogs] = useState([])
  const [featuredBlogs, setFeaturedBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = [
    { key: 'blog.categories.all', label: 'All' },
    { key: 'blog.categories.machinerySourcing', label: 'Machinery Sourcing' },
    { key: 'blog.categories.manufacturing', label: 'Manufacturing' },
    { key: 'blog.categories.logistics', label: 'Logistics' },
    { key: 'blog.categories.qualityControl', label: 'Quality Control' },
    { key: 'blog.categories.industryInsights', label: 'Industry Insights' },
    { key: 'blog.categories.caseStudies', label: 'Case Studies' },
    { key: 'blog.categories.globalSourcing', label: 'Global Sourcing' }
  ]

  const getCategoryLabel = (category) => {
    const found = categories.find(c => c.label === category)
    return found ? found.label : category
  }

  useEffect(() => {
    fetchBlogs()
    fetchFeaturedBlogs()
  }, [selectedCategory])

  const fetchFeaturedBlogs = async () => {
    try {
      // Fetch all featured blogs (no category filter)
      const result = await getPublishedBlogs({ featured: 'true' })
      if (result.success) {
        const featured = result.blogs || []
        setFeaturedBlogs(featured)
      }
    } catch (error) {
      console.error('Error fetching featured blogs:', error)
    }
  }

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all blogs with category filter
      // When "All" is selected, don't send category parameter
      const category = selectedCategory === 'All' ? null : selectedCategory
      const params = category ? { category } : {}

      console.log('=== BLOG FETCH DEBUG ===')
      console.log('Selected category:', selectedCategory)
      console.log('Category filter sent to API:', category)
      console.log('Params object:', params)

      const result = await getPublishedBlogs(params)

      console.log('API result:', result)
      console.log('API success:', result.success)
      console.log('Blogs array:', result.blogs)
      console.log('Blogs count:', result.blogs?.length)

      if (result.success) {
        const allBlogs = result.blogs || []
        setBlogs(allBlogs)
      } else {
        console.error('API returned error:', result.message)
        setError(result.message || 'Failed to fetch blogs')
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setError('Unable to load blogs. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const FeaturedBlogCard = ({ post }) => (
    <div
      className="relative h-[320px] rounded-xl overflow-hidden group cursor-pointer"
      onClick={() => navigate(`/blog/${post.slug}`)}
    >
      <img
        src={post.coverImage}
        alt={post.coverImageAlt || post.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <span className="bg-[#F41703] text-white text-xs font-medium px-3 py-1 rounded-full mb-3 inline-block">
          {post.category}
        </span>
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#F41703] transition-colors">
          {post.title}
        </h3>
        <p className="text-white/90 text-sm line-clamp-2 mb-3">
          {post.excerpt}
        </p>
        <div className="flex items-center text-white/80 text-sm">
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          <span className="mx-2">•</span>
          <span>{post.readingTime} min read</span>
        </div>
      </div>
    </div>
  )

  const BlogCard = ({ post }) => (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
      onClick={() => navigate(`/blog/${post.slug}`)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.coverImageAlt || post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop'
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-[#F41703] text-white text-xs font-medium px-3 py-1 rounded-full">
            {post.category}
          </span>
        </div>
        {post.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-500 text-white text-xs font-medium px-3 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          <span className="mx-2">•</span>
          <span>{post.readingTime} min read</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#F41703] transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-[#F41703] to-[#D41503] rounded-full flex items-center justify-center text-white text-sm font-medium">
              {post.author?.firstName?.charAt(0) || 'A'}
            </div>
            <span className="ml-2 text-sm text-gray-700">
              {post.author?.firstName} {post.author?.lastName}
            </span>
          </div>
          <button className="text-[#F41703] font-medium hover:underline text-sm flex items-center">
            Read More
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <style>{scrollbarStyles}</style>
      {/* Hero Section */}
      <div className="relative w-full h-[340px] sm:h-[420px] overflow-hidden">
        <img
          src={BLOG_HERO_IMAGE}
          alt="Business professionals working together"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(120deg, rgba(120,12,3,0.32), rgba(120,12,3,0.35))`,
          }}
        />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <span>{t('nav.home')}</span>
            <ChevronDivider />
            <span className="text-white font-medium">{t('nav.blog')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white max-w-xl leading-tight">
            Insights, Tips, and Industry News
          </h1>
          <p className="text-white/85 text-base sm:text-lg mt-4 max-w-xl leading-relaxed">
            Stay updated with the latest sourcing strategies, industry trends, and expert insights from our team.
          </p>
        </div>
      </div>

      {/* Featured Blogs Section */}
      {featuredBlogs.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Featured Articles
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                <span>{featuredBlogs.length}</span>
                <span>•</span>
                <span>Swipe to explore</span>
              </div>
            </div>
            <div className="relative">
              {/* Scrollable container */}
              <div className="flex overflow-x-auto gap-6 pb-6 snap-x scroll-smooth">
                {featuredBlogs.map((post, index) => (
                  <div key={post._id} className="flex-shrink-0 w-[85vw] md:w-[calc(33.333%-16px)] snap-start">
                    <FeaturedBlogCard post={post} />
                  </div>
                ))}
              </div>

              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {featuredBlogs.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const container = document.querySelector('.featured-scroll-container')
                      const card = container.children[index]
                      if (card) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
                      }
                    }}
                    className="w-2 h-2 rounded-full bg-gray-300 hover:bg-[#F41703] transition-colors duration-200"
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Divider only if featured section exists */}
      {featuredBlogs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <hr className="border-gray-200 my-8" />
        </div>
      )}

      {/* Category Filter */}
      <section className="py-8 px-4 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.label)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.label
                    ? 'bg-[#F41703] text-white shadow-md hover:bg-[#D41503]'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {t(category.key)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {selectedCategory === 'All' ? 'All Articles' : getCategoryLabel(selectedCategory)}
                </h2>
                <p className="text-gray-600 mt-2">
                  {loading ? 'Loading...' : `${blogs.length} article${blogs.length !== 1 ? 's' : ''} found`}
                </p>
              </div>
              <button
                onClick={fetchBlogs}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Refresh
              </button>
            </div>
            {!loading && blogs.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Debug Info:</strong> No blogs found. Check browser console (F12) for detailed logs.
                  Make sure you've run <code className="bg-yellow-100 px-2 py-1 rounded">npm run seed:blogs</code> in the backend.
                </p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-3" />
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-3" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4" />
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                      <div className="ml-2 h-4 bg-gray-200 rounded animate-pulse w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Blogs</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchBlogs}
                className="bg-[#F41703] text-white px-6 py-2 rounded-lg hover:bg-[#D41503] transition"
              >
                Try Again
              </button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-5xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Blogs Found</h3>
              <p className="text-gray-600">
                {selectedCategory === 'All'
                  ? 'No blogs have been published yet.'
                  : `No blogs found in ${selectedCategory} category.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Blog