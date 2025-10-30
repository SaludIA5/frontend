import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { useAuth } from '../../context/AuthContextBase'

vi.mock('axios')

function TestComponent() {
    const { isAuthenticated, user, token } = useAuth()
    return (
        <div>
            <div data-testid="is-authenticated">{isAuthenticated.toString()}</div>
            <div data-testid="user-email">{user?.email || 'null'}</div>
            <div data-testid="token">{token || 'null'}</div>
        </div>
    )
}

describe('AuthProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
        vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:3000')
    })

    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </BrowserRouter>
        )

        expect(screen.getByTestId('is-authenticated')).toBeInTheDocument()
    })

    it('shows unauthenticated state when no token', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </BrowserRouter>
        )

        await waitFor(() => {
            expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
            expect(screen.getByTestId('user-email')).toHaveTextContent('null')
            expect(screen.getByTestId('token')).toHaveTextContent('null')
        })
    })

    it('shows authenticated state when token exists', async () => {
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpc19kb2N0b3IiOnRydWUsImlzX2NoaWVmX2RvY3RvciI6ZmFsc2V9.signature'

        localStorage.setItem('auth_token', mockToken)

        render(
            <BrowserRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </BrowserRouter>
        )

        await waitFor(() => {
            expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true')
            expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
            expect(screen.getByTestId('token')).toHaveTextContent(mockToken)
        })
    })
})
