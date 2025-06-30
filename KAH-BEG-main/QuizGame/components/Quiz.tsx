import React, { useContext, useEffect, useState } from "react";
import Question from "./Question";
import { QuizContext } from "../contexts/quiz";
import { getDatabase, ref, set, push, child, orderByChild, get, update, equalTo, query } from "firebase/database";
import firebase from "../../../firebase";
import { StyleSheet, ImageBackground } from 'react-native';

const Quiz: React.FC = () => {
  const [quizState, dispatch] = useContext(QuizContext);
  const [remainingTime, setRemainingTime] = useState(60);
  const [userEmail, setUserEmail] = useState("");
  const [timerEnded, setTimerEnded] = useState(false);

  const rightAnswers = quizState.correctAnswersCount;
  const wrongAnswers = quizState.wrongAnswersCount;
  const rightAnswerModifier = 100;
  const wrongAnswerModifier = 125;
  const finalScore = rightAnswers * rightAnswerModifier - wrongAnswers * wrongAnswerModifier;

  useEffect(() => {
    if (remainingTime > 0 && !quizState.showResults) {
      const timerInterval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 100); //change this to end the game faster(delete a zero)

      return () => {
        clearInterval(timerInterval);
      };
    } else if (remainingTime === 0 && !timerEnded) {
      setTimerEnded(true);
      dispatch({ type: "SHOW_RESULTS" });
    }
  }, [remainingTime, timerEnded, quizState.showResults, dispatch]);

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
    if (quizState.showResults && userEmail && finalScore !== undefined) {
      const database = getDatabase();
      const usersRef = ref(database, "users");

      const emailQuery = query(usersRef, orderByChild("email"), equalTo(userEmail));

      get(emailQuery)
        .then((snapshot) => {
          if (snapshot.exists()) {
            let previousScore = 0;
            let userKey = null;

            snapshot.forEach((childSnapshot) => {
              userKey = childSnapshot.key;
              const userData = childSnapshot.val();
              previousScore = userData.QuizScore || -99999;
            });

            if (finalScore > previousScore) {
              update(ref(database, `users/${userKey}`), {
                QuizScore: finalScore,
              });
            }
          } else {
            const userID = push(usersRef).key;
            set(ref(database, `users/${userID}`), {
              email: userEmail,
              QuizScore: finalScore,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, [quizState.showResults, userEmail, finalScore]);

  // Restart the quiz and reset timer
  const restartQuiz = () => {
    dispatch({ type: "RESTART" });
    setRemainingTime(60); // Reset timer to initial value
    setTimerEnded(false); // Reset timerEnded to false
  };

  return (
    <ImageBackground source={require('../../../images/Quizb.jpg')} style={styles.background}>
      <div key={quizState.currentQuestionIndex} className="quiz">
        {quizState.showResults && (
          <div className="results">
            <div className="congratulations">Congratulations!</div>
            <div className="results-info">
              <div>You have completed the quiz.</div>
              <div>
                You've got {quizState.correctAnswersCount} right out of {quizState.currentQuestionIndex} questions.
              </div>
              <div>
                Your final score is {finalScore}.
              </div>
            </div>
            <div onClick={restartQuiz} className="next-button">
              Restart
            </div>
          </div>
        )}
        {!quizState.showResults && (
          <div>
            <div className="score" style={styles.scoreQuestion}>
              Question {quizState.currentQuestionIndex + 1}
            </div>
            <div className="score" style={styles.score}>
              Time remaining: {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, "0")}
            </div>
            <Question />
            {quizState.currentAnswer && (
              <div onClick={() => dispatch({ type: "NEXT_QUESTION" })} className="next-button">
                Next question
              </div>
            )}
          </div>
        )}
      </div>
    </ImageBackground>
  );
};

export default Quiz;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  score:{
    backgroundColor: 'transparent',
    fontSize: 20,
  },
  scoreQuestion:{
    backgroundColor: 'transparent',
    fontSize: 25,
    paddingTop:50
  }
});
