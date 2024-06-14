import React, { useState } from 'react';
import * as MuiTextField from '@mui/material/TextField';
import * as MuiButton from '@mui/material/Button';

const UploadForm = ({ onSubmit }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(file, caption);
  };

  return (
    <form onSubmit={handleSubmit}>
      <MuiTextField
        type="file"
        label="Select Video"
        onChange={handleFileChange}
        required
      />
      <MuiTextField
        label="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        multiline
        rows={4}
      />
      <MuiButton variant="contained" type="submit">
        Upload Reel
      </MuiButton>
    </form>
  );
};

export default UploadForm;
