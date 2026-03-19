import { Input } from '@/components/ui/input'

interface ClientFiltersProps {
  name: string
  onNameChange: (value: string) => void
  email: string
  onEmailChange: (value: string) => void
}

export function ClientFilters({ name, onNameChange, email, onEmailChange }: ClientFiltersProps) {
  return (
    <div className="flex gap-3">
      <Input
        placeholder="Ime klijenta..."
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <Input placeholder="Email..." value={email} onChange={(e) => onEmailChange(e.target.value)} />
    </div>
  )
}
