import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Divider,
  Tooltip,
  Container,
  alpha,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip
} from "@mui/material";
import { Delete, Edit, Visibility, Add, Quiz, MenuBook } from "@mui/icons-material";
import AdminNavbar from "./AdminNavbar";
import { BASE_URL } from "../../assets/config";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const isXsScreen = useMediaQuery('(max-width:600px)');
  const isSmScreen = useMediaQuery('(max-width:900px)');
  const isMdScreen = useMediaQuery('(max-width:1200px)');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create a dark theme
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#f48fb1',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    },
    components: {
      // Add styling for AppBar (navbar) with square edges
      MuiAppBar: {
        styleOverrides: {
          root: {
            borderRadius: 0, // Remove curved edges
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          },
        },
      },
      // Also update Paper component which might be used in the navbar
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12, // Keep existing rounded corners for other papers
            '&.MuiAppBar-root': {
              borderRadius: 0, // Specifically target AppBar to ensure no curved edges
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: alpha('#90caf9', 0.1),
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 'bold',
            backgroundColor: '#1a1a1a',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#1e1e1e',
            borderRadius: 12,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            }
          }
        }
      },
    },
  });

  useEffect(() => {
    fetchCourses();
    // Set a timer to log out after 1 hour (3600000ms)
    const timer = setTimeout(() => {
      handleLogout();
    }, 3600000);

    return () => clearTimeout(timer);
  }, []);

  const fetchCourses = () => {
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
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  const handleDelete = (courseId) => {
    if(window.confirm("Are you sure you want to delete this course?")) {
      fetch(`${BASE_URL}/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(() => {
        setCourses(courses.filter(course => course._id !== courseId));
      })
      .catch(error => console.error("Error deleting course:", error));
    }
  };

  const handleMCQ = (courseId) => {
    navigate(`/admin/question/${courseId}`);
  };

  // Table view for larger screens
  const renderTableView = () => (
    <Paper elevation={3} sx={{ overflow: 'hidden' }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="course table">
          <TableHead>
            <TableRow>
              <TableCell width="80">S.No.</TableCell>
              <TableCell>Title</TableCell>
              {!isSmScreen && <TableCell>Description</TableCell>}
              <TableCell>Total Lessons</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isSmScreen ? 4 : 5} align="center">
                  <Typography variant="body1" sx={{ py: 4 }}>
                    No courses available. Add a course to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course, index) => (
                <TableRow key={course._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>
                    {course.title}
                  </TableCell>
                  {!isSmScreen && (
                    <TableCell sx={{ 
                      maxWidth: 300,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {course.description}
                    </TableCell>
                  )}
                  <TableCell>{course.lessons.length}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit course">
                      <IconButton 
                        color="primary" 
                        onClick={() => navigate(`/admin/editcourse/${course._id}`)}
                        sx={{ mx: 0.5 }}
                        size={isSmScreen ? "small" : "medium"}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete course">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(course._id)}
                        sx={{ mx: 0.5 }}
                        size={isSmScreen ? "small" : "medium"}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View lessons">
                      <IconButton
                        color="info"
                        onClick={() => navigate(`/lessonslist/${course._id}`)}
                        sx={{ mx: 0.5 }}
                        size={isSmScreen ? "small" : "medium"}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Manage MCQs">
                      <IconButton
                        color="secondary"
                        onClick={() => handleMCQ(course._id)}
                        sx={{ 
                          mx: 0.5,
                          backgroundColor: alpha('#f48fb1', 0.1),
                          '&:hover': {
                            backgroundColor: alpha('#f48fb1', 0.2),
                          }
                        }}
                        size={isSmScreen ? "small" : "medium"}
                      >
                        <Quiz />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  // Card view for mobile screens
  const renderCardView = () => (
    <Grid container spacing={3}>
      {courses.length === 0 ? (
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1">
              No courses available. Add a course to get started.
            </Typography>
          </Box>
        </Grid>
      ) : (
        courses.map((course, index) => (
          <Grid item xs={12} key={course._id}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div" fontWeight="bold">
                    {course.title}
                  </Typography>
                  <Chip 
                    icon={<MenuBook fontSize="small" />} 
                    label={`${course.lessons.length} Lessons`} 
                    size="small" 
                    sx={{ backgroundColor: alpha('#90caf9', 0.15) }}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ 
                  mb: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {course.description}
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                  Course #{index + 1}
                </Typography>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                <Box>
                  <Tooltip title="Edit course">
                    <IconButton 
                      color="primary" 
                      onClick={() => navigate(`/admin/editcourse/${course._id}`)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete course">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(course._id)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box>
                  <Tooltip title="View lessons">
                    <IconButton
                      color="info"
                      onClick={() => navigate(`/lessonslist/${course._id}`)}
                      size="small"
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Manage MCQs">
                    <IconButton
                      color="secondary"
                      onClick={() => handleMCQ(course._id)}
                      sx={{ 
                        backgroundColor: alpha('#f48fb1', 0.1),
                        '&:hover': {
                          backgroundColor: alpha('#f48fb1', 0.2),
                        }
                      }}
                      size="small"
                    >
                      <Quiz />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        backgroundColor: 'background.default'
      }}>
        <AdminNavbar isMobile={isXsScreen} handleLogout={handleLogout} />
        
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isXsScreen ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: isXsScreen ? 'flex-start' : 'center', 
            gap: isXsScreen ? 2 : 0,
            mb: 4 
          }}>
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ fontSize: isXsScreen ? '1.75rem' : '2.125rem' }}>
              Course Management
            </Typography>
            <Tooltip title="Add a new course">
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={() => navigate("/admin/courses")}
                fullWidth={isXsScreen}
                sx={{ 
                  px: isXsScreen ? 2 : 3, 
                  py: 1,
                  boxShadow: 3,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                  transition: 'all 0.2s'
                }}
              >
                Add Course
              </Button>
            </Tooltip>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : (
            isXsScreen ? renderCardView() : renderTableView()
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;