import React, { createContext, useState } from 'react';
import { backendApi } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
  );

  const login = async (email, password) => {
    const { data } = await backendApi.post('/auth/login', { email, password });
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const register = async (name, email, password) => {
    const { data } = await backendApi.post('/auth/register', { name, email, password });
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
