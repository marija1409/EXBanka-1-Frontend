import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/__tests__/utils/test-utils'
import { LoanFilters } from '@/components/loans/LoanFilters'

describe('LoanFilters', () => {
  const mockOnAccountNumberChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders account number filter input', () => {
    renderWithProviders(
      <LoanFilters accountNumber="" onAccountNumberChange={mockOnAccountNumberChange} />
    )
    expect(screen.getByPlaceholderText(/broj računa/i)).toBeInTheDocument()
  })

  it('shows current accountNumber value in input', () => {
    renderWithProviders(
      <LoanFilters
        accountNumber="111000100000000011"
        onAccountNumberChange={mockOnAccountNumberChange}
      />
    )
    expect(screen.getByDisplayValue('111000100000000011')).toBeInTheDocument()
  })

  it('calls onAccountNumberChange when input value changes', async () => {
    renderWithProviders(
      <LoanFilters accountNumber="" onAccountNumberChange={mockOnAccountNumberChange} />
    )
    const input = screen.getByPlaceholderText(/broj računa/i)
    await userEvent.type(input, 'ABC')
    expect(mockOnAccountNumberChange).toHaveBeenCalled()
  })
})
