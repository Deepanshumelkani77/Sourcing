import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  const stats = [
    ['500+', 'about.stats.clients'],
    ['1000+', 'about.stats.products'],
    ['50+', 'about.stats.countries'],
    ['98%', 'about.stats.delivery'],
  ]

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
            <span>{t('nav.home')}</span>
            <ChevronDivider />
            <span className="text-white font-medium">{t('nav.about')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white max-w-xl leading-tight">
            {t('about.hero.title')}
          </h1>
          <p className="text-white/85 text-base sm:text-lg mt-4 max-w-xl leading-relaxed">
            {t('about.hero.subtitle')}
          </p>
        </div>
      </div>

      {/* ---------------- Stats bar ---------------- */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map(([value, labelKey]) => (
              <div key={labelKey}>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{value}</div>
                <div className="text-gray-600">{t(labelKey)}</div>
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
                {t('about.story.label')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('about.story.title')}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {t('about.story.paragraph1')}
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                {t('about.story.paragraph2')}
              </p>

              <ul className="space-y-3">
                {[
                  'about.story.point1',
                  'about.story.point2',
                  'about.story.point3',
                ].map((pointKey) => (
                  <li key={pointKey} className="flex items-start gap-3">
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
                    <span className="text-gray-700">{t(pointKey)}</span>
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
              {t('about.mission.label')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.mission.title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('about.mission.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                titleKey: 'about.mission.qualityFirst.title',
                bodyKey: 'about.mission.qualityFirst.body',
                icon: (
                  <path d="M9 12l2 2 4-4M12 3l7 4v5c0 4.4-3 8.4-7 9.5-4-1.1-7-5.1-7-9.5V7l7-4z" />
                ),
              },
              {
                titleKey: 'about.mission.trustTransparency.title',
                bodyKey: 'about.mission.trustTransparency.body',
                icon: <path d="M12 3l8 4v6c0 4.5-3.4 8.6-8 9.5-4.6-.9-8-5-8-9.5V7l8-4z" />,
              },
              {
                titleKey: 'about.mission.globalReach.title',
                bodyKey: 'about.mission.globalReach.body',
                icon: (
                  <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z" />
                  </>
                ),
              },
            ].map((item) => (
              <div
                key={item.titleKey}
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
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{t(item.titleKey)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(item.bodyKey)}</p>
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
              {t('about.whyChooseUs.label')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.whyChooseUs.title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('about.whyChooseUs.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {[
              ['about.whyChooseUs.expertKnowledge.title', 'about.whyChooseUs.expertKnowledge.body'],
              ['about.whyChooseUs.qualityAssurance.title', 'about.whyChooseUs.qualityAssurance.body'],
              ['about.whyChooseUs.costEfficiency.title', 'about.whyChooseUs.costEfficiency.body'],
              ['about.whyChooseUs.endToEndService.title', 'about.whyChooseUs.endToEndService.body'],
              ['about.whyChooseUs.riskManagement.title', 'about.whyChooseUs.riskManagement.body'],
              ['about.whyChooseUs.support.title', 'about.whyChooseUs.support.body'],
            ].map(([titleKey, bodyKey]) => (
              <div key={titleKey} className="border-t-2 border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(titleKey)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(bodyKey)}</p>
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
                {t('about.cta.title')}
              </h2>
              <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">
                {t('about.cta.subtitle')}
              </p>
              <Link to="/contact" className="bg-[#F41703] text-white px-8 py-3.5 rounded-lg font-medium hover:bg-[#d31402] transition-colors shadow-lg inline-block">
                {t('about.cta.button')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About