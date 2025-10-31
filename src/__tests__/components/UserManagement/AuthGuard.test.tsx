import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../test/test-utils'
import AuthGuard from '../../../components/UserManagement/AuthGuard'

vi.mock('../../../components/UserManagement/LoginModal', () => ({
    default: () => <div data-testid="login-modal">Login Modal</div>
}))

describe('AuthGuard', () => {
    it('renders children when user is authenticated', () => {
        localStorage.setItem('auth_token', 'mock-token')

        renderWithProviders(
            <AuthGuard>
                <div data-testid="protected-content">Protected Content</div>
            </AuthGuard>
        )

        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
        expect(screen.queryByTestId('login-modal')).not.toBeInTheDocument()
    })

    it('renders login modal when user is not authenticated', () => {
        localStorage.removeItem('auth_token')

        renderWithProviders(
            <AuthGuard>
                <div data-testid="protected-content">Protected Content</div>
            </AuthGuard>
        )

        expect(screen.getByTestId('login-modal')).toBeInTheDocument()
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
})
