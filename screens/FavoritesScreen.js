import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FavoritesScreen = () => {
  // Sample favorite items (in a real app, this would come from AsyncStorage or a database)
  const [favoriteItems, setFavoriteItems] = useState([
    {
      id: '1',
      name: 'Banana',
      category: 'Fruits',
      expiryDate: '26 March 2025',
      daysUntilExpiry: 2,
      image: require('../assets/banana.png'),
    },
    {
      id: '3',
      name: 'Succulent Large Chicken',
      category: 'Meat',
      expiryDate: '26 March 2025',
      daysUntilExpiry: 5,
      image: require('../assets/chicken.png'),
    },
  ]);

  // Remove item from favorites
  const removeFromFavorites = (id) => {
    setFavoriteItems(favoriteItems.filter(item => item.id !== id));
  };

  // Get progress bar color based on days until expiry
  const getProgressBarColor = (days) => {
    if (days <= 2) return '#FF6347'; // Red for items expiring soon
    if (days <= 5) return '#FFA500'; // Orange for items expiring in a few days
    return '#4CAF50'; // Green for items with longer expiry
  };

  // Get progress bar width based on days until expiry
  const getProgressBarWidth = (days) => {
    if (days <= 2) return '30%';
    if (days <= 5) return '60%';
    return '90%';
  };

  // Render favorite item
  const renderFavoriteItem = ({ item }) => (
    <View style={styles.favoriteItemContainer}>
      <Image source={item.image} style={styles.favoriteImage} />
      
      <View style={styles.favoriteInfoContainer}>
        <View style={styles.dateContainer}>
          <Icon name="access-time" size={16} color="#FF6347" />
          <Text style={styles.dateText}>{item.expiryDate}</Text>
        </View>
        
        <Text style={styles.categoryLabel}>{item.category}</Text>
        <Text style={styles.favoriteName}>{item.name}</Text>
        
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { 
                backgroundColor: getProgressBarColor(item.daysUntilExpiry),
                width: getProgressBarWidth(item.daysUntilExpiry)
              }
            ]}
          />
          <Text style={styles.expiryText}>Expire in {item.daysUntilExpiry} days</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeFromFavorites(item.id)}
      >
        <Icon name="close" size={20} color="#FF6347" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>
      
      {favoriteItems.length > 0 ? (
        <FlatList
          data={favoriteItems}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="favorite-border" size={80} color="#DDD" />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>Items you mark as favorite will appear here</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    backgroundColor: 'rgba(255, 99, 71, 0.95)',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#FF6347',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
    backdropFilter: 'blur(10px)',
  },
  listContainer: {
    padding: 20,
  },
  favoriteItemContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  favoriteImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  favoriteInfoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryLabel: {
    fontSize: 12,
    color: '#FF6347',
    backgroundColor: 'rgba(255, 99, 71, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
    borderWidth: 1,
    borderColor: 'rgba(255, 99, 71, 0.2)',
  },
  progressBarContainer: {
    height: 24,
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBar: {
    height: '100%',
    borderRadius: 12,
    opacity: 0.9,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: 20,
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    backdropFilter: 'blur(8px)',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  listContainer: {
    padding: 20,
  },
  favoriteItemContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    backdropFilter: 'blur(10px)',
  },
  favoriteImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  favoriteInfoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 6,
    fontWeight: '500',
    letterSpacing: 0.25,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#FF6347',
    backgroundColor: 'rgba(255, 99, 71, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  favoriteName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  progressBarContainer: {
    height: 24,
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    borderRadius: 12,
    opacity: 0.9,
  },
  expiryText: {
    position: 'absolute',
    right: 12,
    top: 4,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: 'rgba(255, 99, 71, 0.1)',
    borderRadius: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 24,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    letterSpacing: 0.25,
  },
});

export default FavoritesScreen;