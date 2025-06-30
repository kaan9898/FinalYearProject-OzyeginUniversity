import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
import firebase from '../firebase'; // Adjust the path if needed
import { getDatabase, push, ref, set } from 'firebase/database';

interface RegisterScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}


const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [isSelected, setSelection] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Perform user registration with Firebase Authentication
    if (password === confirmPassword) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const database = getDatabase();
          const usersRef = ref(database, 'users');
          if (user) {
            const userID = push(usersRef).key;
            set(ref(database, `users/${userID}`), {
              email: email,
              name: name,
              registrationDate: new Date().toString(),
              // Add more fields as needed for your application
            });
            
            // Clear the email and password fields after successful registration
            setEmail('');
            setPassword('');
            setConfirmPassword('');
  
            // Navigate to the login screen after registration without automatic login
            navigation.navigate('Login');
          }
        })
        .catch((error) => {
          // Handle registration error
          console.log('Registration Error:', error.code, error.message);
        });
    } else {
      console.log("Passwords don't match.");
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.header}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#999999"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999999"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999999"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999999"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <View style={styles.acceptTermsContainer}>
          <CheckBox checked={isSelected} onPress={() => setSelection(!isSelected)} containerStyle={styles.checkbox} />
          <Text style={styles.acceptTerms}>I accept all terms & conditions</Text>
        </View>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register Now</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.haveAccount}>Already have an account? <Text style={styles.login}>Login now</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ADD8FF',
  },
  form: {
    height: '60%',
    width: '80%',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
  },
  header: {
    fontSize: 48,
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  acceptTermsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  acceptTerms: {
    color: 'black',
  },
  checkbox: {
    marginRight: 10,
  },
  registerButton: {
    backgroundColor: '#007BFF',
    padding: 13,
    borderRadius: 5,
    marginBottom: 10,
  },
  registerButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  haveAccount: {
    textAlign: 'center',
  },
  login: {
    textAlign: 'center',
    color: '#7985D6',
  },
});

export default RegisterScreen;
