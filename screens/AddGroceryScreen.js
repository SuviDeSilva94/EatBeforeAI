import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert, Platform, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddGroceryScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Fruits');
  const [expiryDate, setExpiryDate] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
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
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setExpiryDate(formatDate(currentDate));
  };

  const handleSave = async () => {
    // Validate inputs
    if (!name || !category || !expiryDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Create new grocery item
    const newItem = {
      id: Date.now().toString(),
      name,
      category,
      expiryDate,
      daysUntilExpiry: calculateDaysUntilExpiry(expiryDate),
      // In a real app, you would handle image upload
      // For demo, we'll use a placeholder based on category
      image: category === 'Fruits' ? require('../assets/banana.png') :
             category === 'Meat' ? require('../assets/chicken.png') :
             require('../assets/chocolate.png'),
    };

    try {
      // In a real app, you would save to AsyncStorage or a database
      // For demo purposes, we'll just navigate back
      Alert.alert('Success', 'Grocery item added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save grocery item');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
              display="default"
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
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
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    minHeight: 50,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
});

export default AddGroceryScreen;