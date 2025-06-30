import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert,ImageBackground } from 'react-native';
import { getDatabase, ref, query, orderByChild, equalTo, get, limitToLast } from "firebase/database";
import firebase from '../firebase'; // Replace '../firebase' with the correct path to initialize Firebase
import { useFocusEffect } from '@react-navigation/native'; 

interface User {
  email: string;
  [key: string]: any;
}

interface ProfileScreenProps {
  navigation: StackNavigationProp<any>;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard2048, setLeaderboard2048] = useState<User[]>([]);
  const [leaderboardQuiz, setLeaderboardQuiz] = useState<User[]>([]);
  const [leaderboardSudoku, setLeaderboardSudoku] = useState<User[]>([]);
  const [leaderboardMemoryGame, setLeaderboardMemoryGame] = useState<User[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false); // State to track the visibility of the leaderboard
  const [currentUserIndex, setCurrentUserIndex] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const handleShowLeaderboard = () => {
    setShowLeaderboard(true);
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser && currentUser.email) {
        fetchUserData(currentUser.email);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userEmail: string) => {
    try {
      const database = getDatabase();
      const usersRef = ref(database, 'users');

      // Query for the user based on their email
      const emailQuery = query(usersRef, orderByChild('email'), equalTo(userEmail));

      // Fetch the user data
      const snapshot = await get(emailQuery);

      if (snapshot.exists()) {
        let userData: User | null = null;
        snapshot.forEach((childSnapshot) => {
          userData = childSnapshot.val();
        });
        if (userData) {
          setUser(userData);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
        if (currentUser && currentUser.email) {
          fetchUserData(currentUser.email);
        } else {
          setUser(null);
          setLoading(false);
        }
      });

      fetchLeaderboard('2048Score');
      fetchLeaderboard('QuizScore');
      fetchLeaderboard('SudokuScore');
      fetchLeaderboard('MemoryGameScore');

      return () => unsubscribe();
    }, [])
  );


  
  const handleContactUsSubmit = () => {
    // You can implement the logic to send the contact form data here
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    // Clear the form fields after submission
    setName('');
    setEmail('');
    setMessage('');
    
    alert('Thank you for your feedback! We will get in touch soon.');

    // You can also add logic to send the form data to a backend or perform other actions
  };


  const fetchLeaderboard = async (gameKey: string) => {
    try {
      const database = getDatabase();
      const usersRef = ref(database, 'users');
      console.log('Fetching leaderboard:', gameKey);
      // Query to order users based on the specific game score
      const gameQuery = query(usersRef, orderByChild(gameKey), limitToLast(10));

      // Fetch leaderboard data
      const snapshot = await get(gameQuery);

      if (!snapshot.exists()) {
        // No leaderboard data for this game
        return;
      }

      const leaderboard: User[] = [];
      snapshot.forEach((childSnapshot) => {
        leaderboard.push(childSnapshot.val());
      });

      // Set the leaderboard state for the specific game
      switch (gameKey) {
        case '2048Score':
          // Keep existing sorting logic for other games
          leaderboard.sort((a, b) => {
            const scoreA = a[gameKey] !== undefined ? a[gameKey] : -Infinity;
            const scoreB = b[gameKey] !== undefined ? b[gameKey] : -Infinity;
            return scoreB - scoreA; // Sort in descending order
          });
          setLeaderboard2048(leaderboard);
          break;
        case 'QuizScore':
          // Keep existing sorting logic for other games
          leaderboard.sort((a, b) => {
            const scoreA = a[gameKey] !== undefined ? a[gameKey] : -Infinity;
            const scoreB = b[gameKey] !== undefined ? b[gameKey] : -Infinity;
            return scoreB - scoreA; // Sort in descending order
          });
          setLeaderboardQuiz(leaderboard);
          break;
        case 'SudokuScore':
          leaderboard.sort((a, b) => {
            const scoreA = a[gameKey] !== undefined ? a[gameKey] : Infinity;
            const scoreB = b[gameKey] !== undefined ? b[gameKey] : Infinity;
            return scoreA - scoreB; // Sort in ascending order (fastest times at the top)
          });
          setLeaderboardSudoku(leaderboard);
          break;
        case 'MemoryGameScore':
          // Apply custom sorting logic for Memory Game
          leaderboard.sort((a, b) => {
            const scoreA = a[gameKey] !== undefined ? a[gameKey] : Infinity;
            const scoreB = b[gameKey] !== undefined ? b[gameKey] : Infinity;
            return scoreA - scoreB; // Sort in ascending order
          });
          setLeaderboardMemoryGame(leaderboard);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${gameKey} leaderboard:`, error);
    }
  };
  
  const renderUserInfoTable = (user: User | null) => {
    if (!user) {
      return <Text style={styles.info}>User not found</Text>;
    }

    const userInfoData = [
      ['Username', user.name],
      ['Email', user.email],
      ['Signup Date', user.registrationDate
        ? new Date(user.registrationDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
        : 'N/A'],
    ];

    return (
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.playerCell]}>Info</Text>
          <Text style={[styles.tableHeaderText, styles.scoreCell]}>Value</Text>
        </View>
        {userInfoData.map((rowData, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.playerCell]}>{rowData[0]}</Text>
            <Text style={[styles.tableCell, styles.scoreCell]}>{rowData[1]}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderLeaderboard = (leaderboard: User[], gameName: string) => {
    // Separate players with N/A scores from others
    let userEmail = user?.email;
    const naPlayers: User[] = [];
    const regularPlayers: User[] = [];
  
    leaderboard.forEach((user) => {
      if (user[gameName] === undefined) {
        naPlayers.push(user);
      } else {
        regularPlayers.push(user);
      }
    });
  
    // Sort regular players by score in descending order
    regularPlayers.sort((a, b) => {
      const scoreA = a[gameName] !== undefined ? a[gameName] : -Infinity;
      const scoreB = b[gameName] !== undefined ? b[gameName] : -Infinity;
      return scoreB - scoreA;
    });
  
    // Concatenate regular and N/A players
    const allPlayers = regularPlayers.concat(naPlayers);
  
    // Take the top 5 players, considering N/A players
    const topPlayers = allPlayers.slice(0, 5);
  
    return (
      <View style={styles.leaderboardContainer}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.rankCell]}>Rank</Text>
            <Text style={[styles.tableHeaderText, styles.playerCell]}>Player</Text>
            <Text style={[styles.tableHeaderText, styles.scoreCell]}>Score</Text>
          </View>
          {topPlayers.map((user, index) => (
            <View
              key={user.email}
              style={[
                styles.tableRow,
                user.email === userEmail && styles.highlightRow,
              ]}
            >
              <Text style={[styles.tableCell, styles.rankCell]}>{index + 1}</Text>
              <Text style={[styles.tableCell, styles.playerCell]}>{user.name}</Text>
              <Text style={[styles.tableCell, styles.scoreCell]}>
                {user[gameName] !== undefined ? user[gameName] : 'N/A'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };
  

  const renderLeaderboardsGrid = () => {
    return (
      <View style={styles.leaderboardsGrid}>
        <View style={styles.leaderboardRow}>
          <View style={styles.leaderboardColumn}>
            <View style={styles.leaderboardTitleContainer}>
              <Text style={styles.leaderboardHeader}>Quiz Leaderboard</Text>
              <TouchableOpacity
                style={styles.leaderboardButton}
                onPress={() => navigation.navigate('Game1', { game: 'Quiz' })}
              >
                <Text style={styles.leaderboardButtonText}>Play</Text>
              </TouchableOpacity>
            </View>
            {renderLeaderboard(leaderboardQuiz, 'QuizScore')}
          </View>
          <View style={styles.leaderboardColumn}>
            <View style={styles.leaderboardTitleContainer}>
              <Text style={styles.leaderboardHeader}>Sudoku Leaderboard</Text>
              <TouchableOpacity
                style={styles.leaderboardButton}
                onPress={() => navigation.navigate('Game2', { game: 'Sudoku' })}
              >
                <Text style={styles.leaderboardButtonText}>Play</Text>
              </TouchableOpacity>
            </View>
            {renderLeaderboard(leaderboardSudoku, 'SudokuScore')}
          </View>
        </View>
        
        <View style={styles.leaderboardRow}>
          <View style={styles.leaderboardColumn}>
            <View style={styles.leaderboardTitleContainer}>
              <Text style={styles.leaderboardHeader}>Memory Game Leaderboard</Text>
              <TouchableOpacity
                style={styles.leaderboardButton}
                onPress={() => navigation.navigate('Game3', { game: 'MemoryGame' })}
              >
                <Text style={styles.leaderboardButtonText}>Play</Text>
              </TouchableOpacity>
            </View>
            {renderLeaderboard(leaderboardMemoryGame, 'MemoryGameScore')}
          </View>
          <View style={styles.leaderboardColumn}>
            <View style={styles.leaderboardTitleContainer}>
              <Text style={styles.leaderboardHeader}>2048 Leaderboard</Text>
              <TouchableOpacity
                style={styles.leaderboardButton}
                onPress={() => navigation.navigate('Game4', { game: '2048' })}
              >
                <Text style={styles.leaderboardButtonText}>Play</Text>
              </TouchableOpacity>
            </View>
            {renderLeaderboard(leaderboard2048, '2048Score')}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground source={require('../images/profil.png')} style={styles.backgroundImage}>
      <View style={styles.contentContainer}>
        <View style={styles.profileColumn}>
          <Text style={styles.header}>Profile</Text>
          {renderUserInfoTable(user)}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
          <View style={styles.contactUsSection}>
            <Text style={styles.contactUsText}>Contact Us</Text>
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <TextInput
                style={styles.messageInput}
                placeholder="Message"
                value={message}
                onChangeText={setMessage}
                multiline
              />
              <TouchableOpacity
                style={styles.contactUsButton}
                onPress={handleContactUsSubmit}
              >
                <Text style={styles.contactUsButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.leaderboardsColumn}>
          <ScrollView>
            {renderLeaderboardsGrid()}
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F0F0F0',
  },
  contactUsSection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    paddingTop: 20,
  },
  contactUsText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  messageInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  contactUsButton: {
    backgroundColor: '#55ADDD',
    padding: 10,
    borderRadius: 5,
  },
  contactUsButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  contactUsInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  leaderboardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leaderboardButton: {
    backgroundColor: '#55ADDD',
    padding: 5,
    borderRadius: 5,
  },
  leaderboardButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  profileColumn: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 20,
  },
  leaderboardsColumn: {
    flex: 2,
    paddingLeft: 20,
  },
  highlightRow: {
    backgroundColor: '#FFD8D8'
  },
  leaderboardsGrid: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#F0F0F0',
  },
  tableHeaderText: {
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align everything to the left
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  tableCell: {
    flex: 1,
    textAlign: 'left',
  },
  rankCell: {
    flex: 1, // Adjust the width for the rank column
    textAlign: 'left', // Align the text and value to the right
  },
  playerCell: {
    flex: 2, // Adjust the width for the player column
    textAlign: 'right', // Align the text and value to the right
  },
  scoreCell: {
    flex: 2, // Adjust the width for the score column
    textAlign: 'right', // Align the text and value to the right
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  column: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subheader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#55ADDD',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  leaderboardSection: {
    flex: 3,
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    padding: 120,
  },
  leaderboardContainer: {
    marginBottom: 40,
  },
  leaderboardHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  leaderboardEntry: {
    fontSize: 16,
    numberOfLines: 1,
    fontWeight: 'bold',
  },
  leaderboardRow: {
    flexDirection: 'row',
  },
  leaderboardColumn: {
    flex: 1,
    marginHorizontal: 20,
  },
});

export default ProfileScreen;
