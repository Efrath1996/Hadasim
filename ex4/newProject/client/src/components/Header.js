import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-primary text-white mb-4 shadow-sm">
      <div className="container d-flex justify-content-between align-items-center flex-wrap py-3">
        <h2>MyShop</h2>
        <div className="d-flex justify-content-between">
            <div className="d-flex flex-column text-center me-3">
                <h5 className="mb-0"> Hello {user?.contactName}</h5>
                <span>{user?.companyName}</span>
            </div>
            <button className="btn btn-outline-light btn-sm align-self-center mt-2 mt-md-0" onClick={logout}>
            Logout
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
