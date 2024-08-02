import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Side from './side';
import { postSong, getAllSongs } from '../api/internal';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 20px;
`;


const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
`;

const CreateButton = styled.button`
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-bottom: 20px;
  cursor: pointer;
`;

const Modal = styled.div`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
  @media (max-width: 786px) {
    width: 80%;
  }
`;

const CloseButton = styled.span`
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;

  &:hover,
  &:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;

const UploadSongs = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [formData, setFormData] = useState({
    songName: '',
    songPrice: '',
    songDuration: '',
    ownerName: '',
    ownerEmail: '',
  });
  const [file, setFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const token = useSelector(state => state.user.token); // Fetch the token from the Redux store
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAllSongs(token);
      if (response.status) {
        setSongs(response.data.data);
      } else {
        console.error('Error fetching songs:', response.message);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'audio/mpeg') {
      alert('Only .mp3 files are allowed!');
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataUpload = new FormData();
    formDataUpload.append('name', formData.songName);
    formDataUpload.append('price', formData.songPrice);
    formDataUpload.append('duration', formData.songDuration);
    formDataUpload.append('audioFile', file);

    try {
      const response = await postSong(formDataUpload, token); // Pass formData and token separately
      if (response.status === 200) {
        navigate('/dashboard');
      } else if (response.code === 'ERR_BAD_REQUEST') {
        console.error(response.response.data.message);
      }
    } catch (error) {
      console.error('Error uploading song:', error);
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className='duploadsong'>
      <div className='d1uploadsong'>
        <Side />
      </div>

      <div className='d2uploadsong'>
        <div className='d3uploadsong'>
          <CreateButton onClick={openModal}>Create</CreateButton>

          <Modal isOpen={isOpen}>
            <ModalContent>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Song Name</label>
                  <input
                    type="text"
                    name="songName"
                    placeholder="Name.."
                    value={formData.songName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Song Price</label>
                  <input
                    type="text"
                    name="songPrice"
                    placeholder="Price.."
                    value={formData.songPrice}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Song File Upload</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="form-group">
                  <label>Song Duration</label>
                  <input
                    type="text"
                    name="songDuration"
                    placeholder="00:01"
                    value={formData.songDuration}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Owner Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    placeholder="Owner Name.."
                    value={formData.ownerName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Owner Email</label>
                  <input
                    type="email"
                    name="ownerEmail"
                    placeholder="Owner Email.."
                    value={formData.ownerEmail}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="upload-button">Upload</button>
              </form>
            </ModalContent>
          </Modal>

          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Song Name</th>
                  <th>Price</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song, index) => (
                  <tr key={song._id}>
                    <td>{song.name}</td>
                    <td>{song.price}</td>
                    <td>{song.duration}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default UploadSongs;
