import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('User Name');
  const [userEmail, setUserEmail] = useState('user@example.com');
  
  useEffect(() => {
    // Load user data from AsyncStorage
    const loadUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        const email = await AsyncStorage.getItem('userEmail');
        
        if (name) setUserName(name);
        if (email) setUserEmail(email);
      } catch (error) {
        console.log('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);
  
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              // Clear user token and navigate to Login screen
              await AsyncStorage.removeItem('userToken');
              navigation.replace('Login');
            } catch (error) {
              console.log('Error during logout:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>{userName.charAt(0)}</Text>
          </View>
          <TouchableOpacity style={styles.editImageButton}>
            <Icon name="edit" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
      </View>
      
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="person" size={24} color="#FF6347" style={styles.settingIcon} />
          <Text style={styles.settingText}>Edit Profile</Text>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="notifications" size={24} color="#FF6347" style={styles.settingIcon} />
          <Text style={styles.settingText}>Notifications</Text>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="lock" size={24} color="#FF6347" style={styles.settingIcon} />
          <Text style={styles.settingText}>Privacy & Security</Text>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="language" size={24} color="#FF6347" style={styles.settingIcon} />
          <Text style={styles.settingText}>Language</Text>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="help" size={24} color="#FF6347" style={styles.settingIcon} />
          <Text style={styles.settingText}>Help & Support</Text>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="info" size={24} color="#FF6347" style={styles.settingIcon} />
          <Text style={styles.settingText}>About</Text>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="exit-to-app" size={24} color="#FFF" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF6347',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF6347',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6347',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  settingsSection: {
    backgroundColor: '#FFF',
    marginTop: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6347',
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default ProfileScreen;