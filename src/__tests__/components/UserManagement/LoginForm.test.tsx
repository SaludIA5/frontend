import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../test/test-utils'
import LoginForm from '../../../components/UserManagement/LoginForm'

describe('LoginForm', () => {
    it('renders login form fields', () => {
        renderWithProviders(<LoginForm />)

        expect(screen.getByText('Email')).toBeInTheDocument()
        expect(screen.getByText('Contraseña')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
    })

    it('has required form validation', () => {
        const { container } = renderWithProviders(<LoginForm />)

        const inputs = screen.getAllByRole('textbox')

        const emailInput = inputs.find(input => input.getAttribute('type') === 'email')
        expect(emailInput).toBeDefined()
        expect(emailInput).toHaveAttribute('type', 'email')
        expect(emailInput).toHaveAttribute('required')

        const allInputs = container.querySelectorAll('input')
        const passwordInput = Array.from(allInputs).find(input => input.getAttribute('type') === 'password')
        expect(passwordInput).toBeDefined()
        expect(passwordInput).toHaveAttribute('type', 'password')
        expect(passwordInput).toHaveAttribute('required')
        expect(passwordInput).toHaveAttribute('minLength', '8')
    })

    it('shows submit button with correct text', () => {
        renderWithProviders(<LoginForm />)

        const submitButton = screen.getByRole('button', { name: 'Iniciar sesión' })
        expect(submitButton).toBeInTheDocument()
        expect(submitButton).toHaveAttribute('type', 'submit')
    })
})
