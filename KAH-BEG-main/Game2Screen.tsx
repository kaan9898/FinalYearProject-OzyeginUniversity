import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ReactDOM from "react-dom";
import "./Game2Screen.css";
import { SudokuProvider } from './Sudoku/context/SudokuContext';
import { Game } from './Sudoku/Game';

function Game2Screen() {
  return (
    <React.StrictMode>
    <SudokuProvider>
      <Game />
    </SudokuProvider>
    </React.StrictMode>
  );
}

ReactDOM.render(
  <Game2Screen />,
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

export default Game2Screen;