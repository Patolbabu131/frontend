import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import AdminNavbar from './AdminNavbar';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  PlayArrow,
  AccessTime,
  FormatListNumbered,
  Bookmark,
  BookmarkBorder,
  CheckCircle,
  FiberManualRecord
} from '@mui/icons-material';
import { BASE_URL } from '../../assets/config';

const LessonsList = () => {
  const [lessons, setLessons] = useState([]);
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [bookmarkedLessons, setBookmarkedLessons] = useState(new Set());
  const { courseId } = useParams();
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/lessons/course/${courseId}`)
      .then((response) => response.json())
      .then((responseData) => {
        const lessonsArray = responseData.data || [];
        setLessons(lessonsArray);
        if (lessonsArray.length > 0) {
          setCourse(lessonsArray[0].course);
          setSelectedLesson(lessonsArray[0]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching lessons:', error);
        setLoading(false);
      });
  }, [courseId]);

  const toggleBookmark = (lessonId) => {
    const newBookmarks = new Set(bookmarkedLessons);
    if (newBookmarks.has(lessonId)) {
      newBookmarks.delete(lessonId);
    } else {
      newBookmarks.add(lessonId);
    }
    setBookmarkedLessons(newBookmarks);
  };

  useEffect(() => {
    if (!document.querySelector('script[src="https://widget.kommunicate.io/v2/kommunicate.app"]')) {
      (function (d, m) {
        var kommunicateSettings = {
          appId: "YOUR_APP_ID",
          popupWidget: true,
          automaticChatOpenOnNavigation: false,
        };
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0];
        h.appendChild(s);
        window.kommunicate = m;
        m._globals = kommunicateSettings;
      })(document, window.kommunicate || {});
    }
  }, []);

  const handleStartQuiz = () => {
    if (completedLessons.size === lessons.length && lessons.length > 0) {
      navigate(`/QuizPage/${courseId}`); // Use navigate here
    } else {
      alert('You have not completed all chapters to start the quiz.');
    }
  };

  const markAsCompleted = (lessonId) => {
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(lessonId)) {
      newCompleted.delete(lessonId);
    } else {
      newCompleted.add(lessonId);
    }
    setCompletedLessons(newCompleted);
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          backgroundColor: '#121212',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress color="primary" />
        <Typography sx={{ mt: 2, color: '#ffffff' }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#121212',
        color: '#ffffff',
        p: { xs: 2, md: 3 },
      }}
    >
      <Grid container>
        {/* Left Column: Course Header + Lesson List */}
        <Grid item xs={11.5} md={4} lg={4.1}>
          {/* Moved Course Header */}
          <Box sx={{ mb: 4, textAlign: 'left' }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {course?.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#aaaaaa' }}>
              {lessons.length} Chapters
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <FiberManualRecord sx={{ fontSize: 16, mr: 1, color: '#1976d2' }} />
            Course Content
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1.5,
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '3px',
            },
          }}>
            {lessons.map((lesson, index) => (
              <Paper
                key={lesson._id}
                onClick={() => setSelectedLesson(lesson)}
                elevation={selectedLesson?._id === lesson._id ? 4 : 1}
                sx={{
                  backgroundColor: selectedLesson?._id === lesson._id 
                    ? '#333333' 
                    : completedLessons.has(lesson._id) 
                      ? '#444444' 
                      : '#1e1e1e',
                  cursor: 'pointer',
                  p: 1.5,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  borderLeft: selectedLesson?._id === lesson._id 
                    ? '4px solid' 
                    : 'none',
                  borderColor: '#1976d2',
                  '&:hover': { 
                    transform: 'translateY(-2px)', 
                    boxShadow: 3,
                    backgroundColor: selectedLesson?._id === lesson._id 
                      ? '#333333' 
                      : '#2a2a2a'
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  {/* Lesson Number */}
                  <Box sx={{ 
                    minWidth: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    backgroundColor: selectedLesson?._id === lesson._id 
                      ? '#ffffff' 
                      : '#1976d2',
                    color: selectedLesson?._id === lesson._id 
                      ? '#1976d2' 
                      : '#ffffff',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mr: 2,
                    mt: 0.5,
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {index + 1}
                  </Box>

                  {/* Lesson Content */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          color: selectedLesson?._id === lesson._id 
                            ? '#ffffff' 
                            : '#ffffff'
                        }}
                      >
                        {lesson.title}
                      </Typography>
                      <Box sx={{ display: 'flex' }}>
                        <Tooltip title={bookmarkedLessons.has(lesson._id) ? "Remove bookmark" : "Bookmark"}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(lesson._id);
                            }}
                            sx={{ 
                              color: bookmarkedLessons.has(lesson._id) 
                                ? '#ff9800' 
                                : selectedLesson?._id === lesson._id 
                                  ? '#ffffff' 
                                  : '#aaaaaa',
                              '&:hover': {
                                color: '#ff9800'
                              }
                            }}
                          >
                            {bookmarkedLessons.has(lesson._id) ? <Bookmark /> : <BookmarkBorder />}
                          </IconButton>
                        </Tooltip>
                        {completedLessons.has(lesson._id) && (
                          <CheckCircle sx={{ fontSize: 20, ml: 0.5, color: '#4caf50' }} />
                        )}
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      color: selectedLesson?._id === lesson._id 
                        ? '#bbbbbb' 
                        : '#aaaaaa', 
                      mt: 0.5,
                      alignItems: 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ mr: 0.5, fontSize: 16 }} />
                        <Typography variant="caption">
                          {lesson.duration} min
                        </Typography>
                      </Box>
                      {lesson.isFree && (
                        <Chip 
                          label="FREE" 
                          size="small" 
                          sx={{ height: 20, fontSize: '0.65rem', backgroundColor: '#4caf50', color: '#ffffff' }} 
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </Grid>

        <Grid item xs={11.5} md={7.5} lg={7.5}>
          {selectedLesson ? (
            <Box
              sx={{
                p: { xs: 2, md: 3 },
                backgroundColor: '#1e1e1e',
                borderRadius: 3,
                boxShadow: 3
              }}
            >
              {/* Title + Complete Toggle */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {selectedLesson.title}
                </Typography>
                <Tooltip title={ completedLessons.has(selectedLesson._id)
                                ? "Mark as incomplete"
                                : "Mark as completed" }>
                  <IconButton
                    onClick={() => markAsCompleted(selectedLesson._id)}
                    sx={{
                      color: completedLessons.has(selectedLesson._id)
                        ? '#4caf50'
                        : '#bbbbbb',
                      '&:hover': { color: '#4caf50' }
                    }}
                  >
                    <CheckCircle />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Video Player */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  pb: '46.25%', // 16:9
                  mb: 3,
                  backgroundColor: '#000',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 4,
                }}
              >
                <Box
                  component="video"
                  controls
                  poster={selectedLesson.thumbnailUrl && `${BASE_URL}${selectedLesson.thumbnailUrl}`}
                  src={`${selectedLesson.videoUrl}`}
                  onEnded={() => markAsCompleted(selectedLesson._id)}
                  sx={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                  }}
                />
              </Box>

              {/* Lesson Metadata */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  color: '#aaaaaa',
                  '& > *': { display: 'flex', alignItems: 'center' }
                }}
              >
                <Box>
                  <AccessTime sx={{ mr: 0.5, fontSize: 18 }} />
                  <Typography variant="body2">
                    Duration: {selectedLesson.duration} minutes
                  </Typography>
                </Box>
                <Box>
                  <FormatListNumbered sx={{ mr: 0.5, fontSize: 18 }} />
                  <Typography variant="body2">
                    Lesson {selectedLesson.order} of {lessons.length}
                  </Typography>
                </Box>
                {selectedLesson.attachments?.length > 0 && (
                  <Box>
                    <Typography variant="body2">
                      {selectedLesson.attachments.length} resources available
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* === only show when all lessons done === */}
              {lessons.length > 0 && completedLessons.size === lessons.length && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleStartQuiz}
                >
                  Start MCQ Test
                </Button>
              )}
            </Box>
          ) : (
            <Paper sx={{ 
              p: 4, 
              textAlign: 'center',
              backgroundColor: '#1e1e1e',
              borderRadius: 3
            }}>
              <Typography variant="h6" sx={{ mb: 1, color: '#aaaaaa' }}>
                No Module selected
              </Typography>
              <Typography variant="body1" sx={{ color: '#aaaaaa' }}>
                Choose a Course from the list to start learning
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default LessonsList;

