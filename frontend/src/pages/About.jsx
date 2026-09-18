import React from 'react'

/**
 * Images: replace the URLs below with your own photos.
 * If you keep images in /public/images, use src="/images/hero.jpg" instead.
 */
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?w=1600&h=800&fit=crop'
const STORY_IMAGE =
  'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80'
const CTA_IMAGE =
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80'

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

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* ---------------- Hero ---------------- */}
      <div className="relative w-full h-[340px] sm:h-[420px] overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Container port and cargo shipping operations"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(120deg, rgba(120,12,3,0.22), rgba(120,12,3,0.25))`,
          }}
        />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <span>Home</span>
            <ChevronDivider />
            <span className="text-white font-medium">About Us</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white max-w-xl leading-tight">
            Sourcing from China, without the guesswork.
          </h1>
          <p className="text-white/85 text-base sm:text-lg mt-4 max-w-xl leading-relaxed">
            For over a decade, IndoChinaBridge has helped businesses source machinery and
            products from verified Chinese factories — no unvetted suppliers, no hidden
            margins, just quality checked before it ships.
          </p>
        </div>
      </div>

      {/* ---------------- Stats bar ---------------- */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              ['500+', 'Clients served'],
              ['1000+', 'Products sourced'],
              ['50+', 'Countries reached'],
              ['98%', 'On-time delivery'],
            ].map(([value, label]) => (
              <div key={label}>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{value}</div>
                <div className="text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Our Story (image on right) ---------------- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <div>
              <span className="inline-block text-sm font-semibold text-[#F41703] mb-3">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built to remove the risk from sourcing
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                IndoChinaBridge was founded to close the gap between Chinese
                manufacturing and global business needs. We saw the same problems
                again and again — language barriers, quality that's impossible to
                verify from abroad, and logistics that break down at the worst moment.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                So we built a process around them: people on the ground who can walk a
                factory floor, inspections before anything ships, and one point of
                contact who answers when something needs to change.
              </p>

              <ul className="space-y-3">
                {[
                  'Verified supplier network across major manufacturing hubs',
                  'Pre-shipment inspection on every order',
                  'Transparent pricing with no hidden margins',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-[#F41703] mt-0.5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src={STORY_IMAGE}
                alt="Warehouse and logistics operations"
                className="w-full h-[380px] md:h-[500px] object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Mission ---------------- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="inline-block text-sm font-semibold text-[#F41703] mb-3">
              Our Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sourcing you don't have to second-guess
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We want every client to get the product they specified, at the price
              they agreed, on the date they were promised.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Quality first',
                body: 'Every product is inspected and verified before shipment, so what you ordered is what arrives.',
                icon: (
                  <path d="M9 12l2 2 4-4M12 3l7 4v5c0 4.4-3 8.4-7 9.5-4-1.1-7-5.1-7-9.5V7l7-4z" />
                ),
              },
              {
                title: 'Trust & transparency',
                body: 'Honest communication and fair pricing, with the full cost breakdown shared up front.',
                icon: <path d="M12 3l8 4v6c0 4.5-3.4 8.6-8 9.5-4.6-.9-8-5-8-9.5V7l8-4z" />,
              },
              {
                title: 'Global reach',
                body: 'Efficient logistics connecting Chinese factories to warehouses and storefronts worldwide.',
                icon: (
                  <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z" />
                  </>
                ),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-8 rounded-xl border border-gray-200 hover:border-[#F41703]/40 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mb-5">
                  <svg
                    className="w-6 h-6 text-[#F41703]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {item.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Why Choose Us ---------------- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="inline-block text-sm font-semibold text-[#F41703] mb-3">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What working with us actually looks like
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              The advantages our clients tell us make the biggest difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {[
              ['Expert knowledge', 'A working understanding of Chinese manufacturing, supplier networks, and how pricing really moves.'],
              ['Quality assurance', 'Inspection and quality control built into every stage, not bolted on at the end.'],
              ['Cost efficiency', 'Direct supplier relationships and optimized supply chains keep your landed cost competitive.'],
              ['End-to-end service', 'One point of contact from your first spec sheet to the pallet arriving at your door.'],
              ['Risk management', 'We flag supplier and shipment risk early and handle it before it becomes your problem.'],
              ['24/7 support', 'Someone is reachable around the clock, across time zones, whenever a shipment needs attention.'],
            ].map(([title, body]) => (
              <div key={title} className="border-t-2 border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={CTA_IMAGE}
              alt="Cargo ship loaded with containers"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gray-900/75" />
            <div className="relative px-6 py-16 md:py-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to start your sourcing journey?
              </h2>
              <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">
                Tell us what you need made, and we'll come back with suppliers,
                samples, and a real landed cost.
              </p>
              <button className="bg-[#F41703] text-white px-8 py-3.5 rounded-lg font-medium hover:bg-[#d31402] transition-colors shadow-lg">
                Get a free consultation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About