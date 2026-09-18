import React, { useState } from 'react'

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
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Sourcing Tips', 'Industry News', 'Case Studies', 'Logistics', 'Quality Control']

  const blogPosts = [
    {
      id: 1,
      title: 'Top 5 Tips for Sourcing Machinery from China',
      excerpt: 'Learn the essential strategies for finding reliable machinery suppliers and ensuring quality in your sourcing process.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Sourcing Tips',
      date: 'Sep 15, 2026',
      author: 'John Smith',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Navigating Chinese Manufacturing: A Complete Guide',
      excerpt: 'Everything you need to know about working with Chinese manufacturers, from communication to quality control.',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Industry News',
      date: 'Sep 10, 2026',
      author: 'Sarah Johnson',
      readTime: '8 min read'
    },
    {
      id: 3,
      title: 'How We Saved a Client 40% on Procurement Costs',
      excerpt: 'A real case study showing how strategic sourcing from China transformed our client\'s bottom line.',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Case Studies',
      date: 'Sep 5, 2026',
      author: 'Mike Chen',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Understanding Logistics: China to India Shipping Routes',
      excerpt: 'Explore the most efficient shipping routes and logistics options for importing from China to India.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Logistics',
      date: 'Aug 28, 2026',
      author: 'Emily Davis',
      readTime: '7 min read'
    },
    {
      id: 5,
      title: 'Quality Control Standards in Chinese Manufacturing',
      excerpt: 'Learn about the quality control measures and standards you should implement when sourcing from China.',
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Quality Control',
      date: 'Aug 20, 2026',
      author: 'David Wilson',
      readTime: '4 min read'
    },
    {
      id: 6,
      title: 'The Future of Global Sourcing: Trends to Watch',
      excerpt: 'Discover the emerging trends in global sourcing and how they will impact businesses in the coming years.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Industry News',
      date: 'Aug 15, 2026',
      author: 'Lisa Anderson',
      readTime: '6 min read'
    }
  ]

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  const BlogCard = ({ post }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-[#F41703] text-white text-xs font-medium px-3 py-1 rounded-full">
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span>{post.date}</span>
          <span className="mx-2">•</span>
          <span>{post.readTime}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#F41703] transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
              {post.author.charAt(0)}
            </div>
            <span className="ml-2 text-sm text-gray-700">{post.author}</span>
          </div>
          <button className="text-[#F41703] font-medium hover:underline text-sm">
            Read More →
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
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
            <span>Home</span>
            <ChevronDivider />
            <span className="text-white font-medium">Blog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white max-w-xl leading-tight">
            Insights, tips, and industry news to help you succeed in global sourcing
          </h1>
          <p className="text-white/85 text-base sm:text-lg mt-4 max-w-xl leading-relaxed">
            Stay updated with the latest sourcing strategies, industry trends, and expert insights from our team.
          </p>
        </div>
      </div>

   
      {/* Category Filter */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-[#F41703] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

   
    
    </div>
  )
}

export default Blog