import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../components/auth/Login';
import { AuthProvider } from '../components/context/auth';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),  // Mock useNavigate
}));

describe('Login Component', () => {
  it('renders the login form', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create an account/i })).toBeInTheDocument();
  });

  it('shows an error message on failed login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      })
    );

    render(
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => screen.getByText('Invalid credentials'));

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('redirects to the jobs page on successful login', async () => {
    const mockNavigate = jest.fn();  // Create a mock function
    useNavigate.mockReturnValue(mockNavigate);  // Return the mock function when useNavigate is called

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            token: 'fake-jwt-token',
            role: 'applicant',
          }),
      })
    );

    render(
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/jobList'));
  });
});
