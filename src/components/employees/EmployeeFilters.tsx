import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { EmployeeFilters as Filters } from '@/types/employee'

interface EmployeeFiltersProps {
  onFilter: (filters: Filters) => void
}

export function EmployeeFilters({ onFilter }: EmployeeFiltersProps) {
  const [search, setSearch] = useState('')

  const handleSearch = () => {
    const trimmed = search.trim()
    if (!trimmed) {
      onFilter({})
      return
    }
    if (trimmed.includes('@')) {
      onFilter({ email: trimmed })
    } else {
      onFilter({ name: trimmed })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Search by name, email or position..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className="max-w-sm"
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  )
}
