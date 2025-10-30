import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { useAuth } from '../../context/AuthContextBase'

function TestComponent() {
    useAuth()
    return <div>Test</div>
}

describe('useAuth hook', () => {
    it('throws error when used outside of AuthProvider', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

        expect(() => {
            render(<TestComponent />)
        }).toThrow('useAuth must be used within AuthProvider')

        consoleSpy.mockRestore()
    })
})
