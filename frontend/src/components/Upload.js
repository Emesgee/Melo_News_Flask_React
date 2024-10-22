import React, { useState, useEffect } from 'react';
import './Upload.css'; // Import the CSS file for styling

const GeneralInfoForm = ({ title, setTitle, tags, setTags, subject, setSubject }) => {
  return (
    <div className="general-info-form">
      <h3>General Information</h3>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Tags:</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div>
        <label>Subject:</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
    </div>
  );
};

const LocationForm = ({ city, setCity, country, setCountry }) => {
  return (
    <div className="location-form">
      <h3>Location Information</h3>
      <div>
        <label>City:</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div>
        <label>Country:</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
    </div>
  );
};

const FileUploadForm = ({ fileTypes, fileTypeId, setFileTypeId, handleFileChange }) => {
  return (
    <div className="file-upload-form">
      <h3>File Upload</h3>
      <div>
        <label>File Type:</label>
        <select
          value={fileTypeId}
          onChange={(e) => setFileTypeId(e.target.value)}
          required
        >
          <option value="" disabled>Select a file type</option>
          {fileTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.type_name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>File:</label>
        <input type="file" onChange={handleFileChange} required />
      </div>
    </div>
  );
};

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [subject, setSubject] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [fileTypeId, setFileTypeId] = useState('');
  const [fileTypes, setFileTypes] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const MAX_FILE_SIZE = 20 * 1024 * 1024;
  const ALLOWED_FILE_TYPES = [
    'image/jpeg', 'image/png', 'image/gif',
    'video/mp4', 'video/mpeg', 'video/ogg',
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  useEffect(() => {
    const fetchFileTypes = async () => {
      try {
        const response = await fetch('/api/file-types');
        const data = await response.json();
        setFileTypes(data);
      } catch (error) {
        setMessage('Error fetching file types');
      }
    };
    fetchFileTypes();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setMessage('No file selected. Please choose a file.');
      return;
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setMessage('Invalid file type. Please choose a supported file.');
      setSelectedFile(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setMessage('File is too large. Maximum size allowed is 20MB.');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('Please select a valid file to upload.');
      return;
    }
    if (!fileTypeId) {
      setMessage('Please select a file type.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You need to log in first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('tags', tags);
    formData.append('subject', subject);
    formData.append('city', city);
    formData.append('country', country);
    formData.append('file_type_id', fileTypeId);
    try {
      setIsLoading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        setMessage('File uploaded successfully!');
      } else {
        setMessage('Failed to upload file.');
      }
    } catch (error) {
      setMessage('An error occurred while uploading the file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>File Upload</h2>
      <form onSubmit={handleSubmit}>
        <GeneralInfoForm title={title} setTitle={setTitle} tags={tags} setTags={setTags} subject={subject} setSubject={setSubject} />
        <LocationForm city={city} setCity={setCity} country={country} setCountry={setCountry} />
        <FileUploadForm fileTypes={fileTypes} fileTypeId={fileTypeId} setFileTypeId={setFileTypeId} handleFileChange={handleFileChange} />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
