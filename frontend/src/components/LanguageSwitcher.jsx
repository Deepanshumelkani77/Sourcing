import React from 'react'
import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          i18n.language === 'en'
            ? 'bg-[#F41703] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('zh')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          i18n.language === 'zh'
            ? 'bg-[#F41703] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        中文
      </button>
    </div>
  )
}

export default LanguageSwitcher
