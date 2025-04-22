import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Divider,
  Paper,
  Container,
  Snackbar,
  Alert,
  FormHelperText,
  useMediaQuery
} from '@mui/material';
import { 
  Add as AddIcon, 
  Close as CloseIcon, 
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { BASE_URL } from '../../assets/config';
import AdminNavbar from './AdminNavbar';

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // State management
  const [courseDetails, setCourseDetails] = useState({
    title: '',
    description: ''
  });
  const [validationErrors, setValidationErrors] = useState({
    title: false,
    description: false
  });
  const [lessons, setLessons] = useState([]);
  const [newLessons, setNewLessons] = useState([]);
  const [previewDialog, setPreviewDialog] = useState({ open: false, videoUrl: '', lessonId: null });
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          fetch(`${BASE_URL}/courses/${courseId}`),
          fetch(`${BASE_URL}/lessons/course/${courseId}`)
        ]);
        
        if (!courseRes.ok || !lessonsRes.ok) {
          throw new Error('Failed to fetch course data');
        }
        
        const courseData = await courseRes.json();
        const lessonsData = await lessonsRes.json();
        
        setCourseDetails({
          title: courseData.title,
          description: courseData.description
        });
        
        const existingLessons = lessonsData.data.map(lesson => ({
          _id: lesson._id,
          id: lesson.order,
          title: lesson.title,
          duration: lesson.duration,
          videoUrl: lesson.videoUrl,
          uploaded: true
        }));
        
        // Sort lessons by order/id
        existingLessons.sort((a, b) => a.id - b.id);
        
        setLessons(existingLessons);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course data:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load course data. Please try again.',
          severity: 'error'
        });
        setLoading(false);
      }
    };
    
    fetchCourseData();
  }, [courseId]);

  const handleCourseDetailChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails({ ...courseDetails, [name]: value });
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: false });
    }
  };

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

  const handleVideoUpload = async (lessonId, file) => {
    if (!file) return;
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setSnackbar({
        open: true,
        message: 'File size exceeds 10 MB limit',
        severity: 'error'
      });
      return;
    }

    try {
      setUploadLoading(prev => ({ ...prev, [lessonId]: true }));
      
      const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      const durationSeconds = await getVideoDuration(file);
      const durationMinutes = Math.floor(durationSeconds / 60);
      
      setNewLessons(prev =>
        prev.map(lesson =>
          lesson.id === lessonId
            ? { 
                ...lesson, 
                videoFile: file, 
                duration: durationMinutes, 
                title: lesson.title || fileNameWithoutExtension,
                thumbnailPreview: URL.createObjectURL(file)
              }
            : lesson
        )
      );
      
      setSnackbar({
        open: true,
        message: 'Video selected successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error processing video:', error);
      setSnackbar({
        open: true,
        message: 'Failed to process video',
        severity: 'error'
      });
    } finally {
      setUploadLoading(prev => ({ ...prev, [lessonId]: false }));
    }
  };

  const addNewLesson = () => {
    const newLesson = { 
      id: Math.max(...[...lessons, ...newLessons].map(l => l.id || 0), 0) + 1,
      title: '',
      videoFile: null,
      duration: 0,
      uploaded: false
    };
    setNewLessons([...newLessons, newLesson]);
  };

  const handleLessonTitleChange = (lessonId, title) => {
    setNewLessons(prev =>
      prev.map(lesson => lesson.id === lessonId ? { ...lesson, title } : lesson)
    );
  };

  const handleDeleteLesson = async (lessonId, isExisting) => {
    if (isExisting) {
      try {
        const response = await fetch(`${BASE_URL}/lessons/${lessonId}`, { method: 'DELETE' });
        
        if (!response.ok) {
          throw new Error('Failed to delete lesson');
        }
        
        setLessons(prev => prev.filter(lesson => lesson._id !== lessonId));
        setSnackbar({
          open: true,
          message: 'Lesson deleted successfully',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error deleting lesson:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete lesson',
          severity: 'error'
        });
      }
    } else {
      setNewLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
      setSnackbar({
        open: true,
        message: 'New lesson removed',
        severity: 'info'
      });
    }
  };

  const validateForm = () => {
    const errors = {
      title: !courseDetails.title.trim(),
      description: !courseDetails.description.trim()
    };
    
    setValidationErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleUpdateCourse = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields',
        severity: 'error'
      });
      return;
    }

    setUpdateLoading(true);
    try {
      // Update course details
      const courseResponse = await fetch(`${BASE_URL}/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseDetails)
      });
      
      if (!courseResponse.ok) {
        throw new Error('Failed to update course details');
      }

      // Upload new lessons
      const lessonPromises = newLessons.map(async (lesson) => {
        if (lesson.videoFile) {
          const formData = new FormData();
          formData.append('title', lesson.title);
          formData.append('course', courseId);
          formData.append('duration', lesson.duration);
          formData.append('order', lesson.id);
          formData.append('video', lesson.videoFile);
          
          const response = await fetch(`${BASE_URL}/lessons/uploadLesson`, {
            method: 'POST',
            body: formData
          });
          
          if (!response.ok) {
            throw new Error(`Failed to upload lesson ${lesson.title}`);
          }
        }
      });
      
      await Promise.all(lessonPromises);

      setSnackbar({
        open: true,
        message: 'Course updated successfully',
        severity: 'success'
      });
      
      // Navigate after a short delay to allow the user to see the success message
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (error) {
      console.error('Error updating course:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update course',
        severity: 'error'
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <ThemeProvider theme={createDarkTheme()}>
        <CssBaseline />
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading course data...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={createDarkTheme()}>
      <CssBaseline />
      <AdminNavbar isMobile={isMobile} handleLogout={() => navigate('/admin/login')} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {/* Header Section */}
          <Box sx={styles.headerSection}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                color="inherit" 
                onClick={() => navigate('/admin/dashboard')}
                sx={{ mr: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant={isMobile ? "h5" : "h4"} fontWeight="500">
                Edit Course
              </Typography>
            </Box>
            
            {!isMobile && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleUpdateCourse}
                disabled={updateLoading}
                sx={styles.saveButton}
              >
                {updateLoading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
              </Button>
            )}
          </Box>
          
          {/* Course Details Section */}
          <Box sx={styles.courseDetailsSection}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Course Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Course Title"
                  name="title"
                  value={courseDetails.title}
                  onChange={handleCourseDetailChange}
                  error={validationErrors.title}
                  helperText={validationErrors.title ? "Title is required" : ""}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={courseDetails.description}
                  onChange={handleCourseDetailChange}
                  error={validationErrors.description}
                  helperText={validationErrors.description ? "Description is required" : ""}
                  variant="outlined"
                  multiline
                  rows={isMobile ? 3 : 2}
                  required
                />
              </Grid>
            </Grid>
          </Box>
          
          <Divider />
          
          {/* Lessons Section */}
          <Box sx={styles.lessonsSection}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Course Modules ({lessons.length + newLessons.length})
              </Typography>
              
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={addNewLesson}
                size={isMobile ? "small" : "medium"}
              >
                {isMobile ? "Add Module" : "Add New Module"}
              </Button>
            </Box>
            
            {/* Existing Lessons */}
            {lessons.length === 0 && newLessons.length === 0 ? (
              <Box sx={styles.emptyState}>
                <Typography variant="body1" color="text.secondary" align="center">
                  No modules added yet. Click "Add New Module" to get started.
                </Typography>
              </Box>
            ) : (
              <Box sx={styles.lessonsList}>
                {[...lessons, ...newLessons]
                  .sort((a, b) => a.id - b.id)
                  .map((lesson, index) => (
                  <LessonItem 
                    key={lesson._id || `new-${lesson.id}`}
                    lesson={lesson}
                    isMobile={isMobile}
                    handleVideoUpload={handleVideoUpload}
                    handleLessonTitleChange={handleLessonTitleChange}
                    handleDeleteLesson={handleDeleteLesson}
                    setPreviewDialog={setPreviewDialog}
                    uploadLoading={uploadLoading[lesson.id]}
                    index={index}
                  />
                ))}
              </Box>
            )}
          </Box>
          
          {/* Mobile Save Button */}
          {isMobile && (
            <Box sx={styles.mobileActions}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={updateLoading ? null : <SaveIcon />}
                onClick={handleUpdateCourse}
                disabled={updateLoading}
                sx={{ py: 1.5 }}
              >
                {updateLoading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Video Preview Dialog */}
      <PreviewDialog 
        previewDialog={previewDialog}
        handleClose={() => setPreviewDialog({...previewDialog, open: false})}
      />
      
      {/* Feedback Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          elevation={6} 
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

// LessonItem Component - Extracted for better organization
const LessonItem = ({ lesson, isMobile, handleVideoUpload, handleLessonTitleChange, handleDeleteLesson, setPreviewDialog, uploadLoading, index }) => {
  const fileInputRef = React.useRef(null);
  
  return (
    <Card 
      elevation={2} 
      sx={{
        mb: 2,
        borderRadius: 1,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Module Number */}
          <Grid item xs={1} sm={1} display="flex" alignItems="center" justifyContent="center">
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {index + 1}
            </Typography>
          </Grid>

          {/* Video upload/thumbnail section */}
          <Grid item xs={4} sm={3} md={2}>
            {lesson.uploaded ? (
              <Box 
                sx={styles.videoPreview} 
                onClick={() => setPreviewDialog({
                  open: true,
                  videoUrl: lesson.videoUrl,
                  lessonId: lesson.id
                })}
              >
                <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: 'rgba(0,0,0,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <PlayIcon sx={{ color: 'white' }} />
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box sx={styles.videoUpload}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleVideoUpload(lesson.id, e.target.files[0])}
                />
                {lesson.thumbnailPreview ? (
                  <Box 
                    sx={{ 
                      position: 'relative', 
                      width: '100%', 
                      height: '100%', 
                      backgroundImage: `url(${lesson.thumbnailPreview})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <PlayIcon sx={{ color: 'white' }} />
                    </Box>
                  </Box>
                ) : (
                  <Button 
                    variant="outlined" 
                    component="span" 
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploadLoading}
                    fullWidth
                    sx={{ height: '100%', borderStyle: 'dashed' }}
                  >
                    {uploadLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <>
                        <AddIcon sx={{ mr: 1 }} />
                        {isMobile ? 'Video' : 'Add Video'}
                      </>
                    )}
                  </Button>
                )}
              </Box>
            )}
          </Grid>

          {/* Lesson details */}
          <Grid item xs={5} sm={6} md={7}>
            <TextField
              fullWidth
              label="Module Title"
              placeholder="Enter a descriptive title"
              value={lesson.title}
              onChange={(e) => handleLessonTitleChange(lesson.id, e.target.value)}
              disabled={lesson.uploaded}
              size={isMobile ? "small" : "medium"}
              variant="outlined"
            />
            {lesson.duration > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <Box component="span" sx={{ fontWeight: 'medium' }}>Duration:</Box> {lesson.duration} {lesson.duration === 1 ? 'minute' : 'minutes'}
              </Typography>
            )}
          </Grid>

          {/* Delete button */}
          <Grid item xs={2} sm={2} md={2} sx={{ textAlign: 'right' }}>
            <IconButton 
              onClick={() => handleDeleteLesson(lesson._id || lesson.id, !!lesson.uploaded)}
              color="error"
              size={isMobile ? "small" : "medium"}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(211, 47, 47, 0.1)' 
                } 
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Preview Dialog Component
const PreviewDialog = ({ previewDialog, handleClose }) => {
  const { open, videoUrl, lessonId } = previewDialog;
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ 
        sx: { 
          borderRadius: 2,
          backgroundColor: '#121212',
          overflow: 'hidden'
        } 
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        px: 3,
        py: 2
      }}>
        <Typography variant="h6">Video Preview</Typography>
        <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {videoUrl && (
          <video 
            controls 
            src={videoUrl} 
            style={{ 
              width: '100%', 
              height: '100%', 
              maxHeight: '100%',
              objectFit: 'contain',
              backgroundColor: '#000'
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

// Theme configuration
const createDarkTheme = () => {
  return createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
      error: {
        main: '#f44336',
      },
      success: {
        main: '#4caf50',
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      h4: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });
};

// Custom hook for theme
const useTheme = () => {
  return createDarkTheme();
};

// Styles object
const styles = {
  headerSection: {
    p: 3,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  saveButton: {
    px: 3,
    py: 1,
    borderRadius: 8,
    fontWeight: 500,
  },
  courseDetailsSection: {
    p: 3,
  },
  lessonsSection: {
    p: 3,
  },
  emptyState: {
    py: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    bgcolor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 1,
    border: '1px dashed rgba(255, 255, 255, 0.2)',
  },
  lessonsList: {
    mt: 2,
  },
  videoPreview: {
    height: 80,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 1,
    overflow: 'hidden',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'scale(1.03)',
      boxShadow: '0 0 8px rgba(25, 118, 210, 0.5)',
    },
  },
  videoUpload: {
    height: 80,
    width: '100%',
    borderRadius: 1,
    overflow: 'hidden',
  },
  mobileActions: {
    p: 3,
    borderTop: '1px solid rgba(255, 255, 255, 0.12)',
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'background.paper',
    zIndex: 2,
    boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)',
  },
};

export default EditCourse;