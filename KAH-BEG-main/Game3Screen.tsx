import React from 'react';
import { StyleSheet } from 'react-native';
import ReactDOM from "react-dom";
import "./Game3Screen.css";
import Game from './MemoryGame/Game';

function Game3Screen() {
  return (
    <React.StrictMode>
      <Game />
    </React.StrictMode>
  );
}

ReactDOM.render(
  <Game3Screen />,
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

export default Game3Screen;