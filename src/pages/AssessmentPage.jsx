import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "../styles/AssessmentPage.css";
import { FaChalkboardTeacher } from "react-icons/fa";

const AssessmentPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [assessment, setAssessment] = useState(null);
    const [instructor, setInstructor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [answers, setAnswers] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (!courseId) return;

            try {
                const response = await axios.get(
                    `${window.API_CONFIG.BASE_URL}/api/CourseModels/${courseId}`
                );
                setAssessment(response.data);

                // Fetch instructor details if instructorId exists
                const instructorId = response.data.instructorId || response.data.InstructorId;
                if (instructorId) {
                    try {
                        const instructorResponse = await axios.get(
                            `${window.API_CONFIG.BASE_URL}/api/UserModels/${instructorId}`
                        );
                        setInstructor(instructorResponse.data);
                    } catch (err) {
                        console.error("Error fetching instructor details:", err);
                    }
                }
            } catch (err) {
                console.error("Error fetching course details:", err);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    useEffect(() => {
        const fetchAssessmentDetails = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `${window.API_CONFIG.BASE_URL}/api/AssessmentModels`
                );

                // Find the specific assessment
                const assessmentData = response.data.find(
                    a => String(a.assessmentId || a.AssessmentId) === String(courseId)
                );

                if (!assessmentData) {
                    setError("Assessment not found");
                    setIsLoading(false);
                    return;
                }

                setAssessment(assessmentData);

                // Process questions
                try {
                    const questionsData = JSON.parse(assessmentData.questions || assessmentData.Questions);
                    setAnswers(Array(questionsData.length).fill(null));
                } catch (err) {
                    console.error("Error parsing questions:", err);
                    setError("Error loading assessment questions");
                }

                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching assessment:", err);
                setError("Failed to load assessment. Please try again later.");
                setIsLoading(false);
            }
        };

        if (courseId) {
            fetchAssessmentDetails();
        }
    }, [courseId]);

    const handleOptionChange = (qIdx, optionKey) => {
        if (!submitted) {
            const updated = [...answers];
            updated[qIdx] = optionKey;
            setAnswers(updated);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        // Calculate score
        let score = 0;
        const results = assessment.Questions.map((q, i) => {
            const isCorrect = answers[i] === q.answer;
            // Use the marks value from each question if available, or default to 1
            const questionMarks = q.marks || 1;
            if (isCorrect) score += questionMarks;
            return {
                question: q.question,
                userAnswer: answers[i],
                correctAnswer: q.answer,
                isCorrect,
                options: q.options,
                marks: questionMarks
            };
        });

        try {
            // Submit to backend
            await axios.post(`${window.API_CONFIG.BASE_URL}/api/ResultModels`, {
                StudentId: currentUser?.id || currentUser?.userId,
                AssessmentId: assessment.assessmentId || assessment.AssessmentId,
                CourseId: assessment.courseId || assessment.CourseId,
                Score: score,
                Date: new Date().toISOString()
            });

            // Calculate max possible score
            const maxPossibleScore = assessment.Questions.reduce((total, q) => total + (q.marks || 1), 0);

            // Navigate to results page with detailed data
            navigate(`/courses/${courseId}/results`, {
                state: {
                    score,
                    maxScore: maxPossibleScore, // Use calculated max score
                    assessmentTitle: assessment.Title,
                    courseId: assessment.CourseId,
                    questions: assessment.Questions,
                    userAnswers: answers,
                    detailedResults: results
                },
            });
        } catch (err) {
            console.error("Submission error:", err);
            setError("Failed to submit results. Please try again.");
            setSubmitted(false);
        }
    };

    if (isLoading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!assessment) return <div>No assessment available</div>;

    // Calculate total possible marks for display
    const totalPossibleMarks = assessment.Questions.reduce(
        (total, q) => total + (q.marks || 1),
        0
    );

    return (
        <div className="assessment-container">
            <div className="assessment-header">
                <button
                    className="back-button"
                    onClick={() => navigate(`/courses/${courseId}`)}
                >
                    &larr; Back to Course
                </button>
                <h1>{assessment.Title}</h1>
                <div className="assessment-info">
                    <p>{assessment.Questions.length} questions | Max score: {totalPossibleMarks}</p>
                    {instructor && (
                        <p className="instructor-info">
                            <FaChalkboardTeacher /> Instructor: {instructor.name || instructor.Name}
                        </p>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="assessment-form">
                {assessment.Questions.map((question, qIdx) => (
                    <div key={`q-${qIdx}`} className="question-card">
                        <div className="question-text">
                            <span>Q{qIdx + 1}:</span> {question.question}
                            {question.marks && question.marks > 1 && (
                                <span className="marks-badge">{question.marks} marks</span>
                            )}
                        </div>

                        <div className="options-container">
                            {Object.entries(question.options).map(([key, value]) => (
                                <label key={`o-${key}`} className="option-label">
                                    <input
                                        type="radio"
                                        name={`q${qIdx}`}
                                        checked={answers[qIdx] === key}
                                        onChange={() => handleOptionChange(qIdx, key)}
                                        disabled={submitted}
                                        required
                                    />
                                    <span className="option-key">{key.toUpperCase()}:</span>
                                    <span className="option-text">{value}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="submit-container">
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={submitted || answers.includes(null)}
                    >
                        {submitted ? "Submitting..." : "Submit Assessment"}
                    </button>

                    {answers.includes(null) && !submitted && (
                        <p className="warning-message">
                            Please answer all questions before submitting
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AssessmentPage;
export default AssessmentPage;