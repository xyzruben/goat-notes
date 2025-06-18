import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AuthForm from '@/components/ui/AuthForm'
import { loginAction } from '@/actions/users'

jest.mock('@/actions/users', () => ({
  loginAction: jest.fn(() => Promise.resolve({ errorMessage: null })),
  signUpAction: jest.fn(() => Promise.resolve({ errorMessage: null }))
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}))

describe('AuthForm', () => {
  it('renders login form and submits credentials', async () => {
    render(<AuthForm type="login" />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(loginAction).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })
})
