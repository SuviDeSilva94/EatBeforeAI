import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
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
  listContainer: {
    padding: 20,
  },
  favoriteItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  favoriteInfoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
  expiryText: {
    position: 'absolute',
    right: 10,
    top: 2,
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  removeButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default FavoritesScreen;