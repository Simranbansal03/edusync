// src/pages/CoursesPage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/CoursesPage.css";

// Mock data - would come from your API in a real implementation
const MOCK_COURSES = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description:
      "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
    category: "Development",
    instructor: "John Doe",
    rating: 4.8,
    lessons: 12,
    level: "Beginner",
    duration: "6 weeks",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",
  },
  {
    id: 2,
    title: "Data Science Fundamentals",
    description:
      "Explore the world of data science, statistics, and machine learning basics.",
    category: "Data Science",
    instructor: "Jane Smith",
    rating: 4.7,
    lessons: 15,
    level: "Intermediate",
    duration: "8 weeks",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 3,
    title: "Mobile App Development with React Native",
    description:
      "Build cross-platform mobile apps using React Native and JavaScript.",
    category: "Development",
    instructor: "Michael Johnson",
    rating: 4.9,
    lessons: 18,
    level: "Advanced",
    duration: "10 weeks",
    image:
      "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 4,
    title: "Full Stack JavaScript Development",
    description:
      "Master both frontend and backend development using JavaScript technologies.",
    category: "Development",
    instructor: "Susan Williams",
    rating: 4.6,
    lessons: 20,
    level: "Intermediate",
    duration: "12 weeks",
    image:
      "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 5,
    title: "UX/UI Design Principles",
    description:
      "Learn the core principles of user experience and interface design.",
    category: "Design",
    instructor: "David Lee",
    rating: 4.8,
    lessons: 14,
    level: "Beginner",
    duration: "7 weeks",
    image:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 6,
    title: "Cloud Computing with AWS",
    description:
      "Dive into cloud infrastructure and services using Amazon Web Services.",
    category: "Cloud",
    instructor: "Emily Taylor",
    rating: 4.7,
    lessons: 16,
    level: "Advanced",
    duration: "9 weeks",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",
  },
];

// Get unique categories for the filter
const allCategories = [
  "All",
  ...new Set(MOCK_COURSES.map((course) => course.category)),
];
const allLevels = ["All", "Beginner", "Intermediate", "Advanced"];

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate API call with delay
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // In a real app, this would be fetched from your API
        await new Promise((resolve) => setTimeout(resolve, 800));
        setCourses(MOCK_COURSES);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter the courses based on category, level, and search query
  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      categoryFilter === "All" || course.category === categoryFilter;
    const matchesLevel = levelFilter === "All" || course.level === levelFilter;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesLevel && matchesSearch;
  });

  return (
    <div className="courses-page">
      <div className="courses-hero">
        <div className="container">
          <h1>Explore Our Courses</h1>
          <p>
            Discover a wide range of courses to enhance your skills and
            knowledge
          </p>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">
              <i className="fas fa-search">🔍</i>
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="courses-filters">
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Level:</label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              {allLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="results-count">
            {filteredCourses.length} courses found
          </div>
        </div>

        {loading ? (
          <div className="courses-loading">
            <div className="spinner"></div>
            <p>Loading courses...</p>
          </div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div className="course-card" key={course.id}>
                  <div
                    className="course-image"
                    style={{ backgroundImage: `url(${course.image})` }}
                  >
                    <div className="course-level">{course.level}</div>
                  </div>
                  <div className="course-content">
                    <span className="course-category">{course.category}</span>
                    <h3>{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                    <div className="course-meta">
                      <div className="instructor">
                        <span>By {course.instructor}</span>
                      </div>
                      <div className="rating">
                        <span>⭐ {course.rating}</span>
                      </div>
                    </div>
                    <div className="course-details">
                      <span>{course.lessons} lessons</span>
                      <span>{course.duration}</span>
                    </div>
                    <Link to={`/courses/${course.id}`} className="btn">
                      View Course
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-courses">
                <h3>No courses found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
