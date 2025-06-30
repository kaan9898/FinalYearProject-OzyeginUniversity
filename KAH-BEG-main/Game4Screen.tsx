import React from 'react';
import { StyleSheet,ImageBackground } from 'react-native';
import ReactDOM from "react-dom";
import App from './2048/App'

function Game4Screen() {
  return (
    <React.StrictMode>
        <App />
    </React.StrictMode>
  );
}

ReactDOM.render(
  <Game4Screen />,
  document.getElementById("root")
);

export default Game4Screen;

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
  background: {
    flex: 1,
    resizeMode: 'stretch', // or 'stretch' depending on your preference
    background: '../images/Memory.png',
  },
});