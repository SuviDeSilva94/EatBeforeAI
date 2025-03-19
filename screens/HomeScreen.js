import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('User');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [groceryItems, setGroceryItems] = useState([]);

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'frozen', name: 'Frozen' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'meat', name: 'Meat' },
    { id: 'dairy', name: 'Dairy' },
  ];

  // Sample grocery items (in a real app, this would come from a database)
  const sampleItems = [
    {
      id: '1',
      name: 'Banana',
      category: 'Fruits',
      expiryDate: '26 March 2025',
      daysUntilExpiry: 2,
      image: require('../assets/banana.png'),
    },
    {
      id: '2',
      name: 'M&M\'s Peanut Chocolate More To Share',
      category: 'Frozen',
      expiryDate: '26 March 2025',
      daysUntilExpiry: 10,
      image: require('../assets/chocolate.png'),
    },
    {
      id: '3',
      name: 'Succulent Large Chicken',
      category: 'Meat',
      expiryDate: '26 March 2025',
      daysUntilExpiry: 5,
      image: require('../assets/chicken.png'),
    },
  ];

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

    // Load grocery items (in a real app, this would be from AsyncStorage or a database)
    const loadGroceryItems = async () => {
      // For demo purposes, we'll use the sample items
      setGroceryItems(sampleItems);
    };

    loadUserName();
    loadGroceryItems();
  }, []);

  // Filter items based on selected category and search query
  const filteredItems = groceryItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  // Render grocery item
  const renderGroceryItem = ({ item }) => (
    <View style={styles.groceryItemContainer}>
      <Image source={item.image} style={styles.groceryImage} />
      
      <View style={styles.groceryInfoContainer}>
        <View style={styles.dateContainer}>
          <Icon name="access-time" size={16} color="#FF6347" />
          <Text style={styles.dateText}>{item.expiryDate}</Text>
        </View>
        
        <Text style={styles.categoryLabel}>{item.category}</Text>
        <Text style={styles.groceryName}>{item.name}</Text>
        
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
    </View>
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
      </View>

      <View style={styles.categoriesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Categories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScrollView}
        >
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.name && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
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
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS system background color
  },
  header: {
    backgroundColor: '#007AFF', // iOS blue
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  greeting: {
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: -0.24,
  },
  greetingBold: {
    fontSize: 34, // iOS large title
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
    letterSpacing: 0.41,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    minHeight: 36, // iOS searchbar height
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 8,
    color: '#8E8E93', // iOS gray
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#000000',
    letterSpacing: -0.41,
  },
  categoriesSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22, // iOS section header
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.35,
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 17,
    letterSpacing: -0.41,
  },
  categoriesScrollView: {
    paddingLeft: 16,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#C5C5C7',
  },
  selectedCategoryButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryButtonText: {
    color: '#000000',
    fontSize: 15,
    letterSpacing: -0.24,
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  productsSection: {
    flex: 1,
  },
  groceryList: {
    padding: 16,
  },
  groceryItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  groceryImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  groceryInfoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13, // iOS footnote
    color: '#8E8E93',
    marginLeft: 4,
    letterSpacing: -0.08,
  },
  categoryLabel: {
    fontSize: 13,
    color: '#8E8E93',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginVertical: 4,
    letterSpacing: -0.08,
  },
  groceryName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.41,
  },
  progressBarContainer: {
    height: 18,
    backgroundColor: '#F2F2F7',
    borderRadius: 9,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    borderRadius: 9,
  },
  expiryText: {
    position: 'absolute',
    right: 8,
    top: 1,
    fontSize: 13,
    color: '#000000',
    fontWeight: '500',
    letterSpacing: -0.08,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default HomeScreen;