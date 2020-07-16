import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

enum Direction {
  Unknown = "Unknown",
  NoInput = "Please guess a number",
  Higher = "Higher",
  Lower = "Lower",
  Correct = "Correct!"
}

export default function App() {
  const [guess, setGuess] = useState<string>('');
  const [previousGuess, setPreviousGuess] = useState<string>('');
  const [guesses, setGuesses] = useState<number[]>([]);
  const [answer, setAnswer] = useState<number | null>(null);
  const [direction, setDirection] = useState<Direction>(Direction.Unknown);
  const guessInputRef = useRef<TextInput>(null);
  const UpperBound: number = 100;

  useEffect(() => {
    startNewRound();
  }, [])

  const handleGuess = () => {
    setPreviousGuess(guess);
    guessInputRef.current?.focus();

    if (guess == '') {
      setDirection(Direction.NoInput);
      return;
    }

    const numberizedGuess = Number(guess);
    const numberizedAnswer = Number(answer);
    setGuesses([...guesses, numberizedGuess]);
    if (numberizedGuess == numberizedAnswer) {
      // correct
      setDirection(Direction.Correct);
      setTimeout(() => {
        startNewRound();
      }, 5000);
    }
    if (numberizedGuess < numberizedAnswer) {
      // too low
      setDirection(Direction.Higher);
    }
    else if (numberizedGuess > numberizedAnswer) {
      // too high
      setDirection(Direction.Lower);
    }

    setGuess('');
  }

  const getRandomAnswer = () => Math.floor((Math.random()) * UpperBound) + 1;

  const startNewRound = () => {
    setDirection(Direction.Unknown);
    setGuess('');
    setAnswer(getRandomAnswer());
    guessInputRef.current?.focus();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Number Guesser!</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.question}>I'm thinking of a number between</Text>
        <Text style={styles.question}>1 and 100...</Text>
        <TextInput
          ref={guessInputRef}
          style={styles.guessInput}
          autoFocus={true}
          autoCorrect={false}
          placeholder="Guess a number..."
          keyboardType={'number-pad'}
          returnKeyType={'done'}
          onChangeText={(num: string) => setGuess(num)}
          value={String(guess)}
          editable={direction != Direction.Correct}
          selectTextOnFocus={true}
          blurOnSubmit={false}
          onSubmitEditing={handleGuess} />
        <TouchableOpacity
          style={[styles.guessButton, direction == Direction.Correct ? styles.guessButtonDisabled : null]}
          onPress={handleGuess}
          disabled={direction == Direction.Correct}>
          <Text style={styles.guessButtonText}>Guess</Text>
        </TouchableOpacity>
        {direction != Direction.Unknown && <><Text>{direction != Direction.NoInput && previousGuess + ' - '} {direction}</Text></>}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    padding: 25,
  },
  header: {
    flex: 1,
    marginTop: 50
  },
  headerText: {
    color: '#333',
    fontSize: 33,
  },
  body: {
    flex: 3,
    alignItems: 'center',
  },
  question: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 30,
    color: '#999'
  },
  guessInput: {
    marginTop: 10,
    borderColor: '#333',
    borderWidth: 3,
    padding: 10,
    width: 200
  },
  guessButton: {
    marginTop: 10,
    padding: 50,
    width: 200,
    backgroundColor: '#007AFF',
    borderRadius: 15
  },
  guessButtonDisabled: {
    backgroundColor: 'rgb(142,142,147)',
  },
  guessButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 25
  }
});
