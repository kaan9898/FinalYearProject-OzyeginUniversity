import React from 'react';
import {Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import './GameSelectionScreen.css';
type Props = {
  navigation: NavigationProp<Record<string, object>>;
};
function GameSelectionScreen({ navigation }: Props) {
  return (
    <>
     {}
     <ImageBackground
      source={require('../images/GameSelectionPage.png')} // Change this to the path of your background image
      style={styles.backgroundImage}
    >
    <div style={styles.root}>
      {}
      <div style={styles.container}>
        {}
        <Text style={styles.header}>Select a Game</Text>
        <div style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate({ name: 'Quiz Game', params: {} })}>
            <Image style={styles.cardImage} source={require('../images/QuizGame.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate({ name: 'Sudoku', params: {} })}>
            <Image style={styles.cardImage} source={require('../images/sudoku.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate({ name: 'Memory Game', params: {} })}>
            <Image style={styles.cardImage} source={require('../images/memorygame.jpg')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate({ name: '2048', params: {} })}>
            <Image style={styles.cardImage2048} source={require('../images/2048.png')} />
          </TouchableOpacity>
      </div>
      </div>
    </div>
    </ImageBackground>
    </>
  );
}
const styles = StyleSheet.create({
  root: {
    position: 'relative',
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Adjust the resizeMode according to your preference
  },
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: 971,
    marginRight: 16,
    marginLeft: 16,
    elevation: 2,
    paddingBottom: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#DCDCEB',
    borderRadius: 4,
    // overflow: 'hidden'
  },
  header: {
    position: 'relative',
    marginBottom: 16,
    fontSize: 44,
    color: '#2596BE',
    textAlign: 'center',
    width: '100%',
    justifySelf: 'center',
    flexWrap: 'wrap',
    zIndex: 5,
    fontFamily: 'Pirou',
  },
  cardContainer: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '0, 16px, 16px, 16px',
    gap: 16,
  },
  card: {
    width: '100%',
    maxWidth: 200,
    height: 200,
    border: '1px solid rgba(0, 0 , 0, 0.24)',
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    //overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius:50,
    resizeMode: 'stretch',
  },

  cardImage2048: {
    width: '100%',
    height: '100%',
    borderRadius:50,
    resizeMode: 'cover',
  },
 
})

export default GameSelectionScreen;