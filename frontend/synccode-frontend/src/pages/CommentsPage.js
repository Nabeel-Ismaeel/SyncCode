import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import axios from '../utils/axiosInstance';

const CommentsPage = () => {
  const { projectID } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/comment/allComments/${projectID}`);
      setComments(data);
    } catch (err) {
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      await axios.post('/comment/addComment', {
        comment: newComment,
        projectID
      });
      setNewComment('');
      fetchComments(); // refresh list
    } catch (err) {
      setError('Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [projectID]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        💬 Project Comments
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2} mb={4}>
            {comments.length > 0 ? (
              comments.map((comment, idx) => (
                <Card key={idx} variant="outlined" sx={{ bgcolor: '#f9f9f9' }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {comment.comment}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      – {comment.author}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No comments yet. Be the first!
              </Typography>
            )}
          </Stack>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              multiline
              maxRows={4}
            />
            <Button
              variant="contained"
              onClick={handleAddComment}
              disabled={posting}
            >
              {posting ? 'Posting...' : 'Send'}
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default CommentsPage;
