import React, { useEffect, useState } from 'react';
import Cells from './Cells';
import game from './Game';
import './App.css';
import { getDatabase, ref, set, query, orderByChild, equalTo, get, update, push } from "firebase/database";
import firebase from "../../firebase";
import { ImageBackground, StyleSheet } from 'react-native';

interface AppProps {}

interface AppState {
  score: number;
  addition: number;
  cells: number[];
  over: boolean;
  won: boolean;
  userEmail: string | null;
}

const App: React.FC<AppProps> = () => {
  const [score, setScore] = useState(0);
  const [addition, setAddition] = useState(0);
  const [cells, setCells] = useState<number[]>(game.cells);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const gameName = "2048Score";

  useEffect(() => {
    game.start();
    document.addEventListener('keydown', handleKeydown);

    game.addCallback('over', () => {
      setOver(true);
    });

    game.addCallback('won', () => {
      setWon(true);
    });

    game.addCallback('addScore', (score: number) => {
      setAddition(score);
    });

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      game.removeCallback('over');
      game.removeCallback('won');
      game.removeCallback('addScore');
    };
  }, []);

  useEffect(() => {
    refreshGameState();
  }, [cells, score, over, won]);


   // Fetch the current user's email using Firebase Authentication
   useEffect(() => {
    const fetchUserEmail = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        setUserEmail(user.email || "");
      }
    };
    fetchUserEmail();
  }, []);

  const handleKeydown = (event: any) => {
    const keyMap: any = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right'
    };

    if (game.respond(keyMap[event.code])) {
      refreshGameState();
    }
  };

  const refreshGameState = () => {
    setScore(game.score);
    setCells(game.cells);
    // no need to update over and won states, they are set using game callbacks
  };

  const restart = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    game.restart();
    setCells(game.cells);
    setAddition(0);
    setScore(0);
    setOver(false);
    setWon(false);
  };

  useEffect(() => {
    if (userEmail && (over || won)) {
      const database = getDatabase();
      const usersRef = ref(database, "users");
  
      // Fetch the user's data based on their email
      const userQuery = query(usersRef, orderByChild("email"), equalTo(userEmail));
  
      get(userQuery)
          .then((snapshot) => {
            if (snapshot.exists()) {
              // User already exists
              let previousScore = 0;
              let userKey = null;
              
              snapshot.forEach((childSnapshot) => {
                userKey = childSnapshot.key;
                const userData = childSnapshot.val();
                previousScore = userData["2048Score"] || 0;
              });
    
              // Check if the new score is higher than the previous score
              if (score > previousScore) {
                // Update the score as it's higher
                update(ref(database, `users/${userKey}`), {
                  "2048Score": score,
                });
              }
            } else {
              // User doesn't exist, create a new entry
              const userID = push(usersRef).key;
              set(ref(database, `users/${userID}`), {
                email: userEmail,
                "2048Score": score,
              });
            }
          })
          .catch((error) => {
            console.error("Error fetching user:", error);
          });
      }
  }, [userEmail, score, over, won]);
  
  
  return (
    <ImageBackground source={require('../../images/2048b.png')} style={styles.background}>
    <div className="app">
      <div className="game-header">
        <h1 className="title">2048</h1>
        <div className="score-container">
          {score}

          {addition !== 0 && (
            <div className="score-addition">+{addition}</div>
          )}
        </div>
      </div>

      <div className="game-intro">
        <button className="restart-button" onClick={restart}>
          New Game
        </button>
        <h2 className="subtitle">Play 2048 Game</h2>
        Join the numbers and get to the <b>2048 tile!</b>
      </div>

      <div className="game-container">
        {(won || over) && (
          <div className={`game-message game-${(won && 'won') || (over && 'over')}`}>
            <p>{won ? 'You win!' : 'Game over!'}</p>

            <div className="actions">
              <button className="retry-button" onClick={restart}>
                Try again
              </button>
            </div>
          </div>
        )}
        <Cells cells={cells} />
      </div>
    </div>
    </ImageBackground>
  );
};

export default App;
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' depending on your preference
  },
});