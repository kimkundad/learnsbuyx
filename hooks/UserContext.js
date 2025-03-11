import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api'; // Axios instance
import { useNavigation } from '@react-navigation/native'; // React Navigation

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const navigation = useNavigation(); // Access navigation
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const dataUser = await AsyncStorage.getItem('user_profile');
      //  console.log('📢 Retrieved user profile:', dataUser);
  
        if (dataUser) {
          setUserProfile(JSON.parse(dataUser));
        }
      } catch (error) {
        console.error('❌ Failed to retrieve user profile:', error);
      } finally {
        setLoading(false);  // ✅ โหลดเสร็จ
      }
    };
  
    fetchUserProfile();
  }, []);

  // ✅ ใช้ useEffect เพื่อตรวจสอบว่า userProfile เปลี่ยนแปลง
  useEffect(() => {
   // console.log("🔄 userProfile Updated:", userProfile);
  }, [userProfile]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('jwt_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user_profile');
      setUserProfile(null);

      // Navigate to login screen or another appropriate action
      navigation.navigate('(aLogin)'); // Ensure 'Login' matches your route name
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, logout, loading  }}>
      {children}
    </UserContext.Provider>
  );
};