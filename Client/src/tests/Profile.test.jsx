// __tests__/Profile.test.js

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import Profile from '../components/pages/Profile';
import axios from 'axios';
import { useAuth } from '../components/context/auth';
import { jwtDecode } from 'jwt-decode';

// Mock axios
jest.mock('axios');
jest.mock('../components/context/auth');
jest.mock('jwt-decode');

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'http://example.com/fake.pdf');

describe('Profile Component', () => {
    const mockToken = 'mockToken';
    const mockDecodedToken = { id: '123' };
    const mockUserData = {
        name: 'John Doe',
        school: 'Some School',
        degrees: ['Bachelor'],
        resume: {
            data: {
                data: new Uint8Array([0, 1, 2, 3]), // Mock PDF data
            },
            contentType: 'application/pdf',
        },
    };

    beforeEach(() => {
        // Mock useAuth hook
        useAuth.mockReturnValue({ token: mockToken });

        // Mock jwtDecode
        jwtDecode.mockReturnValue(mockDecodedToken);

        // Mock axios GET request
        axios.get.mockResolvedValue({ data: mockUserData });
    });

    test('renders loading state', async () => {
        render(<Profile />);
        expect(screen.getByText(/Loading...../i)).toBeInTheDocument();
    });

});
