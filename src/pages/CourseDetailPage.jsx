import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CourseDetailPage.css";
import { FaArrowLeft, FaClipboardCheck, FaDownload, FaExternalLinkAlt, FaFileAlt, FaChalkboardTeacher } from "react-icons/fa";
import { downloadFile, openFileInBrowser } from "../services/downloadService";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadError, setDownloadError] = useState(null);

  // Function to check if a URL is from YouTube
  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Function to get direct download URL for a file
  const getDirectDownloadUrl = (url) => {
    if (!url) return '';

    try {
      // First, check if this is already a URL to our uploads directory
      if (url.includes('/uploads/')) {
        // Try to access the file directly first
        const fullUrl = url.startsWith('http')
          ? url
          : `${window.API_CONFIG.BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;

        console.log("Using direct file URL:", fullUrl);
        return fullUrl;
      }

      // Fall back to the download API endpoint
      // Get the filename from the URL
      const filename = url.split('/').pop();

      // Create a direct download URL
      return `${window.API_CONFIG.BASE_URL}/api/CourseModels/download/${filename}`;
    } catch (e) {
      console.error('Error creating direct download URL:', e);
      return url;
    }
  };

  // Function to check if a URL is a file from our uploads directory
  const isUploadedFile = (url) => {
    if (!url) return false;
    return url.includes('/uploads/');
  };

  // Function to get file name from URL
  const getFileName = (url) => {
    if (!url) return 'File';
    try {
      // Extract filename from URL
      const pathParts = new URL(url).pathname.split('/');
      const fullFileName = pathParts[pathParts.length - 1];

      // Remove the UUID prefix if present (format: UUID_filename.ext)
      const nameParts = fullFileName.split('_');
      if (nameParts.length > 1 && nameParts[0].length === 36) {
        // If it looks like our UUID_filename format
        return nameParts.slice(1).join('_');
      }

      return fullFileName;
    } catch (e) {
      return 'File';
    }
  };

  // Function to get file extension from URL
  const getFileExtension = (url) => {
    if (!url) return '';
    try {
      const fileName = getFileName(url);
      const parts = fileName.split('.');
      return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
    } catch (e) {
      return '';
    }
  };

  // Function to get file type icon based on extension
  const getFileIcon = (url) => {
    const ext = getFileExtension(url);

    // Return appropriate icon based on file extension
    switch (ext) {
      case 'pdf':
        return "📄";
      case 'doc':
      case 'docx':
        return "📝";
      case 'xls':
      case 'xlsx':
        return "📊";
      case 'ppt':
      case 'pptx':
        return "📑";
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return "🖼️";
      case 'mp4':
      case 'mov':
      case 'avi':
      case 'webm':
        return "🎬";
      case 'mp3':
      case 'wav':
      case 'ogg':
        return "🎵";
      default:
        return "📁";
    }
  };

  // Function to get the hostname from a URL in a user-friendly format
  const getHostname = (url) => {
    if (!url) return 'external site';
    try {
      // Extract hostname from URL
      const hostname = new URL(url).hostname;

      // Remove www. if present
      let cleanHostname = hostname.replace('www.', '');

      // Extract domain name without TLD
      const domainParts = cleanHostname.split('.');
      if (domainParts.length >= 2) {
        cleanHostname = domainParts[domainParts.length - 2];
      }

      // Capitalize first letter
      return cleanHostname.charAt(0).toUpperCase() + cleanHostname.slice(1);
    } catch (e) {
      // If URL parsing fails, return generic text
      return 'external site';
    }
  };

  // Function to format video URLs for embedding
  const formatVideoUrl = (url) => {
    if (!url) return '';

    // Handle YouTube URLs
    // Match different YouTube URL formats
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);

    if (match && match[1]) {
      // Extract video ID and return proper embed URL
      const videoId = match[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // If the URL already has /embed/ in it, it's likely already formatted correctly
    if (url.includes('youtube.com/embed/')) {
      return url;
    }

    // For other video providers or if not matching our patterns, return as is
    return url;
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://localhost:7278/api/CourseModels/${id}`);
        setCourse(response.data);

        // Fetch instructor information if instructorId exists
        const instructorId = response.data.instructorId || response.data.InstructorId;
        if (instructorId) {
          try {
            const instructorResponse = await axios.get(`https://localhost:7278/api/UserModels/${instructorId}`);
            setInstructor(instructorResponse.data);
          } catch (err) {
            console.error("Error fetching instructor details:", err);
            // Don't set error for instructor fetch failure
          }
        }
      } catch (err) {
        console.error("Error fetching course details:", err);
        if (err.response && err.response.status === 404) {
          setError("Course not found");
        } else {
          setError("Failed to load course details. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleBackClick = () => {
    navigate("/courses");
  };

  // Function to handle file download
  const handleDownload = async (url, fileName) => {
    setDownloadError(null);
    const success = await downloadFile(url, fileName);
    if (!success) {
      setDownloadError("Failed to download file. The file may not exist or the server is not responding.");
    }
  };

  // Function to handle file view in browser
  const handleViewInBrowser = (url) => {
    setDownloadError(null);
    const success = openFileInBrowser(url);
    if (!success) {
      setDownloadError("Failed to open file in browser. The file may not exist or the server is not responding.");
    }
  };

  if (isLoading) {
    return (
      <div className="course-detail-loading">
        <div className="spinner"></div>
        <p>Loading course content...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-detail-error">
        <div className="error-container">
          <h2>{error || "Course not found"}</h2>
          <button className="back-button" onClick={handleBackClick}>
            <FaArrowLeft /> Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const mediaUrl = course.mediaUrl || course.MediaUrl;

  return (
    <div className="course-detail-page">
      <div className="course-banner">
        <div className="container">
          <button className="back-button" onClick={handleBackClick}>
            <FaArrowLeft /> Back to Courses
          </button>
          <h1 className="course-title">{course.title || course.Title}</h1>
          <div className="course-meta">
            {instructor && (
              <div className="meta-item">
                <FaChalkboardTeacher />
                <span>Instructor: {instructor.name || instructor.Name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="course-content-container container">
        <div className="course-main-content">
          <div className="video-container">
            {mediaUrl ? (
              <>
                {isYouTubeUrl(mediaUrl) ? (
                  <iframe
                    src={formatVideoUrl(mediaUrl)}
                    title={course.title || course.Title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : isUploadedFile(mediaUrl) ? (
                  <div className="file-download-container">
                    <div className="file-preview">
                      <div className="file-icon">{getFileIcon(mediaUrl)}</div>
                      <h3 className="file-name">{getFileName(mediaUrl)}</h3>
                      <p className="file-type">{getFileExtension(mediaUrl).toUpperCase()} File</p>
                    </div>
                    <div className="file-actions">
                      <button
                        onClick={() => handleDownload(getDirectDownloadUrl(mediaUrl), getFileName(mediaUrl))}
                        className="download-button"
                      >
                        <FaDownload /> Download Course Material
                      </button>
                      <button
                        onClick={() => handleViewInBrowser(getDirectDownloadUrl(mediaUrl))}
                        className="view-button"
                      >
                        <FaFileAlt /> View in Browser
                      </button>
                    </div>
                    {downloadError && (
                      <div className="download-error">
                        <p>{downloadError}</p>
                      </div>
                    )}
                    <div className="file-instructions">
                      <p>Click "Download" to save this file to your device, or "View in Browser" to open it directly.</p>
                    </div>
                  </div>
                ) : (
                  <div className="external-link-container">
                    <div className="external-link-message">
                      <h3>External Course Content</h3>
                      <p>This course content is hosted on {getHostname(mediaUrl)}. Click the button below to access it.</p>
                      <a
                        href={mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="external-link-button"
                      >
                        <FaExternalLinkAlt /> Open Course on {getHostname(mediaUrl)}
                      </a>
                      <p className="external-note">Note: The content will open in a new tab</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="no-video">No content available for this course</div>
            )}
          </div>

          <div className="course-description-panel">
            <h2>Course Description</h2>
            <p>{course.description || course.Description}</p>
          </div>
        </div>

        <div className="course-sidebar">
          <div className="sidebar-card">
            <h3>Course Actions</h3>
            <div className="sidebar-content">
              <Link
                to={`/courses/${course.courseId || course.CourseId}/assessments`}
                className="assessment-button"
              >
                <FaClipboardCheck /> View All Assessments
              </Link>

              <div className="course-features">
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div className="feature-text">Self-paced learning</div>
                </div>
                {instructor && (
                  <div className="feature-item">
                    <div className="feature-icon">✓</div>
                    <div className="feature-text">Taught by {instructor.name || instructor.Name}</div>
                  </div>
                )}
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div className="feature-text">Access to assessments</div>
                </div>
                {isUploadedFile(mediaUrl) && (
                  <div className="feature-item">
                    <div className="feature-icon">✓</div>
                    <div className="feature-text">Downloadable materials</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;