import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('User');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [groceryItems, setGroceryItems] = useState([]);

  // Sample grocery items data
  const sampleGroceryItems = [
    {
      id: '1',
      name: 'Banana',
      category: 'Fruits',
      expiryDate: '2024-02-10',
      daysUntilExpiry: 7,
      imageUri: require('../assets/banana.png')
    },
    {
      id: '2',
      name: 'Chicken Breast',
      category: 'Meat',
      expiryDate: '2024-02-05',
      daysUntilExpiry: 2,
      imageUri: require('../assets/chicken.png')
    },
    {
      id: '3',
      name: 'Milk',
      category: 'Dairy',
      expiryDate: '2024-02-08',
      daysUntilExpiry: 5,
      imageUri: require('../assets/chocolate.png')
    },
    {
      id: '4',
      name: 'Fresh Apples',
      category: 'Fruits',
      expiryDate: '2024-02-20',
      daysUntilExpiry: 15,
      imageUri: require('../assets/banana.png')
    },
    {
      id: '5',
      name: 'Yogurt',
      category: 'Dairy',
      expiryDate: '2024-02-06',
      daysUntilExpiry: 3,
      imageUri: require('../assets/chocolate.png')
    }
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'vegetables', name: 'Vege' },
    { id: 'meat', name: 'Meat' },
    { id: 'frozen', name: 'Frozen' },
    { id: 'dairy', name: 'Dairy' },
  ];

  const scaleAnims = useRef(categories.map(() => new Animated.Value(1))).current;

  const animateCategory = (index, selected) => {
    Animated.spring(scaleAnims[index], {
      toValue: selected ? 1.05 : 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true
    }).start();
  };

  // Load grocery items from AsyncStorage
  const loadGroceryItems = async () => {
    try {
      // Always initialize with sample data
      await AsyncStorage.setItem('groceryItems', JSON.stringify(sampleGroceryItems));
      setGroceryItems(sampleGroceryItems);
    } catch (error) {
      console.error('Error loading grocery items:', error);
      // Fallback to sample data if there's an error
      setGroceryItems(sampleGroceryItems);
    }
  };

  useEffect(() => {
    // Load user name from AsyncStorage
    const loadUserName = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        if (name) {
          setUserName(name.split(' ')[0]); // Get first name only
        }
      } catch (error) {
        console.log('Error loading user name:', error);
      }
    };

    loadUserName();
    loadGroceryItems();

    // Add focus listener to reload items when returning from AddGrocery
    const unsubscribe = navigation.addListener('focus', () => {
      loadGroceryItems();
    });

    return unsubscribe;
  }, [navigation]);

  // Filter items based on selected category and search query
  const filteredItems = groceryItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get progress bar color based on days until expiry
  const getProgressBarColor = (days) => {
    if (days <= 2) return '#FF4646';
    if (days <= 7) return '#FFA500';
    return '#4CAF50';
  };

  // Get progress bar width based on days until expiry
  const getProgressBarWidth = (days) => {
    if (days <= 2) return '25%';
    if (days <= 7) return '55%';
    return '85%';
  };

  // Render grocery item
  const renderGroceryItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.groceryItemContainer, { transform: [{ scale: 1 }] }]}
      activeOpacity={0.9}
    >
      <View style={styles.imageWrapper}>
        <Image 
          source={typeof item.imageUri === 'string' ? { uri: item.imageUri } : item.imageUri} 
          style={styles.groceryImage} 
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      
      <View style={styles.groceryInfoContainer}>
        <Text style={styles.groceryName}>{item.name}</Text>
        
        <View style={styles.dateContainer}>
          <Icon name="event" size={16} color="#FF6347" />
          <Text style={styles.dateText}>{item.expiryDate}</Text>
        </View>
        
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
          <View style={styles.expiryContainer}>
            <Icon name="timer" size={14} color="#FFF" />
            <Text style={styles.expiryText}>{item.daysUntilExpiry} days left</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hey {userName},</Text>
        <Text style={styles.greetingBold}>Good Afternoon!</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Icon name="close" size={16} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.categoriesSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { fontSize: 20, fontWeight: '700' }]}>Categories</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={[styles.seeAllText, { fontSize: 15 }]}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScrollView}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.name && styles.selectedCategoryButton,
                { transform: [{ scale: selectedCategory === category.name ? 1.05 : 1 }] }
              ]}
              onPress={() => setSelectedCategory(category.name)}
              activeOpacity={0.8}
            >
              <View style={styles.categoryIconContainer}>
                <Icon 
                  name={category.id === 'fruits' ? 'local-florist' :
                        category.id === 'vegetables' ? 'eco' :
                        category.id === 'meat' ? 'restaurant' :
                        category.id === 'dairy' ? 'opacity' :
                        category.id === 'frozen' ? 'ac-unit' : 'category'} 
                  size={24} 
                  color={selectedCategory === category.name ? '#FFF' : '#FF6347'} 
                />
              </View>
              <Text 
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.name && styles.selectedCategoryButtonText
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.productsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Products</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredItems}
          renderItem={renderGroceryItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.groceryList}
        />
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddGrocery')}
      >
        <Icon name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  groceryItemContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    height: 120,
    transform: [{ scale: 1 }],
  },
  imageWrapper: {
    position: 'relative',
    width: 120,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  groceryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 99, 71, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backdropFilter: 'blur(4px)',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  groceryInfoContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  groceryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 99, 71, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  dateText: {
    fontSize: 13,
    color: '#FF6347',
    marginLeft: 6,
    fontWeight: '600',
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
  expiryContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  expiryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.25,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  greeting: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  greetingBold: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  categoriesContainer: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  categoryList: {
    paddingHorizontal: 8,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryButtonSelected: {
    backgroundColor: '#FF6347',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.5,
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  categoriesSection: {
    marginBottom: 24,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
  },
  productsSection: {
    flex: 1,
    marginTop: 24,
    paddingHorizontal: 16,
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    letterSpacing: 0.25,
  },
  greetingBold: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 8,
    letterSpacing: -0.5,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  categoriesSection: {
    marginBottom: 24,
    paddingTop: 8
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 15,
    color: '#FF6347',
    fontWeight: '600',
    letterSpacing: 0.25,
  },
  categoriesScrollView: {
    paddingLeft: 20,
    paddingVertical: 4,
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    height: 120,
    transform: [{ scale: 1 }],
  },
  imageWrapper: {
    position: 'relative',
    width: 120,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  groceryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 99, 71, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backdropFilter: 'blur(4px)',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  groceryInfoContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  groceryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 99, 71, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  dateText: {
    fontSize: 13,
    color: '#FF6347',
    marginLeft: 6,
    fontWeight: '600',
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
  expiryContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  expiryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.25,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#FF6347',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }
});

export default HomeScreen;

// Add these styles
styles.categoriesSection = {
  marginBottom: 24,
  paddingTop: 8
};

styles.sectionHeader = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  marginBottom: 16
};

styles.seeAllButton = {
  backgroundColor: 'rgba(255, 99, 71, 0.1)',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20
};

styles.categoriesContent = {
  paddingHorizontal: 12,
  paddingVertical: 8
};

styles.categoryButton = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: 25,
  paddingHorizontal: 16,
  paddingVertical: 8,
  marginHorizontal: 6,
  alignItems: 'center',
  flexDirection: 'row',
  minWidth: 80,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
  borderWidth: 1,
  borderColor: 'rgba(255, 99, 71, 0.1)',
  transform: [{ scale: 1 }]
};

styles.selectedCategoryButton = {
  backgroundColor: '#FF6347',
  borderColor: '#FF6347',
  shadowColor: '#FF6347',
  shadowOpacity: 0.3,
  elevation: 8
};

styles.categoryIconContainer = {
  marginRight: 6,
  padding: 4,
  borderRadius: 12
};

styles.categoryButtonText = {
  fontSize: 13,
  fontWeight: '600',
  color: '#444444',
  textAlign: 'center'
};

styles.selectedCategoryButtonText = {
  color: '#FFFFFF',
  fontWeight: '700'
};

styles.categoriesContainer = {
  marginVertical: 16,
  paddingHorizontal: 16,
};

styles.categoryButton = {
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 20,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  marginRight: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.2)',
};

styles.categoryButtonActive = {
  backgroundColor: '#FF6347',
  borderColor: 'rgba(255, 99, 71, 0.2)',
};

styles.categoryText = {
  fontSize: 14,
  fontWeight: '600',
  color: '#666',
  letterSpacing: 0.5,
};

styles.categoryTextActive = {
  color: '#FFFFFF',
};