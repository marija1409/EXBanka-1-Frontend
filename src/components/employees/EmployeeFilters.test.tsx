import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/__tests__/utils/test-utils'
import { EmployeeFilters } from '@/components/employees/EmployeeFilters'

const mockOnFilter = jest.fn()

beforeEach(() => jest.clearAllMocks())

describe('EmployeeFilters', () => {
  it('renders a single search input', () => {
    renderWithProviders(<EmployeeFilters onFilter={mockOnFilter} />)
    expect(screen.getByPlaceholderText(/search by name, email or position/i)).toBeInTheDocument()
  })

  it('calls onFilter with email when input contains @', async () => {
    renderWithProviders(<EmployeeFilters onFilter={mockOnFilter} />)
    await userEvent.type(
      screen.getByPlaceholderText(/search by name, email or position/i),
      'jane@example.com'
    )
    await userEvent.click(screen.getByRole('button', { name: /search/i }))
    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'jane@example.com' })
      )
    })
  })

  it('calls onFilter with name when input has no @', async () => {
    renderWithProviders(<EmployeeFilters onFilter={mockOnFilter} />)
    await userEvent.type(screen.getByPlaceholderText(/search by name, email or position/i), 'Jane')
    await userEvent.click(screen.getByRole('button', { name: /search/i }))
    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith(expect.objectContaining({ name: 'Jane' }))
    })
  })

  it('calls onFilter with empty object when input is cleared', async () => {
    renderWithProviders(<EmployeeFilters onFilter={mockOnFilter} />)
    await userEvent.click(screen.getByRole('button', { name: /search/i }))
    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith({})
    })
  })
})
