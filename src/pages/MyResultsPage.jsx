import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/MyResultsPage.css';
import { FaTrophy, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

const MyResultsPage = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalAssessments: 0,
        averageScore: 0,
        passedCount: 0,
        highestScore: 0
    });
    const [assessments, setAssessments] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all assessments to get their details
                const assessmentsResponse = await axios.get(`${window.API_CONFIG.BASE_URL}/api/AssessmentModels`);
                const assessmentsData = assessmentsResponse.data;

                // Create a map of assessment IDs to their data
                const assessmentsMap = {};
                assessmentsData.forEach(assessment => {
                    const id = assessment.assessmentId || assessment.AssessmentId;
                    assessmentsMap[id] = assessment;
                });
                setAssessments(assessmentsMap);

                // Fetch the user's results
                const resultsResponse = await axios.get(`${window.API_CONFIG.BASE_URL}/api/ResultModels`);
                const userResults = resultsResponse.data.filter(result => {
                    const studentId = result.studentId || result.StudentId;
                    return String(studentId) === String(currentUser.userId);
                });

                setResults(userResults);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching results:", error);
                setError("Failed to load your results. Please try again later.");
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchData();
        }
    }, [currentUser]);

    useEffect(() => {
        if (results.length > 0) {
            let totalScorePercentage = 0;
            let passed = 0;
            let highest = 0;

            results.forEach(result => {
                const score = result.score || result.Score || 0;
                const maxScore = result.maxScore || result.MaxScore || 1;
                const percentage = (score / maxScore) * 100;

                totalScorePercentage += percentage;
                if (percentage >= 70) passed++;
                if (percentage > highest) highest = percentage;
            });

            setStats({
                totalAssessments: results.length,
                averageScore: Math.round(totalScorePercentage / results.length),
                passedCount: passed,
                highestScore: Math.round(highest)
            });
        }
    }, [results]);

    const handleRowClick = (resultId) => {
        navigate(`/results/${resultId}`);
    };

    if (loading) {
        return (
            <div className="results-loading">
                <div className="spinner"></div>
                <p>Loading your results...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="results-error">
                <h2>Error Loading Results</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="results-page">
            <div className="results-header">
                <div className="container">
                    <h1>My Assessment Results</h1>
                    <p className="results-subtitle">
                        View and track your performance across all assessments
                    </p>
                </div>
            </div>

            <div className="container">
                {results.length > 0 ? (
                    <>
                        <div className="results-stats">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <FaChartLine />
                                </div>
                                <div className="stat-content">
                                    <h3>Total Assessments</h3>
                                    <div className="stat-value">{stats.totalAssessments}</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <FaTrophy />
                                </div>
                                <div className="stat-content">
                                    <h3>Average Score</h3>
                                    <div className="stat-value">{stats.averageScore}%</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <FaChartLine />
                                </div>
                                <div className="stat-content">
                                    <h3>Assessments Passed</h3>
                                    <div className="stat-value">{stats.passedCount} of {stats.totalAssessments}</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <FaTrophy />
                                </div>
                                <div className="stat-content">
                                    <h3>Highest Score</h3>
                                    <div className="stat-value">{stats.highestScore}%</div>
                                </div>
                            </div>
                        </div>

                        <div className="results-table-container">
                            <h2>Assessment History</h2>
                            <div className="table-wrapper">
                                <table className="results-table">
                                    <thead>
                                        <tr>
                                            <th>Assessment</th>
                                            <th>Date Completed</th>
                                            <th>Score</th>
                                            <th>Percentage</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((result) => {
                                            const score = result.score || result.Score || 0;
                                            const maxScore = result.maxScore || result.MaxScore || 1;

                                            // Calculate percentage
                                            const percentage = Math.round((score / maxScore) * 100);

                                            // Format date
                                            const attemptDate = new Date(
                                                result.attemptDate || result.AttemptDate
                                            ).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            });

                                            return (
                                                <tr
                                                    key={result.resultId || result.ResultId}
                                                    className="result-row"
                                                    onClick={() => handleRowClick(result.resultId || result.ResultId)}
                                                >
                                                    <td className="assessment-name">{assessments[result.assessmentId || result.AssessmentId]?.title || "Unknown Assessment"}</td>
                                                    <td>
                                                        <div className="date-cell">
                                                            <FaCalendarAlt className="date-icon" />
                                                            <span>{attemptDate}</span>
                                                        </div>
                                                    </td>
                                                    <td className="score-cell">
                                                        {score} / {maxScore}
                                                    </td>
                                                    <td>
                                                        <div className={`percentage-bar ${percentage >= 70 ? 'pass' : 'fail'}`}>
                                                            <div
                                                                className="percentage-fill"
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                            <span className="percentage-text">{percentage}%</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${percentage >= 70 ? 'pass' : 'fail'}`}>
                                                            {percentage >= 70 ? 'Passed' : 'Failed'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="no-results">
                        <div className="no-results-content">
                            <h2>No Assessments Completed</h2>
                            <p>You haven't completed any assessments yet.</p>
                            <button
                                onClick={() => navigate('/courses')}
                                className="browse-courses-btn"
                            >
                                Browse Courses
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyResultsPage;