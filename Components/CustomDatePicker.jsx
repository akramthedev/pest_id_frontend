import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const CustomDatePicker = ({ selectedDate, onDateChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleDayPress = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onDateChange(newDate);
    setShowPicker(false);
  };

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth, currentYear);
    const selectedDay = selectedDate.getDate(); // Get the day from selectedDate
  
    for (let day = 1; day <= totalDays; day++) {
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayButton,
            day === selectedDay ? styles.selectedDay : null // Apply selected style
          ]}
          onPress={() => handleDayPress(day)}
        >
          <Text style={[
            styles.dayText, 
            day === selectedDay ? styles.selectedDayText : null // Change text color if selected
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }
    return days;
  };
  
  const changeMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');  
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.datePickerButton}>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
      </TouchableOpacity>

      {showPicker && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <TouchableOpacity style={styles.uçzrshuwdoc} onPress={() => changeMonth('prev')}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.monthYearText}>
                  {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
                </Text>
                <TouchableOpacity style={styles.uçzrshuwdoc} onPress={() => changeMonth('next')}>
                  <Ionicons name="arrow-forward" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.daysContainer}>
                {renderDays()}
              </View>
              <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  uçzrshuwdoc: {
    backgroundColor: "#1F3A04", 
    width: 45,
    height: 45,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    color: 'black',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: '14.28%', // 7 days a week
    alignItems: 'center',
    padding: 10,
  },
  dayText: {
    fontSize: 16,
    color: 'black',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#487C15',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  selectedDay: {
    backgroundColor: '#487C15', // Change this color as desired
    borderRadius: 8, // Optional: Add rounded corners
  },
  selectedDayText : {
    color : "white"
  }
});

export default CustomDatePicker;
