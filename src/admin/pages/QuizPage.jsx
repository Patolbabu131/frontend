import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, CircularProgress, Card, CardContent,
  Radio, RadioGroup, FormControlLabel, Container, Stepper, Step, StepLabel,
  Alert, IconButton, ThemeProvider, CssBaseline, alpha
} from '@mui/material';
import { ArrowBack, CheckCircle, Cancel } from '@mui/icons-material';
import { BASE_URL } from '../../assets/config';
import { createTheme } from '@mui/material/styles';

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
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
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
            boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

const QuizPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const authHeaders = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${BASE_URL}/questions/course/${courseId}`, {
          headers: authHeaders
        });
        const { data } = await res.json();
        setQuestions(data);
        setSelectedAnswers(new Array(data.length).fill(null));
      } catch (err) {
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [courseId]);

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      const correctIndex = question.options.findIndex(opt => opt.isCorrect);
      if (selectedAnswers[index] === correctIndex) {
        correct++;
      }
    });
    setScore((correct / questions.length) * 100);
    setShowResult(true);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : error ? (
          <Container maxWidth="md" sx={{ mt: 4 }}>
            <Alert severity="error" sx={{ bgcolor: '#2d2d2d' }}>{error}</Alert>
            <Button
              sx={{ mt: 2, color: 'text.primary' }}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Container>
        ) : showResult ? (
          <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom color="textPrimary">
                Quiz Results
              </Typography>
              <Typography variant="h5" color="primary.main" sx={{ mb: 3 }}>
                Score: {score.toFixed(1)}%
              </Typography>

              {questions.map((question, index) => {
                const correctIndex = question.options.findIndex(opt => opt.isCorrect);
                const isCorrect = selectedAnswers[index] === correctIndex;

                return (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="h6" color="textPrimary">
                      {index + 1}. {question.questionText}
                      {isCorrect ? (
                        <CheckCircle color="success" sx={{ ml: 1 }} />
                      ) : (
                        <Cancel color="error" sx={{ ml: 1 }} />
                      )}
                    </Typography>

                    {question.options.map((option, optIndex) => (
                      <Box
                        key={optIndex}
                        sx={{
                          ml: 2,
                          p: 1,
                          backgroundColor: optIndex === correctIndex
                            ? alpha('#388e3c', 0.2) // Dark theme green
                            : optIndex === selectedAnswers[index]
                            ? alpha('#d32f2f', 0.2) // Dark theme red
                            : 'transparent',
                          borderRadius: 1,
                          border: `1px solid ${darkTheme.palette.divider}`
                        }}
                      >
                        <Typography color="textSecondary">
                          {String.fromCharCode(65 + optIndex)}. {option.optionText}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                );
              })}

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                {score >= 50 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/CertificateGenerator/${courseId}`)}
                  >
                    Get Certificate
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/lessonslist/${courseId}`)}
                    sx={{ color: 'text.primary' }}
                  >
                    Back to Course
                  </Button>
                )}
              </Box>
            </Card>
          </Container>
        ) : (
          <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <IconButton 
                onClick={() => navigate(-1)} 
                sx={{ 
                  mr: 2,
                  color: 'text.primary'
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" color="textPrimary">
                Question {currentQuestion + 1} of {questions.length}
              </Typography>
            </Box>

            <Stepper 
              activeStep={currentQuestion} 
              alternativeLabel 
              sx={{ 
                mb: 4,
                '& .MuiStepLabel-label': {
                  color: 'text.secondary !important'
                }
              }}
            >
              {questions.map((_, index) => (
                <Step key={index}>
                  <StepLabel>{index + 1}</StepLabel>
                </Step>
              ))}
            </Stepper>


            {questions[currentQuestion] && (
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom color="textPrimary">
                  {questions[currentQuestion].questionText}
                </Typography>

                <RadioGroup
                  value={selectedAnswers[currentQuestion]}
                  onChange={(e) => handleAnswerSelect(Number(e.target.value))}
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={index}
                      control={<Radio sx={{ color: 'text.secondary' }} />}
                      label={
                        <Typography color="textSecondary">
                          {String.fromCharCode(65 + index)}. {option.optionText}
                        </Typography>
                      }
                      sx={{ 
                        mb: 1,
                        '&:hover': {
                          backgroundColor: alpha('#90caf9', 0.1),
                          borderRadius: 1
                        }
                      }}
                    />
                  ))}
                </RadioGroup>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    sx={{ color: 'text.primary' }}
                  >
                    Previous
                  </Button>

                  {currentQuestion === questions.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={calculateScore}
                      disabled={selectedAnswers[currentQuestion] === null}
                    >
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNextQuestion}
                      disabled={selectedAnswers[currentQuestion] === null}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Card>
            )}
          </Container>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default QuizPage;