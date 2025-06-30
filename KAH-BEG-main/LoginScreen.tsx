import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { CheckBox } from 'react-native-elements';
import firebase  from '../firebase';

interface LoginScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [isSelected, setSelection] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if the user is already authenticated
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is logged in, navigate to the desired screen (e.g., Home)
        navigation.navigate('GameSelection'); //eğer kullanıcı daha önce girmişse burda kontrol edip otomatik login ediyoruz
        //eğer bunu commente alırsan startta login olması için username pass girip logine basmak lazım
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [navigation]);

  const handleLogin = () => {
    // Perform login with Firebase Authentication
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        // Login successful, navigate to the desired screen (e.g., Home)
        navigation.navigate('GameSelection');
      })
      .catch((error) => {
        // Handle login error
        console.log(error);
      });
  };

  return (
    <ImageBackground source={require('../images/Login.png')} style={styles.background}>
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.header}>Login</Text>
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
        <View style={styles.rememberForgotRow}>
          <View style={styles.rememberMeContainer}>
            <CheckBox checked={isSelected} onPress={() => setSelection(!isSelected)} containerStyle={styles.checkbox} />
            <Text style={styles.remember}> Remember me</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login Now</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signUpText}>Don't have an account? <Text style={styles.register}>Sign up now</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' depending on your preference
  },
  header: {
    fontSize: 48,
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  rememberForgotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  remember: {
    alignSelf: 'center',
  },
  checkbox: {
    alignSelf: 'center',
  },
  signUpText: {
    textAlign: 'center',
  },
  register: {
    color: '#55ADDD',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: ('./images/Login.png'),
  },
  form: {
    height: '60%',
    width: '30%',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  forgotPassword: {
    textAlign: 'right',
    marginBottom: 20,
    color: '#55ADDD',
  },
  loginButton: {
    backgroundColor: '#55ADDD',
    padding: 13,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonText: {
    color: 'black',
    textAlign: 'center',
  },
});
