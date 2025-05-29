import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import SlimSidebar from './LeftMenu'
import TopNavigation from './TopNavigation'
import PageTitle from '../../elements/PageTitle'
import { Moon, Sun } from 'lucide-react'

const AdminLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false

    const savedMode = localStorage.getItem('darkMode')
    if (savedMode !== null) {
      return savedMode === 'true'
    }

    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: any) => {
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches)
      }
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-surface transition-colors duration-300">
      <PageTitle />
      <SlimSidebar />

      <div className="flex-1 flex flex-col">
        <TopNavigation toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        <main className="w-full mt-[70px] overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-charcoal-900 p-12 transition-colors duration-300">
          <button
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-dark-elevated shadow-soft-lg dark:shadow-dark-lg border border-neutral-200 dark:border-charcoal-800 transition-all duration-300 hover:scale-110"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun size={20} className="text-amber-500" />
            ) : (
              <Moon size={20} className="text-secondary-700" />
            )}
          </button>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout