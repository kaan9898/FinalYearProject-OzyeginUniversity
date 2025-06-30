export const shuffleAnswers = (question: { correctAnswer: string; incorrectAnswers: string[] }): string[] => {
  if (!question) {
    return [];
  }
  const unshuffledAnswers: string[] = [
    question.correctAnswer,
    ...question.incorrectAnswers,
  ];
  return unshuffledAnswers
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
};
