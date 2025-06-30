import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,ImageBackground} from 'react-native';
import firebase from "../../firebase";
import { getDatabase, ref, query, orderByChild, equalTo, get, set, push, update } from "firebase/database";

const emojis = ['🎉', '🐱', '🌸', '🍕', '🚀', '🎈', '🐶', '🍦', '🌞', '🌈', '🍔', '🍒', '🍍', '🐢', '🌼', '🍟', '🌍', '🍓'];
const totalCards = emojis.length * 2;

const App = () => {
  const [cards, setCards] = useState<(string | null)[]>(Array(totalCards).fill(null));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [restart, setRestart] = useState<boolean>(false);
  const [initialReveal, setInitialReveal] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);


  const flipCard = (index: number) => {
    if (flippedIndices.includes(index) || matchedIndices.includes(index)) return;

    if (flippedIndices.length < 2) {
      setFlippedIndices(prevFlippedIndices => [...prevFlippedIndices, index]);
    } else {
      // If two cards are already flipped, reset the flipped state and flip the current card
      setFlippedIndices([index]);
    }
  };

  const handleRestart = () => {
    // Reset all game-related states
    setFlippedIndices([]);
    setMatchedIndices([]);
    setMoves(0);
    setTimeSpent(0);
    setGameEnded(false);
    setRestart(true);
    setInitialReveal(true);
  };

  useEffect(() => {
    const fetchUserEmail = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        setUserEmail(user.email || "");
      }
    };
    fetchUserEmail();
  }, []);


  useEffect(() => {
    if (gameEnded && userEmail) {
      const database = getDatabase();
      const usersRef = ref(database, "users");

      const emailQuery = query(usersRef, orderByChild("email"), equalTo(userEmail));

      get(emailQuery)
        .then((snapshot) => {
          let userKey = null;
          let previousScore = 0;

          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              userKey = childSnapshot.key;
              const userData = childSnapshot.val();
              previousScore = userData.MemoryGameScore || 0;
            });

            if (previousScore === 0 || calculateScore() > previousScore) {
              update(ref(database, `users/${userKey}`), {
                MemoryGameScore: calculateScore(),
              });
            }
          } else {
            const userID = push(usersRef).key;
            set(ref(database, `users/${userID}`), {
              email: userEmail,
              MemoryGameScore: calculateScore(),
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, [gameEnded, userEmail, moves]);

  useEffect(() => {
    if (initialReveal) {
      // Show all emojis for a few seconds, then flip them back
      setTimeout(() => {
        setFlippedIndices([]);
        setInitialReveal(false);
      }, 3000); // Adjust the duration as needed
    }
  }, [initialReveal]);

  useEffect(() => {
  if (flippedIndices.length === 2) {
    const [index1, index2] = flippedIndices;
    
    // Increase the move count by 1 for each pair of cards flipped
    if (!matchedIndices.includes(index1) && !matchedIndices.includes(index2)) {
      setMoves(prevMoves => prevMoves + 1);
    }

    if (cards[index1] === cards[index2]) {
      // Mark the matched indices
      setMatchedIndices(prevMatchedIndices => [...prevMatchedIndices, index1, index2]);
    } else {
      // Flip the cards back
      setTimeout(() => setFlippedIndices([]), 1000);
    }
    
    // Check if all cards have been matched and the game has ended
    const remainingCards = cards.filter((card, idx) => !matchedIndices.includes(idx));

    if (remainingCards.length === 0) {
      setGameEnded(true);
    }
  }
}, [flippedIndices, cards, matchedIndices]);
  

  useEffect(() => {
    const shuffledEmojis = emojis.concat(emojis).sort(() => 0.5 - Math.random());
    setCards(shuffledEmojis);
  }, []);

  useEffect(() => {
    if (gameEnded) {
      return; // Stop updating timeSpent once the game has ended
    }
  
    const interval = setInterval(() => {
      setTimeSpent(prevTimeSpent => prevTimeSpent + 1);
    }, 1000);
  
    return () => {
      clearInterval(interval);
    };
  }, [gameEnded]);

  
  const calculateScore = () => {
    if (gameEnded) {
      // Calculate score based on time spent and moves
      return timeSpent * moves;
    }
    return 0;
  };

  return (
    <ImageBackground source={require('../../images/Memory.png')} style={styles.backgroundImage}>
  <View style={styles.header}>
    <Text style={styles.movesText}>Moves: {moves}</Text>
    <Text style={styles.timeText}>Time: {timeSpent}s</Text>
    <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
      <Text style={styles.restartButtonText}>Restart</Text>
    </TouchableOpacity>
  </View>
  {gameEnded && <Text style={styles.scoreText}>Score: {calculateScore()}</Text>}
  <View style={styles.cardContainer}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              (flippedIndices.includes(index) || matchedIndices.includes(index)) && styles.flippedCard,
            ]}
            onPress={() => flipCard(index)}
          >
            {flippedIndices.includes(index) || matchedIndices.includes(index) ? (
              <Text style={styles.cardText}>{card}</Text>
            ) : (
              <Text style={styles.cardText}>
                {initialReveal ? card : '🔒'}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ImageBackground>
  );
};

export default App;

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
},
backgroundImage: {
  flex: 1,
  width: '100%',
  height: '100%',
  resizeMode: 'cover', // Choose the appropriate resizeMode
  justifyContent: 'center', // Adjust as needed
  alignItems: 'center', // Adjust as needed
},
cardContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  width: 600, // Adjust the width
  height: 600, // Adjust the height
},
card: {
  width: 70, // Adjust the width
  height: 70, // Adjust the height
  backgroundColor: '#00bcd4',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 24,
  fontWeight: 'bold',
  margin: 3,
  padding: 45,
  borderRadius: 5,
  overflow: 'hidden',
  cursor: 'pointer',
  transformStyle: 'preserve-3d', // Apply 3D transformations
},
flippedCard: {
  transform: [{ rotateY: '180deg' }], // Flip the card when clicked
},
cardText: {
  color: 'white',
  fontSize: 35,
},
movesText: {
  fontSize: 18,
  marginBottom: 10,
  fontWeight: 'bold',
},
timeText: {
  fontSize: 18,
  marginBottom: 10,
  fontWeight: 'bold',
},
scoreText: {
  fontSize: 24,
  fontWeight: 'bold',
  marginTop: 20,
},
restartButtonContainer: {
  alignSelf: 'flex-end',
  margin: 20,
},
restartButton: {
  backgroundColor: '#00bcd4',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
},
restartButtonText: {
  color: 'black',
  fontSize: 18,
  fontWeight: 'bold',
},
header: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  width: 600,
  paddingHorizontal: 0,
},
});
