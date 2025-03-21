import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AddGroceryScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Fruits');
  const [expiryDate, setExpiryDate] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState(null);
  const [productRecognitionResult, setProductRecognitionResult] = useState('');

  // Initialize Gemini AI with environment variable
  const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY);

  const analyzeProductImage = async (imageUri) => {
    try {
      if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
        Alert.alert('Configuration Error', 'Gemini API key is not configured. Please check your environment settings.');
        return;
      }

      setProductRecognitionResult('Analyzing image...');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
      
      // Convert image URI to base64
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const reader = new FileReader();
      const base64Data = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read image'));
        reader.readAsDataURL(blob);
      });

      const result = await model.generateContent([
        'What product is shown in this image? Please provide the name and category (Fruits, Vegetables, Meat, Dairy, Frozen, or Other). Format: Product Name, Category',
        { inlineData: { data: base64Data.split(',')[1], mimeType: 'image/jpeg' } }
      ]);

      const responseText = await result.response.text();
      
      // Parse the response to get product name and category
      const [productName, productCategory] = responseText.split(',').map(item => item.trim());
      if (!productName) {
        throw new Error('Could not recognize the product in the image');
      }

      // Validate category
      const validCategories = ['Fruits', 'Vegetables', 'Meat', 'Dairy', 'Frozen', 'Other'];
      const normalizedCategory = productCategory ? 
        validCategories.find(c => c.toLowerCase() === productCategory.toLowerCase()) || 'Other' : 
        'Other';

      setName(productName);
      setCategory(normalizedCategory);
      setProductRecognitionResult(`Recognized as: ${productName} (${normalizedCategory})`);
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze product image. Please try again or enter details manually.');
      setProductRecognitionResult('Failed to recognize product');
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload an image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        await analyzeProductImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  // Categories for selection
  const categories = [
    { id: 'fruits', name: 'Fruits' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'meat', name: 'Meat' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'frozen', name: 'Frozen' },
    { id: 'other', name: 'Other' },
  ];

  // Calculate days until expiry
  const calculateDaysUntilExpiry = (dateString) => {
    if (dateString) {
      const expiryDate = new Date(dateString);
      const currentDate = new Date();
      const diffTime = expiryDate - currentDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };
  
  // Format date to display
  const formatDate = (date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  
  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      const currentDate = selectedDate;
      if (currentDate < new Date()) {
        Alert.alert('Invalid Date', 'Please select a future date');
        return;
      }
      setDate(currentDate);
      setExpiryDate(formatDate(currentDate));
    }
  };

  const showDatePickerModal = () => {
    if (Platform.OS === 'android') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(true);
    }
  };

  const handleSave = async () => {
    try {
      // Enhanced input validation
      if (!image) {
        Alert.alert('Missing Image', 'Please select a product image');
        return;
      }
      if (!name.trim()) {
        Alert.alert('Missing Name', 'Please enter a product name');
        return;
      }
      if (!category) {
        Alert.alert('Missing Category', 'Please select a product category');
        return;
      }
      if (!expiryDate) {
        Alert.alert('Missing Date', 'Please select an expiry date');
        return;
      }

      // Create new grocery item with actual image URI
      const newItem = {
        id: Date.now().toString(),
        name: name.trim(),
        category,
        expiryDate,
        daysUntilExpiry: calculateDaysUntilExpiry(date.toISOString()),
        imageUri: image
      };

      // Save to AsyncStorage
      const existingItemsStr = await AsyncStorage.getItem('groceryItems');
      const existingItems = existingItemsStr ? JSON.parse(existingItemsStr) : [];
      existingItems.push(newItem);
      await AsyncStorage.setItem('groceryItems', JSON.stringify(existingItems));
      
      Alert.alert('Success', 'Grocery item added successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'Failed to save grocery item. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {
        <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Grocery Item</Text>
        </View>

        <View style={styles.imageContainer}>
          <TouchableOpacity 
            style={styles.imagePicker} 
            onPress={pickImage}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Icon name="add-photo-alternate" size={40} color="#999" />
                <Text style={styles.placeholderText}>Select Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {productRecognitionResult ? (
            <Text style={styles.recognitionText}>{productRecognitionResult}</Text>
          ) : null}
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter grocery name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    category === cat.name && styles.selectedCategoryChip
                  ]}
                  onPress={() => setCategory(cat.name)}
                >
                  <Text 
                    style={[
                      styles.categoryChipText,
                      category === cat.name && styles.selectedCategoryChipText
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.dateInputRow}>
              <Text style={styles.dateLabel}>Expiry Date</Text>
              <View style={styles.dateInput}>
                <Text style={expiryDate ? styles.dateText : styles.datePlaceholder}>
                  {expiryDate || 'Select date'}
                </Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Icon name="calendar-today" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>

            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                minimumDate={new Date()}
                style={styles.datePicker}
              />
            )}
          </View>

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Item</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  recognitionText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
  },
  imageContainer: {
    padding: 16,
    alignItems: 'center',
  },
  imagePicker: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 16,
    color: '#999',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS system background color
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    letterSpacing: -0.41,
  },
  formContainer: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15, // iOS standard label size
    fontWeight: '500', // iOS medium
    color: '#000000',
    marginBottom: 8,
    letterSpacing: -0.24,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    fontSize: 17,
    borderWidth: 1,
    borderColor: '#C5C5C7', // iOS standard border color
    minHeight: 44, // iOS minimum touch target
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#C5C5C7',
    minHeight: 32,
  },
  selectedCategoryChip: {
    backgroundColor: '#FF6347',
    borderColor: '#FF6347',
  },
  categoryChipText: {
    fontSize: 15,
    color: '#000000',
    letterSpacing: -0.24,
  },
  selectedCategoryChipText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
    flex: 0.3,
    letterSpacing: -0.24,
  },
  dateInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    fontSize: 17,
    borderWidth: 1,
    borderColor: '#C5C5C7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 0.65,
    minHeight: 44,
  },
  dateText: {
    fontSize: 17,
    color: '#000000',
    letterSpacing: -0.41,
  },
  datePlaceholder: {
    fontSize: 17,
    color: '#8E8E93', // iOS placeholder color
    letterSpacing: -0.41,
  },
  datePicker: {
    width: '100%',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#FF6347',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
});

export default AddGroceryScreen;