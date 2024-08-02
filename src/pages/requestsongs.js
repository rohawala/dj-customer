import React, { useState, useEffect } from 'react';
import { getAllSongs, reqSong } from '../api/internal';
import Side from './side';
import { useSelector } from 'react-redux';

const RequestSongs = () => {
    const [filter, setFilter] = useState('');
    const [songs, setSongs] = useState([]);
    const [buttonText, setButtonText] = useState({});
    const [buttonDisabled, setButtonDisabled] = useState({});

    const token = useSelector(state => state.user.token);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await getAllSongs(token);
                if (response.status) {
                    setSongs(response.data.data);

                    // Initialize button text and disabled state based on song deliver status
                    const initialButtonText = {};
                    const initialButtonDisabled = {};
                    response.data.data.forEach(song => {
                        initialButtonText[song._id] = song.deliver_status === "submitted" ? "submitted" : "Request";
                        initialButtonDisabled[song._id] = song.deliver_status === "submitted";
                    });
                    setButtonText(initialButtonText);
                    setButtonDisabled(initialButtonDisabled);
                } else {
                    console.error('Error fetching songs:', response.message);
                }
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        };

        fetchSongs();
    }, [token]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleRequest = async (songId) => {
        const user = localStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        const userId = parsedUser.userId;

        try {
            const data = {
                songId,
                userId,
                deliver_status: "submitted",
            };

            const response = await reqSong(data);
            console.log(songs);

            if (response.status) {
                // Update button text and disable status to reflect the new deliver_status
                setButtonText(prevState => ({ ...prevState, [songId]: 'submitted' }));
                setButtonDisabled(prevState => ({ ...prevState, [songId]: true }));
                alert('Request created successfully');
            } else {
                console.error('Error creating request:', response.message);
            }
        } catch (error) {
            console.error('Error creating request:', error);
        }
    };

    const filteredSongs = songs.filter(song => song.username.toLowerCase().includes(filter.toLowerCase()));

    return (
        <>
            <Side />
            <div style={{ padding: '20px', marginLeft: '270px' }}>
                <h1 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Hello Evano 👋
                    <input
                        type="text"
                        placeholder="Filter by DJ Name..."
                        value={filter}
                        onChange={handleFilterChange}
                        style={{
                            marginLeft: 'auto',
                            padding: '10px',
                            width: '300px',
                            boxSizing: 'border-box'
                        }}
                    />
                </h1>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: 'solid black 1px' }}>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: 'none' }}>Song Name</th>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: 'none' }}>DJ Name</th>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: 'none' }}>Duration</th>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: 'none' }}>Price</th>
                                <th style={{ padding: '10px', textAlign: 'left', borderBottom: 'none' }}>User Request</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSongs.map((song, index) => (
                                <tr key={index}>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>{song.name}</td>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>{song.username}</td>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>{song.duration}</td>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>{song.price}</td>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>
                                        <button 
                                            style={{
                                                backgroundColor: buttonDisabled[song._id] ? 'grey' : 'black',
                                                color: 'white',
                                                padding: '10px',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: buttonDisabled[song._id] ? 'not-allowed' : 'pointer'
                                            }}
                                            onClick={() => handleRequest(song._id)}
                                            disabled={buttonDisabled[song._id]}
                                        >
                                            {buttonText[song._id] || 'Request'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default RequestSongs;
