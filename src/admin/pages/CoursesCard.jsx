import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../assets/config';
import CircularProgress from '@mui/material/CircularProgress';

const CoursesCard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/courses/`)
      .then(response => response.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, []);

  const handleNavigation = (courseId) => {
    // Navigate to the LessonList page with courseId in the URL
    navigate(`/lessonslist/${courseId}`);
  };

  if (loading) {
    return (
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: 'linear-gradient(135deg, #3f51b5 0%, #673ab7 100%)'
      }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    
    <div style={styles.wrapper}>
    
      <h1 style={styles.heading}>Available Courses</h1>
      <div style={styles.container}>
        
        {courses.map(course => (
          <div 
            key={course._id} 
            style={styles.card}
            onClick={() => handleNavigation(course._id)}
          >
            {/* Text-based thumbnail section (50% height) */}
            <div style={styles.thumbnailSection}>
              <span style={styles.thumbnailTitle}>{course.title}</span>
            </div>
            
            {/* Course details (remaining space) */}
            <div style={styles.details}>
              <h3 style={styles.title}>{course.title}</h3>
              <p style={styles.description}>{course.description}</p>
              <p style={styles.info}>Total Videos: {course.lessons.length}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '1px',
      background:'linear-gradient(135deg, #212121, #424242)'
   
    
  },
  heading: {
    color: '#f8f8f8',
    textAlign: 'center',
    marginBottom: '25px',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    
  },
  card: {
    width: '300px',
    height: '350px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column', 
    cursor: "url('/path/to/hand-icon.png'), pointer" 
  },
  thumbnailSection: {
    flex: '0 0 50%',
    background: 'linear-gradient(135deg, #3f51b5 0%, #673ab7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px'
  },
  thumbnailTitle: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
    wordBreak: 'break-word',
    lineHeight: '1.2'
  },
  details: {
    flex: 1,
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '1.2rem'
  },
  description: {
    margin: '0 0 10px 0',
    color: '#999',
    fontSize: '0.9rem',
    flexGrow: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: '3',
    WebkitBoxOrient: 'vertical'
  },
  info: {
    margin: '0',
    fontStyle: 'italic',
    color: '#777',
    fontSize: '0.8rem'
  }
};

export default CoursesCard;
