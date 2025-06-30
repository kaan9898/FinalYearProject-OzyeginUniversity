import React from 'react';
import { StyleSheet } from 'react-native';
import ReactDOM from "react-dom";
import Quiz from "./QuizGame/components/Quiz";
import { QuizProvider } from "./QuizGame/contexts/quiz";
import "./Game1Screen.css";

function Game1Screen() {
  return (
    <React.StrictMode>
      <QuizProvider>
        <Quiz />
      </QuizProvider>
    </React.StrictMode>
  );
}

ReactDOM.render(
  <Game1Screen />,
  document.getElementById("root")
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ADD8FF',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});

export default Game1Screen;

