import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Radio, RadioGroup, FormControlLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, IconButton, Tooltip, Container, Card,
  CardContent, CardActions, Grid, Divider, useMediaQuery,
  ThemeProvider, createTheme, CssBaseline, alpha, Chip,
  AppBar, Toolbar, IconButton as MuiIconButton
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  Quiz,
  Menu,
  AccountCircle,
  Logout
} from '@mui/icons-material';
import { BASE_URL } from '../../assets/config';

// Dark theme configuration
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
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
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

const AdminNavbar = ({ isMobile, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <MuiIconButton
          size="large"
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
          onClick={() => navigate('/admin')}
        >
          <Menu />
        </MuiIconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Account">
            <MuiIconButton color="inherit">
              <AccountCircle />
            </MuiIconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <MuiIconButton color="error" onClick={handleLogout}>
              <Logout />
            </MuiIconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

function QuestionManager() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState(''); // State for course name
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false },
  ]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const isXsScreen = useMediaQuery('(max-width:600px)');

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await fetch(`${BASE_URL}/courses/${courseId}`, { headers: authHeaders });
        if (!res.ok) {
          console.error('API Error:', res.status, res.statusText);
          throw new Error(`Failed to fetch course details: ${res.statusText}`);
        }
        const jsonResponse = await res.json();// Log the full response
        setCourseName(jsonResponse.title || 'Unknown Course'); // Use the title directly from the response
      } catch (err) {
        console.error('Error fetching course details:', err);
        setCourseName('Unknown Course');
      }
    };

    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}/questions/course/${courseId}`,
          { headers: authHeaders }
        );
        const { data } = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails(); // Fetch course details
    fetchQuestions();

    const timer = setTimeout(() => handleLogout(), 3600000);
    return () => clearTimeout(timer);
  }, [courseId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const handleOpenAdd = () => {
    setCurrentQuestion(null);
    setQuestionText('');
    setOptions([
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
    ]);
    setCorrectIndex(null);
    setOpen(true);
  };

  const handleOpenEdit = async (questionId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/questions/${questionId}`,
        { headers: authHeaders }
      );
      const { data } = await res.json();
      setCurrentQuestion(data.question);
      setQuestionText(data.question.questionText);
      setOptions(data.options.map(opt => ({
        _id: opt._id,
        optionText: opt.optionText,
        isCorrect: opt.isCorrect,
      })));
      setCorrectIndex(data.options.findIndex(opt => opt.isCorrect));
      setOpen(true);
    } catch (err) {
      console.error('Error loading question for edit:', err);
    }
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    // Check if question text is empty
    if (!questionText.trim()) {
      return alert('Question text cannot be empty.');
    }

    // Check if there are exactly 4 options
    if (options.length !== 4) {
      return alert('You must provide exactly 4 options.');
    }

    // Check if any option is empty
    if (options.some(opt => !opt.optionText.trim())) {
      return alert('All options must have text.');
    }

    // Check if a correct option is selected
    if (correctIndex === null) {
      return alert('You must select the correct answer.');
    }

    const optionsData = options.map((opt, idx) => ({
      _id: opt._id,
      optionText: opt.optionText,
      isCorrect: idx === correctIndex,
    }));

    const payload = currentQuestion
      ? { questionText, options: optionsData }
      : { courseId, questionText, options: optionsData };

    const url = currentQuestion
      ? `${BASE_URL}/questions/${currentQuestion._id}`
      : `${BASE_URL}/questions`;

    try {
      const response = await fetch(url, {
        method: currentQuestion ? 'PUT' : 'POST',
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }

      const refreshRes = await fetch(
        `${BASE_URL}/questions/course/${courseId}`,
        { headers: authHeaders }
      );
      const { data } = await refreshRes.json();
      setQuestions(data);
      handleClose();
    } catch (err) {
      console.error('Error saving question:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      const response = await fetch(`${BASE_URL}/questions/${questionId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      
      if (!response.ok) throw new Error('Delete failed');
      
      setQuestions(qs => qs.filter(q => q._id !== questionId));
    } catch (err) {
      console.error('Error deleting question:', err);
      alert(`Delete failed: ${err.message}`);
    }
  };

  const renderTableView = () => (
    <Paper elevation={3}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No.</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Options</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1" sx={{ py: 4 }}>
                    No questions found. Add a question to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : questions.map((q, i) => (
              <TableRow key={q._id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{q.questionText}</TableCell>
                <TableCell>
                  {q.options.map((opt, idx) => (
                    <Chip
                      key={idx}
                      label={opt.optionText}
                      color={opt.isCorrect ? 'success' : 'default'}
                      size="small"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpenEdit(q._id)}>
                      <Edit color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(q._id)}>
                      <Delete color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  const renderCardView = () => (
    <Grid container spacing={2}>
      {questions.length === 0 ? (
        <Grid item xs={12}>
          <Typography align="center" sx={{ py: 4 }}>
            No questions found. Add a question to get started.
          </Typography>
        </Grid>
      ) : questions.map((q, i) => (
        <Grid item xs={12} key={q._id}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Question {i + 1}
              </Typography>
              <Typography sx={{ mb: 2 }}>{q.questionText}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {q.options.map((opt, idx) => (
                  <Chip
                    key={idx}
                    label={opt.optionText}
                    color={opt.isCorrect ? 'success' : 'default'}
                    size="small"
                  />
                ))}
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Tooltip title="Edit">
                <IconButton onClick={() => handleOpenEdit(q._id)}>
                  <Edit color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => handleDelete(q._id)}>
                  <Delete color="error" />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        </Grid>
      ))}
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
            gap: 2,
            mb: 4,
          }}>
            <Typography variant="h4" fontWeight="bold">
              MCQ Management <Chip icon={<Quiz />} label={`Course: ${courseName}`} />
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenAdd}
              sx={{
                px: 3,
                py: 1,
                boxShadow: 3,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
                transition: 'all 0.2s'
              }}
            >
              Add Question
            </Button>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : isXsScreen ? renderCardView() : renderTableView()}

          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
              {currentQuestion ? 'Edit Question' : 'Create New Question'}
            </DialogTitle>
            <DialogContent>
              <TextField
                label="Question Text"
                fullWidth
                margin="normal"
                value={questionText}
                onChange={e => setQuestionText(e.target.value)}
                sx={{ mt: 2 }}
              />
              
              <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                Options (Select correct answer)
              </Typography>
              
              <RadioGroup
                value={correctIndex == null ? '' : String(correctIndex)}
                onChange={e => setCorrectIndex(Number(e.target.value))}
              >
                {options.map((opt, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                      flexDirection: isXsScreen ? 'column' : 'row',
                      gap: 1,
                    }}
                  >
                    <FormControlLabel
                      value={String(idx)}
                      control={<Radio />}
                      label=""
                      sx={{ mr: isXsScreen ? 0 : 1 }}
                    />
                    <TextField
                      label={`Option ${idx + 1}`}
                      variant="outlined"
                      fullWidth
                      value={opt.optionText}
                      onChange={e => {
                        const newOpts = [...options];
                        newOpts[idx].optionText = e.target.value;
                        setOptions(newOpts);
                      }}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        const newOpts = options.filter((_, i) => i !== idx);
                        setOptions(newOpts);
                        if (correctIndex === idx) setCorrectIndex(null);
                        else if (correctIndex > idx) setCorrectIndex(correctIndex - 1);
                      }}
                      sx={{ 
                        ml: isXsScreen ? 0 : 1,
                        mt: isXsScreen ? 1 : 0,
                        width: isXsScreen ? '100%' : 'auto'
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
              </RadioGroup>
              
            
            </DialogContent>
            <DialogActions sx={{
              flexDirection: isXsScreen ? 'column' : 'row',
              gap: 1,
              p: 2,
            }}>
              <Button
                onClick={handleClose}
                sx={{ width: isXsScreen ? '100%' : 'auto' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                sx={{ width: isXsScreen ? '100%' : 'auto' }}
              >
                {currentQuestion ? 'Update Question' : 'Create Question'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default QuestionManager;