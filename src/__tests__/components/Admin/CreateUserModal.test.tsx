import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'

const { mockApiPost } = vi.hoisted(() => {
    const mockApiPost = vi.fn().mockResolvedValue({ data: {} })
    return { mockApiPost }
})

vi.mock("axios", () => {
    return {
        default: {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            create: vi.fn(() => ({
                get: vi.fn().mockResolvedValue({ data: [] }),
                post: mockApiPost,
                put: vi.fn().mockResolvedValue({ data: {} }),
                delete: vi.fn().mockResolvedValue({ data: {} }),
            })),
            defaults: {
                headers: {
                    common: {}
                }
            }
        }
    };
});

vi.mock('../../../utils/rutValidation', () => ({
    validateRUT: (rut: string) => {
        if (!rut) return true
        const cleanRut = rut.replace(/[.-]/g, '')
        return cleanRut.length >= 8 && cleanRut.length <= 9
    }
}))

import { renderWithProviders } from '../../../test/test-utils'
import CreateUserModal from '../../../components/Admin/CreateUserModal'

describe('CreateUserModal - Happy Path', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockApiPost.mockResolvedValue({ data: {} })
    })

    it('renders all form fields', () => {
        const handleClose = vi.fn()
        const { container } = renderWithProviders(<CreateUserModal handleClose={handleClose} />)

        expect(screen.getByRole('heading', { name: 'Crear Usuario' })).toBeInTheDocument()
        expect(container.querySelector('input[type="text"]')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('12.345.678-9')).toBeInTheDocument()
        expect(container.querySelector('input[type="email"]')).toBeInTheDocument()
        expect(container.querySelectorAll('input[type="password"]')).toHaveLength(2)
        expect(container.querySelector('select')).toBeInTheDocument()
        expect(screen.getByText('Rol')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Crear Usuario' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
    })

    it('successfully creates user with all fields filled', async () => {
        const handleClose = vi.fn()
        const onSuccess = vi.fn()
        mockApiPost.mockResolvedValueOnce({ data: {} })

        const { container } = renderWithProviders(<CreateUserModal handleClose={handleClose} onSuccess={onSuccess} />)

        const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
        const rutInput = screen.getByPlaceholderText('12.345.678-9') as HTMLInputElement
        const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement
        const passwordInputs = container.querySelectorAll('input[type="password"]') as NodeListOf<HTMLInputElement>
        const turnSelect = container.querySelector('select') as HTMLSelectElement

        fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } })
        fireEvent.change(rutInput, { target: { value: '12345678-9' } })
        fireEvent.change(emailInput, { target: { value: 'juan@example.com' } })
        fireEvent.change(passwordInputs[0], { target: { value: 'password123' } })
        fireEvent.change(passwordInputs[1], { target: { value: 'password123' } })
        fireEvent.change(turnSelect, { target: { value: 'A' } })

        const submitButton = screen.getByRole('button', { name: 'Crear Usuario' })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockApiPost).toHaveBeenCalledWith('/users', {
                name: 'Juan Pérez',
                rut: '123456789',
                email: 'juan@example.com',
                password: 'password123',
                turn: 'A',
                is_doctor: false,
                is_chief_doctor: false
            })
        })

        await waitFor(() => {
            expect(handleClose).toHaveBeenCalled()
            expect(onSuccess).toHaveBeenCalled()
        })
    })

    it('formats RUT correctly on input', () => {
        const handleClose = vi.fn()
        renderWithProviders(<CreateUserModal handleClose={handleClose} />)

        const rutInput = screen.getByPlaceholderText('12.345.678-9') as HTMLInputElement
        fireEvent.change(rutInput, { target: { value: '123456789' } })

        expect(rutInput).toHaveValue('12.345.678-9')
    })

    it('converts formatted RUT to numeric before submission', async () => {
        const handleClose = vi.fn()
        mockApiPost.mockResolvedValueOnce({ data: {} })

        const { container } = renderWithProviders(<CreateUserModal handleClose={handleClose} />)

        const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
        const rutInput = screen.getByPlaceholderText('12.345.678-9') as HTMLInputElement
        const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement
        const passwordInputs = container.querySelectorAll('input[type="password"]') as NodeListOf<HTMLInputElement>
        const turnSelect = container.querySelector('select') as HTMLSelectElement

        fireEvent.change(nameInput, { target: { value: 'Test User' } })
        fireEvent.change(rutInput, { target: { value: '12.345.678-9' } })
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInputs[0], { target: { value: 'password123' } })
        fireEvent.change(passwordInputs[1], { target: { value: 'password123' } })
        fireEvent.change(turnSelect, { target: { value: 'B' } })

        const submitButton = screen.getByRole('button', { name: 'Crear Usuario' })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockApiPost).toHaveBeenCalledWith(
                '/users',
                expect.objectContaining({
                    rut: '123456789'
                })
            )
        })
    })

    it('creates user with isDoctor role', async () => {
        const handleClose = vi.fn()
        mockApiPost.mockResolvedValueOnce({ data: {} })

        const { container } = renderWithProviders(<CreateUserModal handleClose={handleClose} />)

        const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
        const rutInput = screen.getByPlaceholderText('12.345.678-9') as HTMLInputElement
        const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement
        const passwordInputs = container.querySelectorAll('input[type="password"]') as NodeListOf<HTMLInputElement>
        const turnSelect = container.querySelector('select') as HTMLSelectElement
        const medicoCheckbox = screen.getByRole('checkbox', { name: /Médico$/ })

        fireEvent.change(nameInput, { target: { value: 'Test User' } })
        fireEvent.change(rutInput, { target: { value: '12345678-9' } })
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInputs[0], { target: { value: 'password123' } })
        fireEvent.change(passwordInputs[1], { target: { value: 'password123' } })
        fireEvent.change(turnSelect, { target: { value: 'C' } })
        fireEvent.click(medicoCheckbox)

        const submitButton = screen.getByRole('button', { name: 'Crear Usuario' })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockApiPost).toHaveBeenCalledWith(
                '/users',
                expect.objectContaining({
                    is_doctor: true,
                    is_chief_doctor: false
                })
            )
        })
    })

    it('creates user with isChiefDoctor role', async () => {
        const handleClose = vi.fn()
        mockApiPost.mockResolvedValueOnce({ data: {} })

        const { container } = renderWithProviders(<CreateUserModal handleClose={handleClose} />)

        const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
        const rutInput = screen.getByPlaceholderText('12.345.678-9') as HTMLInputElement
        const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement
        const passwordInputs = container.querySelectorAll('input[type="password"]') as NodeListOf<HTMLInputElement>
        const turnSelect = container.querySelector('select') as HTMLSelectElement
        const chiefDoctorCheckbox = screen.getByRole('checkbox', { name: /Médico Jefe/ })

        fireEvent.change(nameInput, { target: { value: 'Test User' } })
        fireEvent.change(rutInput, { target: { value: '12345678-9' } })
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInputs[0], { target: { value: 'password123' } })
        fireEvent.change(passwordInputs[1], { target: { value: 'password123' } })
        fireEvent.change(turnSelect, { target: { value: 'A' } })
        fireEvent.click(chiefDoctorCheckbox)

        const submitButton = screen.getByRole('button', { name: 'Crear Usuario' })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockApiPost).toHaveBeenCalledWith(
                '/users',
                expect.objectContaining({
                    is_doctor: false,
                    is_chief_doctor: true
                })
            )
        })
    })

    it('unchecks Médico when Médico Jefe is selected', () => {
        const handleClose = vi.fn()
        renderWithProviders(<CreateUserModal handleClose={handleClose} />)

        const medicoCheckbox = screen.getByRole('checkbox', { name: /Médico$/ })
        const chiefDoctorCheckbox = screen.getByRole('checkbox', { name: /Médico Jefe/ })

        fireEvent.click(medicoCheckbox)
        expect(medicoCheckbox).toBeChecked()

        fireEvent.click(chiefDoctorCheckbox)
        expect(chiefDoctorCheckbox).toBeChecked()
        expect(medicoCheckbox).not.toBeChecked()
    })

    it('unchecks Médico Jefe when Médico is selected', () => {
        const handleClose = vi.fn()
        renderWithProviders(<CreateUserModal handleClose={handleClose} />)

        const medicoCheckbox = screen.getByRole('checkbox', { name: /Médico$/ })
        const chiefDoctorCheckbox = screen.getByRole('checkbox', { name: /Médico Jefe/ })

        fireEvent.click(chiefDoctorCheckbox)
        expect(chiefDoctorCheckbox).toBeChecked()

        fireEvent.click(medicoCheckbox)
        expect(medicoCheckbox).toBeChecked()
        expect(chiefDoctorCheckbox).not.toBeChecked()
    })
})

