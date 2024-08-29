import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import JobListpage from "../components/jobList/JobList";
import { useJobs } from "../components/hooks/useGetJobs";
import { AuthProvider } from '../components/context/auth';
import { BrowserRouter as Router } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Mock the useJobs hook
jest.mock("../components/hooks/useGetJobs");

// Inline mock for image imports
jest.mock('../assets/noimage.jpg', () => 'test-file-stub');

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("JobListpage Component", () => {
    const mockJobsData = [
        { _id: "1", title: "Frontend Developer", category: "Tech", location: "New York", postDate: "2024-08-01", salary: "$100,000" },
        { _id: "2", title: "Backend Developer", category: "Tech", location: "San Francisco", postDate: "2024-08-02", salary: "$120,000" },
    ];

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("renders JobListpage when token and role are present in context", () => {
        // Mock useJobs hook to return job data
        useJobs.mockReturnValue({
            data: mockJobsData,
            isLoading: false,
            isError: false,
        });

        // Mock AuthContext to provide token and role
        const mockContextValue = {
            authState: { token: "mockToken", role: "applicant" },
        };

        render(
            <Router>
                <AuthProvider value={mockContextValue}>
                    <JobListpage />
                </AuthProvider>
            </Router>
        );

        // Check if job titles are rendered
        expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
        expect(screen.getByText(/Backend Developer/i)).toBeInTheDocument();

        // Check if job categories are rendered
        expect(screen.getAllByText(/Category: Tech/i)).toHaveLength(2);

        // Check if job locations are rendered
        expect(screen.getByText(/Location: New York/i)).toBeInTheDocument();
        expect(screen.getByText(/Location: San Francisco/i)).toBeInTheDocument();

        // Check if job post dates are rendered
        expect(screen.getByText(/Date: 2024-08-01/i)).toBeInTheDocument();
        expect(screen.getByText(/Date: 2024-08-02/i)).toBeInTheDocument();

        // Check if job salaries are rendered
        expect(screen.getByText(/Salary: \$100,000/i)).toBeInTheDocument();
        expect(screen.getByText(/Salary: \$120,000/i)).toBeInTheDocument();
    });

    it("navigates to job details page on clicking a job card", () => {
        // Mock useJobs hook to return job data
        useJobs.mockReturnValue({
            data: mockJobsData,
            isLoading: false,
            isError: false,
        });

        // Mock AuthContext to provide token and role
        const mockContextValue = {
            authState: { token: "mockToken", role: "applicant" },
        };

        render(
            <Router>
                <AuthProvider value={mockContextValue}>
                    <JobListpage />
                </AuthProvider>
            </Router>
        );

        // Simulate clicking the first job card
        fireEvent.click(screen.getByText(/Frontend Developer/i));

        // Expect navigation to the job details page
        expect(mockNavigate).toHaveBeenCalledWith("/jobdetailsapp/1", { state: mockJobsData[0] });
    });
});
