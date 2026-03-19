import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/__tests__/utils/test-utils'
import { ClientFilters } from '@/components/admin/ClientFilters'

describe('ClientFilters', () => {
  it('renders name and email filter inputs', () => {
    renderWithProviders(
      <ClientFilters name="" onNameChange={jest.fn()} email="" onEmailChange={jest.fn()} />
    )
    expect(screen.getByPlaceholderText(/ime klijenta/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
  })

  it('calls onNameChange when name input changes', async () => {
    const onNameChange = jest.fn()
    renderWithProviders(
      <ClientFilters name="" onNameChange={onNameChange} email="" onEmailChange={jest.fn()} />
    )
    await userEvent.type(screen.getByPlaceholderText(/ime klijenta/i), 'P')
    expect(onNameChange).toHaveBeenCalledWith('P')
  })

  it('calls onEmailChange when email input changes', async () => {
    const onEmailChange = jest.fn()
    renderWithProviders(
      <ClientFilters name="" onNameChange={jest.fn()} email="" onEmailChange={onEmailChange} />
    )
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'p')
    expect(onEmailChange).toHaveBeenCalledWith('p')
  })
})
