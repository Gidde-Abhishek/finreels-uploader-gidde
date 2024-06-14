import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Autocomplete,
  Pagination,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { Movie as MovieIcon } from '@mui/icons-material';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

function App() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [reels, setReels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const reelsPerPage = 5;
  const { width, height } = useWindowSize();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.post('http://finx.choiceindia.com/api/md/Data/MostActiveByIndex', {
          IndexId: 26012,
          SegmentId: 1,
          MarketDataType: 1
        });
        const stockList = response.data.Response.MostActiveList.map(stock => ({
          label: stock.SecDesc,
          value: `1@${stock.Token}`,
        }));
        setStocks(stockList);
      } catch (error) {
        console.error('Failed to fetch stock data:', error);
      }
    };

    const fetchReels = async () => {
      try {
        const response = await axios.get('http://ec2-13-233-164-59.ap-south-1.compute.amazonaws.com/reels-latest');
        setReels(response.data);
        setTotalPages(Math.ceil(response.data.length / reelsPerPage));
      } catch (error) {
        console.error('Failed to fetch latest reels:', error);
      }
    };

    fetchStocks();
    fetchReels();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !caption || !selectedStock) {
      alert('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);
    formData.append('stock_identifier', selectedStock.value);

    setUploading(true);
    setUploadSuccess(false);

    try {
      await axios.post('http://ec2-13-233-164-59.ap-south-1.compute.amazonaws.com/feature-reel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 5000); // Hide confetti after 5 seconds
    } catch (error) {
      setUploading(false);
      alert(`Failed to upload reel reason: ${error}`);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getCurrentPageReels = () => {
    const startIndex = (currentPage - 1) * reelsPerPage;
    const endIndex = startIndex + reelsPerPage;
    return reels.slice(startIndex, endIndex);
  };

  return (
    <Container maxWidth="sm">
      {uploadSuccess && <Confetti width={width} height={height} />}
      <Box my={4} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Upload Your Reel
        </Typography>
      </Box>
      <Card>
        <CardContent>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <Autocomplete
              options={stocks}
              getOptionLabel={(option) => option.label}
              onChange={(e, newValue) => setSelectedStock(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Stock Identifier" variant="outlined" fullWidth />
              )}
            />
          </Box>
          <Box mb={2}>
            <input
              accept="video/*"
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="raised-button-file"
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="contained"
                component="span"
                fullWidth
              >
                Choose File
              </Button>
            </label>
          </Box>
          {file && (
            <Typography variant="body2" color="textSecondary">
              Selected File: {file.name}
            </Typography>
          )}
          {uploading && <LinearProgress />}
          {uploadSuccess && (
            <Typography variant="body2" color="primary">
              Reel uploaded successfully!
            </Typography>
          )}
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={uploading}
              fullWidth
            >
              Upload Reel
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Box my={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Latest Reels
        </Typography>
        <List>
          {getCurrentPageReels().map((reel) => (
            <ListItem key={reel.reel_id}>
              <ListItemAvatar>
                <Avatar>
                  <MovieIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={reel.caption}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      URL: {reel.media_url}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="textPrimary">
                      Stock Identifier: {reel.stock_identifier}
                    </Typography>
                    <br />
                    Likes: {reel.likes}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
        </Box>
      </Box>
      <Box my={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              Developed by Abhishek Chandrakant Gidde
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Email: abhishek.gidde@choicetechlab.com
            </Typography>
            <Box mt={2}>
              <Typography variant="body1" color="textPrimary">
                "The present is theirs; the future, for which I really worked, is mine." - Nikola Tesla
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default App;
