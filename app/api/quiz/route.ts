// app/api/quiz/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const quizData = {
    questions: [
      {
        id: '1',
        type: 'mcq-single',
        text: 'What is the capital of France?',
        options: [
          { id: 'a', text: 'London' },
          { id: 'b', text: 'Berlin' },
          { id: 'c', text: 'Paris' },
          { id: 'd', text: 'Madrid' },
        ],
        correctAnswer: 'c',
      },
      {
        id: '2',
        type: 'mcq-multiple',
        text: 'Which of the following are primary colors?',
        options: [
          { id: 'a', text: 'Red' },
          { id: 'b', text: 'Green' },
          { id: 'c', text: 'Blue' },
          { id: 'd', text: 'Yellow' },
        ],
        correctAnswer: ['a', 'c', 'd'],
      },
      {
        id: '3',
        type: 'fill-in-the-blank',
        text: 'The largest planet in our solar system is ________.',
        correctAnswer: 'Jupiter',
      },
    ],
    timeLimit: 300, // 5 minutes
  };

  return NextResponse.json(quizData);
}