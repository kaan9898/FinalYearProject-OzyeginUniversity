export const shuffleQuestions = (questions: any[]): any[] => {
  return questions
    .map((q) => ({ sort: Math.random(), value: q }))
    .sort((a, b) => a.sort - b.sort)
    .map((q) => q.value);
};
