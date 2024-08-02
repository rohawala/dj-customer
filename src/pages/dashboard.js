import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Side from './side';
import { getAlldj, getAllreq,updateRequestStatus } from '../api/internal';
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 270px;
`;

const StatisticsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StatisticCard = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px;
  flex: 1;
  text-align: center;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    color: black;
  }
`;

const ButtonContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Button = styled.button`
  background-color: #12040B;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DropdownMenu = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
  button {
    display: block;
    padding: 10px;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    &:hover {
      background-color: #eee;
    }
  }
`;

const Dashboard = () => {
  const [djData, setDjData] = useState([]);
  const [totalSongs, setTotalSongs] = useState(0);
  const [totalDjs, setTotalDjs] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [User, setUser] = useState(null);
  const [reqData, setReqData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [actionState, setActionState] = useState({}); // Track action state

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localHttp = 'https://wishtun-d5e089f27132.herokuapp.com/admin';

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUser(parsedUser);
        setIsAuthenticated(parsedUser.isVerified);
      } catch (error) {
        console.error('Error parsing local storage item:', error);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllreq();
        if (response.status === 200) {
          const data = response.data.data;
          const user = JSON.parse(localStorage.getItem('user'));
          const filteredData = data.filter(req => req.djId === user.userId);
          setReqData(filteredData);
        }

        const statsResponse = await axios.get(`${localHttp}/song/`);
        if (statsResponse.data.success) {
          const songData = statsResponse.data.data.getSongsCount;
          setTotalSongs(songData);
        }

        const statsDJResponse = await axios.get(`${localHttp}/dj/`);
        if (statsDJResponse.data.success) {
          const djCount = statsDJResponse.data.data.djCount;
          setTotalDjs(djCount);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAlldj();
        if (response.status === 200) {
          const data = response.data.data;
          setDjData(data);
          setTotalDjs(data.length);
        }

        const statsResponse = await axios.get(`${localHttp}/song/`);
        if (statsResponse.data.success) {
          const songData = statsResponse.data.data.getSongsCount;
          setTotalSongs(songData);
        }

        const statsDJResponse = await axios.get(`${localHttp}/dj/`);
        if (statsDJResponse.data.success) {
          const djCount = statsDJResponse.data.data.djCount;
          setTotalDjs(djCount);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAction = async (reqId, action) => {
    try {
      const response = await updateRequestStatus({reqId}, {
        deliver_status: action === 'accept' ? 'Approved' : 'Rejected',
      });

      if (response.status === 200) {
        setReqData(prevReqData =>
          prevReqData.map(req =>
            req.id === reqId ? { ...req, deliver_status: action === 'accept' ? 'Approved' : 'Rejected' } : req
          )
        );
        setActionState(prev => ({ ...prev, [reqId]: action === 'accept' ? 'Approved' : 'Rejected' }));
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
    setActiveDropdown(null);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(prev => (prev === index ? null : index));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Side />
      {User && User.user_type === "dj" ? (
        <DashboardContainer>
          <StatisticsContainer>
            <StatisticCard>
              <h3>DJ Songs</h3>
              <p>{totalSongs}</p>
            </StatisticCard>
            <StatisticCard>
              <h3>DJs</h3>
              <p>{totalDjs}</p>
            </StatisticCard>
          </StatisticsContainer>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Song Name</th>
                  <th>Customer Name</th>
                  <th>Duration</th>
                  <th>Requests</th>
                </tr>
              </thead>
              <tbody>
                {reqData.map((req, index) => (
                  <tr key={index}>
                    <td>{req.Songname}</td>
                    <td>{req.customerUsername}</td>
                    <td>{req.duration}</td>
                    <td>
                      <ButtonContainer>
                        <Button onClick={() => toggleDropdown(index)}>
                          {activeDropdown === index ? 'Accept' : 'Reject'}
                          <span>▼</span>
                        </Button>
                        {activeDropdown === index && (
                          <DropdownMenu show={activeDropdown === index}>
                            <button onClick={() => handleAction(req.id, 'accept')}>Accept</button>
                            <button onClick={() => handleAction(req.id, 'reject')}>Reject</button>
                          </DropdownMenu>
                        )}
                      </ButtonContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </DashboardContainer>
      ) : (
        <DashboardContainer>
          <StatisticsContainer>
            <StatisticCard>
              <h3>Customer Songs</h3>
              <p>{totalSongs}</p>
            </StatisticCard>
            <StatisticCard>
              <h3>DJs</h3>
              <p>{totalDjs}</p>
            </StatisticCard>
          </StatisticsContainer>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>DJ Name</th>
                  <th>Total Songs</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {djData.map((dj, index) => (
                  <tr key={index}>
                    <td>{dj.username}</td>
                    <td>{dj.songsCount}</td>
                    <td>{dj.email}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </DashboardContainer>
      )}
    </>
  );
};

export default Dashboard;
