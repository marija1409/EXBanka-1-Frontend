import { act } from 'react'
import { renderHook } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'

// Note: `.dark` on <html> activates the CSS variable block in index.css (lines 45-79).
// The Tailwind `@custom-variant dark (&:is(.dark *))` targets *children* of .dark — both are correct and intentional.

function wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

describe('useTheme', () => {
  it('defaults to light when localStorage has no value', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.isDark).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('initialises to dark when localStorage contains "dark"', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.isDark).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggleTheme from light adds .dark class and writes "dark" to localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    act(() => {
      result.current.toggleTheme()
    })
    expect(result.current.isDark).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('toggleTheme from dark removes .dark class and writes "light" to localStorage', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() => useTheme(), { wrapper })
    act(() => {
      result.current.toggleTheme()
    })
    expect(result.current.isDark).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('round-trip: toggleTheme twice from light returns to light', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    act(() => {
      result.current.toggleTheme()
    })
    act(() => {
      result.current.toggleTheme()
    })
    expect(result.current.isDark).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
