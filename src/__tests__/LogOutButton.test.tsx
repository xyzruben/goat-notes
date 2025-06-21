import React from 'react'
import { render, screen } from '@testing-library/react'
import LogOutButton from '@/components/ui/LogOutButton'

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn()
    })
}))

describe('LogOutButton', () => {
    it('renders a logout Button', () => {
        render(<LogOutButton />)
        const button = screen.getByRole('button', {name: /log out/i })
        expect(button).toBeInTheDocument()
    })
})

