import { configureStore } from '@reduxjs/toolkit'
import {
  selectIsAuthenticated,
  selectIsAdmin,
  selectHasPermission,
} from '@/store/selectors/authSelectors'
import { createMockAuthState } from '@/__tests__/fixtures/auth-fixtures'
import authReducer from '@/store/slices/authSlice'

// Create a local store type for testing (until @/store is ready)
type TestState = ReturnType<
  ReturnType<typeof configureStore<{ auth: ReturnType<typeof authReducer> }>>['getState']
>

function mockRootState(authOverrides = {}): TestState {
  return { auth: createMockAuthState(authOverrides) } as TestState
}

describe('authSelectors', () => {
  it('selectIsAuthenticated returns true when authenticated', () => {
    expect(selectIsAuthenticated(mockRootState())).toBe(true)
  })

  it('selectIsAuthenticated returns false when idle', () => {
    expect(selectIsAuthenticated(mockRootState({ status: 'idle' }))).toBe(false)
  })

  it('selectIsAdmin returns true for EmployeeAdmin role', () => {
    expect(selectIsAdmin(mockRootState())).toBe(true)
  })

  it('selectIsAdmin returns false for other roles', () => {
    const state = mockRootState({
      user: { id: 1, email: 'a@b.com', role: 'EmployeeBasic', permissions: [] },
    })
    expect(selectIsAdmin(state)).toBe(false)
  })

  it('selectHasPermission checks for a specific permission', () => {
    const state = mockRootState()
    expect(selectHasPermission(state, 'employees.read')).toBe(true)
    expect(selectHasPermission(state, 'nonexistent')).toBe(false)
  })
})
