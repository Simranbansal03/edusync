// src/pages/CourseDetailPage.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/CourseDetailPage.css";

// Mock data - would come from your API in a real implementation
const MOCK_COURSES = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description:
      "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
    longDescription: `This comprehensive course will teach you everything you need to know to get started with web development. You'll learn how to create and style web pages with HTML and CSS, add interactivity with JavaScript, and build your first responsive website.

The course is designed for beginners with no prior coding experience, and includes hands-on projects that will help you apply what you've learned in real-world scenarios.`,
    category: "Development",
    instructor: "John Doe",
    instructorTitle: "Senior Web Developer",
    instructorBio:
      "John is a web development expert with over 10 years of experience working with major tech companies.",
    rating: 4.8,
    reviews: 243,
    students: 15420,
    lessons: 12,
    level: "Beginner",
    duration: "6 weeks",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",
    topics: [
      "HTML5 fundamentals",
      "CSS3 styling and layouts",
      "JavaScript basics",
      "DOM manipulation",
      "Responsive design principles",
      "Bootstrap framework",
      "Basic UX/UI concepts",
      "Website deployment",
    ],
    curriculum: [
      {
        title: "Getting Started",
        lessons: [
          { title: "Course Introduction", duration: "10:23" },
          {
            title: "Setting Up Your Development Environment",
            duration: "15:47",
          },
          { title: "Understanding Web Technologies", duration: "12:36" },
        ],
      },
      {
        title: "HTML Basics",
        lessons: [
          { title: "HTML Document Structure", duration: "14:55" },
          { title: "Working with Text and Links", duration: "18:22" },
          { title: "Images and Media", duration: "16:41" },
        ],
      },
      {
        title: "CSS Styling",
        lessons: [
          { title: "CSS Selectors and Properties", duration: "20:11" },
          { title: "Box Model and Layouts", duration: "22:39" },
          { title: "Flexbox and Grid Systems", duration: "25:15" },
        ],
      },
      {
        title: "JavaScript Fundamentals",
        lessons: [
          { title: "Variables and Data Types", duration: "17:28" },
          { title: "Functions and Control Flow", duration: "19:57" },
          { title: "DOM Manipulation and Events", duration: "23:34" },
        ],
      },
    ],
  },
  // More courses would be defined here for a real application
];

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    // Simulate API call with delay
    const fetchCourse = async () => {
      setLoading(true);
      try {
        // In a real app, this would be fetched from your API
        await new Promise((resolve) => setTimeout(resolve, 800));
        const foundCourse = MOCK_COURSES.find((c) => c.id === parseInt(id, 10));
        setCourse(foundCourse);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className="course-detail-loading container">
        <div className="spinner"></div>
        <p>Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-not-found container">
        <h2>Course Not Found</h2>
        <p>The requested course could not be found.</p>
        <Link to="/courses" className="btn">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <div className="course-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/courses">Courses</Link> / <span>{course.category}</span>{" "}
            / <span>{course.title}</span>
          </div>

          <div className="course-header-content">
            <div className="course-info">
              <h1>{course.title}</h1>
              <p className="course-description">{course.description}</p>

              <div className="course-meta">
                <div className="meta-item">
                  <span className="meta-label">Instructor:</span>
                  <span className="meta-value">{course.instructor}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Rating:</span>
                  <span className="meta-value">
                    ⭐ {course.rating} ({course.reviews} reviews)
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Students:</span>
                  <span className="meta-value">
                    {course.students.toLocaleString()}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Level:</span>
                  <span className="meta-value">{course.level}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Duration:</span>
                  <span className="meta-value">{course.duration}</span>
                </div>
              </div>
            </div>

            <div className="course-enrollment">
              <div className="course-price">${course.price}</div>
              <button className="btn btn-enroll">Enroll Now</button>
              <button className="btn btn-secondary">Add to Wishlist</button>
            </div>
          </div>
        </div>
      </div>

      <div className="course-content container">
        <div className="course-tabs">
          <button
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === "curriculum" ? "active" : ""}`}
            onClick={() => setActiveTab("curriculum")}
          >
            Curriculum
          </button>
          <button
            className={`tab-btn ${activeTab === "instructor" ? "active" : ""}`}
            onClick={() => setActiveTab("instructor")}
          >
            Instructor
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="tab-pane">
              <div
                className="course-image-large"
                style={{ backgroundImage: `url(${course.image})` }}
              ></div>

              <h3>About This Course</h3>
              <p>{course.longDescription}</p>

              <h3>What You'll Learn</h3>
              <ul className="topics-list">
                {course.topics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div className="tab-pane">
              <h3>Course Curriculum</h3>
              <div className="curriculum-sections">
                {course.curriculum.map((section, sectionIndex) => (
                  <div className="curriculum-section" key={sectionIndex}>
                    <div
                      className="section-header"
                      onClick={() => toggleSection(sectionIndex)}
                    >
                      <h4>{section.title}</h4>
                      <div className="section-meta">
                        <span>{section.lessons.length} lessons</span>
                        <span
                          className={`toggle-icon ${
                            expandedSections[sectionIndex] ? "expanded" : ""
                          }`}
                        >
                          ▼
                        </span>
                      </div>
                    </div>

                    {expandedSections[sectionIndex] && (
                      <div className="section-lessons">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div className="lesson-item" key={lessonIndex}>
                            <div className="lesson-title">{lesson.title}</div>
                            <div className="lesson-duration">
                              {lesson.duration}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "instructor" && (
            <div className="tab-pane">
              <div className="instructor-profile">
                <div className="instructor-avatar">
                  {course.instructor.charAt(0)}
                </div>
                <div className="instructor-info">
                  <h3>{course.instructor}</h3>
                  <p className="instructor-title">{course.instructorTitle}</p>
                  <div className="instructor-stats">
                    <div className="stat-item">
                      <span className="stat-value">{course.reviews}</span>
                      <span className="stat-label">Reviews</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">
                        {course.students.toLocaleString()}
                      </span>
                      <span className="stat-label">Students</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">1</span>
                      <span className="stat-label">Course</span>
                    </div>
                  </div>
                  <p className="instructor-bio">{course.instructorBio}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
