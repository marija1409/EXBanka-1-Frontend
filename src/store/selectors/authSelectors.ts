import { createSelector } from '@reduxjs/toolkit'

// We use a local type here that will be compatible with RootState once the store is created
interface StateWithAuth {
  auth: {
    user: { role: string; permissions: string[] } | null
    status: 'idle' | 'loading' | 'authenticated' | 'error'
    error: string | null
    accessToken: string | null
    refreshToken: string | null
  }
}

export const selectAuthState = (state: StateWithAuth) => state.auth

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (auth) => auth.status === 'authenticated'
)

export const selectIsAdmin = createSelector(
  selectAuthState,
  (auth) => auth.user?.role === 'EmployeeAdmin'
)

export const selectHasPermission = (state: StateWithAuth, permission: string): boolean => {
  const permissions = state.auth.user?.permissions ?? []
  return permissions.includes(permission)
}

export const selectCurrentUser = createSelector(selectAuthState, (auth) => auth.user)
