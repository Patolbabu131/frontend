import React, { useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { PlayArrow as PlayIcon } from '@mui/icons-material';
import { BASE_URL } from '../../assets/config';
import AdminNavbar from './AdminNavbar'; 
import { useTheme } from '@mui/material/styles'; // Add this import
import { useMediaQuery } from '@mui/material';

const AddCourses = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#1E1E1E'
      },
      primary: { main: '#704BBF' },
      secondary: { main: '#03DAC6' }
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#1E1E1E',
            borderRadius: 12,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& label.Mui-focused': { color: '#BB86FC' },
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#BB86FC' }
            }
          }
        }
      }
    }
  });

  const [courseDetails, setCourseDetails] = useState({
    title: '',
    description: '',
    thumbnail: null
  });
  const [lessons, setLessons] = useState([{ id: 1, title: '', videoFile: null, duration: 0, uploaded: false }]);
  const [courseCreated, setCourseCreated] = useState(false);
  const [courseId, setCourseId] = useState(null);
  const [previewDialog, setPreviewDialog] = useState({ open: false, videoUrl: '', lessonId: null });
  const [createCourseLoading, setCreateCourseLoading] = useState(false);
  // uploadLoading will map lesson ids to a boolean value.
  const [uploadLoading, setUploadLoading] = useState({});

  // Update course details on input change
  const handleCourseDetailChange = (e) => {
    setCourseDetails({ ...courseDetails, [e.target.name]: e.target.value });
  };

  // Get video duration (returns duration in seconds)
  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(file);
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve(video.duration);
        URL.revokeObjectURL(url);
      };
      video.src = url;
    });
  };

  // Handle video file upload per lesson and store numeric duration (minutes)
  const handleVideoUpload = async (lessonId, file) => {
    // Check if file size exceeds 5 MB (5 * 1024 * 1024 bytes)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 5 MB limit.");
      return;
    }

    // Extract file name without extension
    const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");

    const durationSeconds = await getVideoDuration(file);
    const durationMinutes = Math.floor(durationSeconds / 60);
    setLessons(prevLessons =>
      prevLessons.map(lesson =>
        lesson.id === lessonId
          ? { ...lesson, videoFile: file, duration: durationMinutes, title: fileNameWithoutExtension }
          : lesson
      )
    );
  };

  // Add a new lesson module
  const addLesson = () => {
    const newLesson = { id: lessons.length + 1, title: '', videoFile: null, duration: 0, uploaded: false };
    setLessons([...lessons, newLesson]);
  };

  // Handle lesson title changes
  const handleLessonTitleChange = (lessonId, title) => {
    setLessons(lessons.map(lesson => lesson.id === lessonId ? { ...lesson, title } : lesson));
  };

  // Open video preview dialog
  const handleOpenPreview = (lessonId, videoFile) => {
    const videoUrl = URL.createObjectURL(videoFile);
    setPreviewDialog({ open: true, videoUrl, lessonId });
  };

  // Close video preview dialog
  const handleClosePreview = () => {
    if (previewDialog.videoUrl) {
      URL.revokeObjectURL(previewDialog.videoUrl);
    }
    setPreviewDialog({ open: false, videoUrl: '', lessonId: null });
  };

  // Deselect video for the lesson being previewed
  const handleDeselectVideo = () => {
    const lessonId = previewDialog.lessonId;
    setLessons(prevLessons =>
      prevLessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, videoFile: null, duration: 0 } : lesson
      )
    );
    handleClosePreview();
  };

  // Handle course creation
  const handleCreateCourse = async () => {
    if (!courseDetails.title || !courseDetails.description) {
      alert('Please fill all required fields: Course Title and Description.');
      return;
    }
    setCreateCourseLoading(true);
    try {
      const payload = { title: courseDetails.title, description: courseDetails.description };
      const response = await fetch(`${BASE_URL}/courses/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) {
        alert(result.message);
        setCreateCourseLoading(false);
        return;
      }
      alert(result.message);
      setCourseCreated(true);
      setCourseId(result.data._id);
    } catch (error) {
      console.error('Error creating course:', error);
      alert('An error occurred while creating the course.');
    } finally {
      setCreateCourseLoading(false);
    }
  };

  // Handle lesson (module) upload
  const handleLessonUpload = async (lesson) => {
    if (!courseCreated || !courseId) {
      alert('Please create the course first.');
      return;
    }
    if (!lesson.title.trim()) {
      alert('Module title is required.');
      return;
    }
    if (!lesson.videoFile) {
      alert('Please select a video file for this module.');
      return;
    }
    // Set upload loading state for this lesson
    setUploadLoading(prev => ({ ...prev, [lesson.id]: true }));
    try {
      const formData = new FormData();
      formData.append('title', lesson.title);
      formData.append('content', '');
      formData.append('course', courseId);
      formData.append('duration', lesson.duration);
      formData.append('order', lesson.id);
      formData.append('video', lesson.videoFile);
      const response = await fetch(`${BASE_URL}/lessons/uploadLesson`, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (!response.ok) {
        alert(result.message);
        setUploadLoading(prev => ({ ...prev, [lesson.id]: false }));
        return;
      }
      alert(result.message);
      setLessons(prevLessons =>
        prevLessons.map(l => l.id === lesson.id ? { ...l, uploaded: true } : l)
      );
    } catch (error) {
      console.error('Error uploading lesson:', error);
      alert('An error occurred while uploading the module.');
    } finally {
      setUploadLoading(prev => ({ ...prev, [lesson.id]: false }));
    }
  };

  // Find current lesson for preview to check if it is uploaded
  const currentPreviewLesson = lessons.find(lesson => lesson.id === previewDialog.lessonId);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <AdminNavbar isMobile={isMobile} handleLogout={handleLogout} />
      <div style={{ padding: 20, background: 'linear-gradient(135deg, #121212, #2C2C2C)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Page Title */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          {/* Left Side: Page Title */}
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: '#E0E0E0', fontWeight: 'bold' }}
          >
            Add Course
          </Typography>

          {/* Right Side: Inputs and Button */}
          <Box display="flex" gap={3} alignItems="center">
            <TextField
              label="Course Title"
              name="title"
              value={courseDetails.title}
              onChange={handleCourseDetailChange}
              disabled={courseCreated || createCourseLoading}
              sx={{ width: 250 }}
            />
            <TextField
              label="Description"
              name="description"
              value={courseDetails.description}
              onChange={handleCourseDetailChange}
              disabled={courseCreated || createCourseLoading}
              sx={{ width: 250 }}
            />
            {!courseCreated && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateCourse}
                disabled={createCourseLoading}
                sx={{ height: 50, fontSize: '0.99rem' }}
              >
                {createCourseLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create Course'
                )}
              </Button>
            )}
          </Box>
        </Box>

        {/* Modules Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#E0E0E0' }}>
              Course Modules
            </Typography>
            <Box sx={{ pr: 1 }}>
              {lessons.map((lesson, index) => (
                <Card key={lesson.id} sx={{ mb: 2, backgroundColor: '#2C2C2C' }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={3}>
                        <Box border={1} borderRadius={2} p={2} textAlign="center">
                          <input
                            accept="video/*"
                            style={{ display: 'none' }}
                            id={`video-upload-${lesson.id}`}
                            type="file"
                            onChange={(e) => {
                              if (e.target.files) {
                                handleVideoUpload(lesson.id, e.target.files[0]);
                              }
                            }}
                            disabled={uploadLoading[lesson.id] || createCourseLoading}
                          />
                          {lesson.videoFile ? (
                            <IconButton 
                              onClick={() => handleOpenPreview(lesson.id, lesson.videoFile)} 
                              color="primary"
                              disabled={uploadLoading[lesson.id] || createCourseLoading}
                            >
                              <PlayIcon fontSize="large" />
                            </IconButton>
                          ) : (
                            <label htmlFor={`video-upload-${lesson.id}`}>
                              <Button component="span" color="primary" disabled={uploadLoading[lesson.id] || createCourseLoading}>
                                <Typography sx={{ color: '#E0E0E0' }}> Select Video </Typography>
                              </Button>
                            </label>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={1.9}>
                        {lesson.duration ? (
                          <Typography variant="body1" sx={{ color: '#E0E0E0' }}>
                            Duration: {lesson.duration} minute{lesson.duration > 1 ? 's' : ''}
                          </Typography>
                        ) : null}
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="body1" sx={{ color: '#E0E0E0' }}>
                          Chapter {index + 1}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="Module Title"
                          value={lesson.title}
                          onChange={(e) => handleLessonTitleChange(lesson.id, e.target.value)}
                          disabled={lesson.uploaded || uploadLoading[lesson.id] || createCourseLoading}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Box textAlign="center">
                          {!lesson.uploaded && (
                            <Button 
                              variant="contained" 
                              color="primary" 
                              onClick={() => handleLessonUpload(lesson)}
                              disabled={uploadLoading[lesson.id] || createCourseLoading}
                              sx={{ height: 50, fontSize: '0.98rem' }}
                            >
                              {uploadLoading[lesson.id] ? (
                                <CircularProgress size={24} color="inherit" />
                              ) : (
                                'Upload'
                              )}
                            </Button>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
            {/* Buttons Container */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={addLesson}
                disabled={createCourseLoading}
              >
                Add Module
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.location.href = "https://learningstake.netlify.app/#/admin/dashboard"}
                disabled={createCourseLoading}
              >
                Go Back
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Dialog open={previewDialog.open} onClose={handleClosePreview} maxWidth="md" fullWidth>
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6" component="span" sx={{ color: '#E0E0E0' }}>
              Video Preview
            </Typography>
            <Box>
              {currentPreviewLesson && !currentPreviewLesson.uploaded && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDeselectVideo}
                  sx={{ mr: 1, textTransform: 'none' }}
                >
                  Unselect Video
                </Button>
              )}
              <IconButton
                aria-label="close"
                onClick={handleClosePreview}
                sx={{ color: (theme) => theme.palette.grey[500] }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent dividers>
            {previewDialog.videoUrl && (
              <video
                controls
                src={previewDialog.videoUrl}
                style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default AddCourses;
