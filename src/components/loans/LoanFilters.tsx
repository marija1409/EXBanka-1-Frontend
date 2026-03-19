import { Input } from '@/components/ui/input'

interface LoanFiltersProps {
  accountNumber: string
  onAccountNumberChange: (value: string) => void
}

export function LoanFilters({ accountNumber, onAccountNumberChange }: LoanFiltersProps) {
  return (
    <Input
      placeholder="Broj računa..."
      value={accountNumber}
      onChange={(e) => onAccountNumberChange(e.target.value)}
      className="max-w-sm"
    />
  )
}
