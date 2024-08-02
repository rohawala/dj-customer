import React, {useEffect, useState } from 'react';
import { json, NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import {signout} from './api/internal'
const SidebarContainer = styled.div`
  width: ${({ isOpen }) => (isOpen ? '260px' : '260px')};
  height: 100vh;
  background: #2c2c2c;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: fixed;
  transition: width 0.3s, display 0.3s;
  @media (max-width: 768px) {
    width: ${({ isOpen }) => (isOpen ? '250px' : '0')};
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    overflow: hidden;
  }
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  img {
    width: 80px;
    height: auto;
  }
`;

const SidebarLink = styled(NavLink)`
  margin: 10px 0;
  padding: 10px;
  color: #fff;
  text-decoration: none;
  &.active {
    background: #ff69b4;
    border-radius: 8px;
  }
  &:hover {
    color: #f0f0f0;
  }
`;

const ToggleButton = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: block;
    position: absolute;
    top: 20px;
    left: 20px;
    background: #2c2c2c;
    color: #fff;
    border: none;
    cursor: pointer;
    padding: 10px;
    border-radius: 8px;
  }
`;

const LogoutButton = styled.button`
  margin-top: 20vh;
  width: 100%;
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #dc3545;
  border: none;
  border-radius: 8px;
  &:hover {
    background-color: #c82333;
  }
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  // const user = useSelector((state) => state.user);
  
  const user = localStorage.getItem('user');
  const parsedUser = JSON.parse(user);
  useEffect(() => {
    if (user) {
      try {
        
        console.log('Parsed user:', parsedUser);
        setIsAuthenticated(parsedUser.isVerified);
        console.log('Authenticated:', parsedUser.isVerified);
      } catch (error) {
        console.error('Error parsing local storage item:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    // Perform logout actions here, if any (e.g., clearing authentication tokens)
    setIsOpen(false);
    navigate('/');
  };

  return (
    <>
      <ToggleButton onClick={() => setIsOpen(!isOpen)}>☰</ToggleButton>
      <SidebarContainer isOpen={isOpen}>
        <Logo>
          <img src="https://th.bing.com/th/id/OIP.Sc-pGDkmKH6dLZgbWk-3uAAAAA?rs=1&pid=ImgDetMain" alt="Logo" />
        </Logo>
        <SidebarLink exact to="/dashboard" activeClassName="active" onClick={() => setIsOpen(false)}>
          Dashboard
        </SidebarLink>
        {parsedUser.user_type === 'dj' ? (
          <>
            <SidebarLink to="/song-status" activeClassName="active" onClick={() => setIsOpen(false)}>
              Song Status
            </SidebarLink>
            
        <SidebarLink to="/upload" activeClassName="active" onClick={() => setIsOpen(false)}>
          Upload Songs
        </SidebarLink>
          </>
        ) : (
          <>
            <SidebarLink to="/requests" activeClassName="active" onClick={() => setIsOpen(false)}>
              Request Songs
            </SidebarLink>
            <SidebarLink to="/approved" activeClassName="active" onClick={() => setIsOpen(false)}>
              Approved Songs
            </SidebarLink>
          </>
        )}
        <SidebarLink to="/profile" activeClassName="active" onClick={() => setIsOpen(false)}>
          Profile
        </SidebarLink>
        <LogoutButton onClick={handleLogout} className="logout-button">
          Logout
        </LogoutButton>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
