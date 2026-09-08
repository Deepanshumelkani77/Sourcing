import React, { useState } from 'react'

const Icon = ({ path, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {path}
  </svg>
)

const icons = {
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.55V19.9a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.56 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.34-1.87 1.7 1.7 0 00-1.55-1H2.6a2 2 0 110-4h.1a1.7 1.7 0 001.55-1 1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06a1.7 1.7 0 001.87.34H8.7a1.7 1.7 0 001-1.55V2.6a2 2 0 114 0v.1a1.7 1.7 0 001 1.55 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87v.1a1.7 1.7 0 001.55 1h.1a2 2 0 110 4h-.1a1.7 1.7 0 00-1.55 1z" />
    </>
  ),
  factory: (
    <>
      <path d="M3 21V10l6 4v-4l6 4V6l6 4v11H3z" />
      <path d="M7 21v-4M12 21v-4M17 21v-4" />
    </>
  ),
  box: (
    <>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </>
  ),
  cnc: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M4 9h16M9 4v16" />
      <circle cx="14.5" cy="14.5" r="2" />
    </>
  ),
  wrench: <path d="M14.7 6.3a4 4 0 11-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 015.4-5.4l-3 3-2-2 3-3z" />,
  kitchen: (
    <>
      <path d="M8 3v6a2 2 0 002 2h0a2 2 0 002-2V3" />
      <path d="M10 11v10" />
      <path d="M17 3c-1.5 1.5-2 3-2 5s.5 3.5 2 5c1.5-1.5 2-3 2-5s-.5-3.5-2-5z" />
      <path d="M17 13v8" />
    </>
  ),
  bolt: <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" />,
  bag: (
    <>
      <path d="M6 8h12l1 13H5L6 8z" />
      <path d="M9 8V6a3 3 0 016 0v2" />
    </>
  ),
  plug: (
    <>
      <path d="M9 3v5M15 3v5" />
      <path d="M7 8h10v3a5 5 0 01-10 0V8z" />
      <path d="M12 16v5" />
    </>
  ),
  puzzle: (
    <path d="M6 4h4a2 2 0 100 4h1v4h-4a2 2 0 100 4H4v-4a2 2 0 100-4V4h2zm10 0h4v4a2 2 0 110 4h-1v4h1a2 2 0 110 4h-4v-4a2 2 0 100-4h1V8h-1a2 2 0 100-4z" />
  ),
}

// Drop real photos into /public/images/... using these paths.
// Recommended: 1200x900px (4:3), .jpg or .webp, under 300kb.
const machineryItems = [
  {
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'gear',
    title: 'Industrial Machinery',
    desc: 'Heavy-duty machines for production lines and large-scale operations.',
  },
  {
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'factory',
    title: 'Manufacturing Equipment',
    desc: 'Equipment for assembly, fabrication, and processing at scale.',
  },
  {
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'box',
    title: 'Packaging Machinery',
    desc: 'Filling, sealing, labeling, and wrapping machines for any product line.',
  },
  {
    image: 'https://images.unsplash.com/photo-1563770095-39d468f95742?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'cnc',
    title: 'CNC / Automation Equipment',
    desc: 'Precision CNC systems and automated equipment for repeatable output.',
  },
  {
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'wrench',
    title: 'Specialized Machinery',
    desc: 'Custom-built or niche machinery matched to your exact spec.',
  },
]

const productItems = [
  {
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'kitchen',
    title: 'Home & Kitchen',
    desc: 'Cookware, appliances, and household goods sourced at volume.',
  },
  {
    image: 'https://images.unsplash.com/photo-1563770095-39d468f95742?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'bolt',
    title: 'Industrial Products',
    desc: 'Components and supplies built for industrial and commercial use.',
  },
  {
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'bag',
    title: 'Consumer Products',
    desc: 'Retail-ready goods across a wide range of categories.',
  },
  {
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'plug',
    title: 'Electrical / Electronics',
    desc: 'Electrical parts and electronic devices, tested and certified.',
  },
  {
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'puzzle',
    title: 'Custom Products',
    desc: 'Products built to your own design, materials, or branding.',
  },
]

const Card = ({ image, icon, title, desc }) => {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <div className="group relative bg-white border border-gray-200 hover:border-[#F41703] transition-colors duration-200 overflow-hidden">
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {!imgFailed ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <Icon path={icons[icon]} className="w-10 h-10 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 w-9 h-9 flex items-center justify-center bg-white/95">
          <Icon path={icons[icon]} className="w-4.5 h-4.5 text-[#F41703]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h4 className="text-white font-semibold text-base leading-tight">
            {title}
          </h4>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

const CategoryBlock = ({ label, headline, description, items }) => (
  <div>
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
      <div>
        <span className="text-xs font-semibold text-[#F41703] tracking-wide">
          {label}
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
          {headline}
        </h3>
      </div>
      <p className="text-sm text-gray-500 max-w-sm">{description}</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {items.map((item) => (
        <Card key={item.title} {...item} />
      ))}
    </div>
  </div>
)

const Source = () => {
  return (
    <div>
      {/* What Can We Source Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              What can we source?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              From heavy machinery to finished consumer goods — we find, vet,
              and deliver.
            </p>
          </div>

          <div className="space-y-16">
            <CategoryBlock
              label="MACHINERY"
              headline="Machines built for production"
              description="Sourced and inspected before they ever leave the factory floor."
              items={machineryItems}
            />
            <CategoryBlock
              label="PRODUCTS"
              headline="Goods ready to sell"
              description="Consumer and industrial products, sourced to your spec."
              items={productItems}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Source