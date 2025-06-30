import React, { createContext, useReducer, ReactNode } from "react";
import questions from "../data";
import { shuffleAnswers } from "../ShuffleAnswers";
import { shuffleQuestions } from "../ShuffleQuestions";

const shuffledQuestions = shuffleQuestions(questions);

interface QuizState {
  questions: any[];
  currentQuestionIndex: number;
  currentAnswer: string;
  answers: string[];
  showResults: boolean;
  correctAnswersCount: number;
  wrongAnswersCount: number;
}

interface QuizAction {
  type: string;
  payload?: any;
}

const initialState: QuizState = {
  questions: shuffledQuestions,
  currentQuestionIndex: 0,
  currentAnswer: "",
  answers: [],
  showResults: false,
  correctAnswersCount: 0,
  wrongAnswersCount: 0,
};

initialState.answers = shuffleAnswers(initialState.questions[initialState.currentQuestionIndex]);


const reducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case "SELECT_ANSWER": {
      const correctAnswersCount =
        action.payload ===
        state.questions[state.currentQuestionIndex].correctAnswer
          ? state.correctAnswersCount + 1
          : state.correctAnswersCount;
      const wrongAnswersCount =
        action.payload ===
        state.questions[state.currentQuestionIndex].correctAnswer
          ? state.wrongAnswersCount
          : state.wrongAnswersCount + 1;
      return {
        ...state,
        currentAnswer: action.payload,
        correctAnswersCount,
        wrongAnswersCount,
      };
    }
    case "NEXT_QUESTION": {
      const showResults =
        state.currentQuestionIndex === state.questions.length - 1;
      const currentQuestionIndex = showResults
        ? state.currentQuestionIndex
        : state.currentQuestionIndex + 1;
      const answers = showResults
        ? []
        : shuffleAnswers(state.questions[currentQuestionIndex]);
      return {
        ...state,
        currentAnswer: "",
        showResults,
        currentQuestionIndex,
        answers,
      };
    }
    case "SHOW_RESULTS": {
      return {
        ...state,
        showResults: true,
      };
    }
    
    case "RESTART": {
      return initialState;
    }
    default:
      return state;
  }
};

export const QuizContext = createContext<[QuizState, React.Dispatch<QuizAction>]>(
  [initialState, () => {}]
);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = useReducer(reducer, initialState);

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
