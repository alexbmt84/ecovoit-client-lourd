import {useState, ChangeEvent, FormEvent} from 'react';
import axios from 'axios';
import Button from "@mui/material/Button";
import {Input, Box} from "@mui/material";

const UploadCsv: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('access_token');
    }

    return null;

  };

  const token = getToken();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file first!');

      return;
    }

    const formData = new FormData();
    formData.append('csv_file', file);

    try {
      const response = await axios.post('https://api.ecovoit.tech/api/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      alert(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.error);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{display: 'flex', alignItems: 'center', gap: 2, marginBottom: 5}}>
      <Input
        type="file"
        name="csv_file"
        onChange={handleFileChange}
        sx={{display: 'none'}}
        id="upload-button-file"
      />
      <label htmlFor="upload-button-file">
        <Button variant="contained" component="span">
          Parcourir
        </Button>
      </label>
      <Button variant="contained" type="submit" color="primary">
        Upload CSV
      </Button>
    </Box>
  );
};

export default UploadCsv;
