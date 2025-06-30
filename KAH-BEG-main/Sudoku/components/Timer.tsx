import React, { useState, useEffect } from 'react';
import { useSudokuContext } from '../context/SudokuContext';
import moment from 'moment';
import { getDatabase, ref, query, orderByChild, equalTo, get, set, update, push } from "firebase/database";
import firebase from "../../../firebase";

/**
 * React component for the Timer in Status Section.
 * Uses the 'useEffect' hook to update the timer every second.
 * Also writes the finishing time as a score to Firebase at the end of the game.
 */
export const Timer = () => {
  const [currentTime, setCurrentTime] = useState(moment());
  const { timeGameStarted, won } = useSudokuContext();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!won) {
      const timer = setInterval(tick, 1000);

      return () => clearInterval(timer);
    }
  });

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
    if (won && userEmail) {
      const database = getDatabase();
      const usersRef = ref(database, "users");
  
      // Fetch the user's data based on their email
      const userQuery = query(usersRef, orderByChild("email"), equalTo(userEmail));
  
      get(userQuery)
        .then((snapshot) => {
          let userKey = null;
          let previousScore = 0; // Default to 0 if the user doesn't have a previous score for this game
  
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              userKey = childSnapshot.key;
              previousScore = childSnapshot.val().SudokuScore || 0; // Use "SudokuScore" as the field name for this game
            });
          }
  
          // Calculate the finishing time and convert it to seconds
          const finishTime = moment().diff(timeGameStarted, "seconds");
  
          // Update the score in the database if the user exists and the current score (finish time) is lower than the previous score
          if (userKey && (previousScore === 0 || finishTime < previousScore)) {

            let minutes = Math.floor(finishTime / 60);
            let remainingSeconds = finishTime % 60;

            // Update the game score (finish time) in the user's data
            update(ref(database, `users/${userKey}`), {
              SudokuScore: `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`, // Use "SudokuScore" as the field name for this game
            });
          } else if (!userKey) {
            let minutes = Math.floor(finishTime / 60);
            let remainingSeconds = finishTime % 60;
            // User doesn't exist, create a new entry
            const userID = push(usersRef).key;
            set(ref(database, `users/${userID}`), {
              email: userEmail,
              SudokuScore: `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`, // Use "SudokuScore" as the field name for this game
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, [won, userEmail, timeGameStarted]);

  function tick() {
    setCurrentTime(moment());
  }

  function getTimer() {
    let secondsTotal = currentTime.diff(timeGameStarted, 'seconds');
    if (secondsTotal <= 0)
      return '00:00';
    let duration = moment.duration(secondsTotal, 'seconds');
    let hours = duration.hours();
    let minutes = duration.minutes();
    let seconds = duration.seconds();
    let stringTimer = '';

    stringTimer += hours ? '' + hours + ':' : '';
    stringTimer += minutes ? (minutes < 10 ? '0' : '') + minutes + ':' : '00:';
    stringTimer += seconds < 10 ? '0' + seconds : seconds;

    return stringTimer;
  }

  return (
    <div className="status__time">{getTimer()}</div>
  )
}
