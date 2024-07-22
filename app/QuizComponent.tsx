'use client';

import React, { useState, useEffect } from 'react';
import Timer from './Timer';

type QuestionType = 'mcq-single' | 'mcq-multiple' | 'fill-in-the-blank';

interface Option {
    id: string;
    text: string;
}

interface Question {
    id: string;
    type: QuestionType;
    text: string;
    options?: Option[];
    correctAnswer: string | string[];
}

interface QuizData {
    questions: Question[];
    timeLimit: number;
}

const QuizComponent: React.FC = () => {
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | string[] }>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeUp, setTimeUp] = useState(false);
    const [stopTimer, setStopTimer] = useState(false);

    useEffect(() => {
        fetchQuizData();
    }, []);

    const fetchQuizData = async () => {
        const response = await fetch('/api/quiz');
        const data = await response.json();
        setQuizData(data);
    };

    const handleAnswer = (questionId: string, answer: string | string[]) => {
        setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = () => {
        if (!quizData) return;

        setStopTimer(true);
        setSubmitted(true);

        let correctAnswers = 0;
        quizData.questions.forEach((question) => {
            const userAnswer = userAnswers[question.id];
            if (question.type === 'fill-in-the-blank') {
                if (typeof userAnswer === 'string' && typeof question.correctAnswer === 'string') {
                    if (userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
                        correctAnswers++;
                    }
                }
            } else if (Array.isArray(question.correctAnswer)) {
                if (Array.isArray(userAnswer) && userAnswer.sort().join(',') === question.correctAnswer.sort().join(',')) {
                    correctAnswers++;
                }
            } else {
                if (userAnswer === question.correctAnswer) {
                    correctAnswers++;
                }
            }
        });

        setScore(correctAnswers);
    };

    const handleTimeUp = () => {
        setTimeUp(true);
        setSubmitted(true);
        setStopTimer(true);
    };

    const getAnswerClass = (question: Question, optionId: string) => {
        if (!submitted && !timeUp) return 'bg-gray-100 text-gray-800';

        const isCorrect = Array.isArray(question.correctAnswer)
            ? question.correctAnswer.includes(optionId)
            : question.correctAnswer === optionId;

        const isSelected = Array.isArray(userAnswers[question.id])
            ? (userAnswers[question.id] as string[]).includes(optionId)
            : userAnswers[question.id] === optionId;

        if (isCorrect && isSelected) return 'bg-green-200 text-green-800';
        if (isSelected && !isCorrect) return 'bg-red-200 text-red-800';
        if (isCorrect) return 'bg-green-200 text-green-800';
        return 'bg-gray-100 text-gray-800';
    };

    const isAnswerCorrect = (question: Question, userAnswer: string | string[] | undefined): boolean => {
        if (question.type === 'fill-in-the-blank') {
            return typeof userAnswer === 'string' &&
                typeof question.correctAnswer === 'string' &&
                userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
        } else if (Array.isArray(question.correctAnswer)) {
            return Array.isArray(userAnswer) &&
                userAnswer.sort().join(',') === question.correctAnswer.sort().join(',');
        } else {
            return userAnswer === question.correctAnswer;
        }
    };

    if (!quizData) return <div className="text-gray-800">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
            <Timer initialTime={quizData.timeLimit} onTimeUp={handleTimeUp} stopTimer={stopTimer} />
            {quizData.questions.map((question) => (
                <div key={question.id} className="mb-8 p-4 bg-white rounded shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">{question.text}</h2>
                    {question.type === 'fill-in-the-blank' ? (
                        <div>
                            <input
                                type="text"
                                className="w-full p-2 border rounded text-gray-800"
                                onChange={(e) => handleAnswer(question.id, e.target.value)}
                                disabled={submitted || timeUp}
                            />
                            {(submitted || timeUp) && (
                                <div className="mt-2">
                                    {!isAnswerCorrect(question, userAnswers[question.id]) && (
                                        <div className="text-red-600 mb-1">
                                            Your answer: {userAnswers[question.id] || '(No answer provided)'}
                                        </div>
                                    )}
                                    <div>
                                        <span className="font-semibold text-gray-800">Correct answer: </span>
                                        <span className="text-green-600">{question.correctAnswer}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {question.options?.map((option) => (
                                <label key={option.id} className={`flex items-center p-2 rounded cursor-pointer ${getAnswerClass(question, option.id)}`}>
                                    <div className="relative w-5 h-5 mr-2">
                                        <input
                                            type={question.type === 'mcq-single' ? 'radio' : 'checkbox'}
                                            name={question.id}
                                            value={option.id}
                                            onChange={() => {
                                                if (question.type === 'mcq-single') {
                                                    handleAnswer(question.id, option.id);
                                                } else {
                                                    const currentAnswers = userAnswers[question.id] as string[] || [];
                                                    const updatedAnswers = currentAnswers.includes(option.id)
                                                        ? currentAnswers.filter((id) => id !== option.id)
                                                        : [...currentAnswers, option.id];
                                                    handleAnswer(question.id, updatedAnswers);
                                                }
                                            }}
                                            disabled={submitted || timeUp}
                                            className="absolute opacity-0 w-0 h-0"
                                        />
                                        <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center">
                                            <div className={`w-3 h-3 rounded-full ${(Array.isArray(userAnswers[question.id])
                                                ? (userAnswers[question.id] as string[]).includes(option.id)
                                                : userAnswers[question.id] === option.id)
                                                ? 'bg-blue-500'
                                                : ''
                                                }`}></div>
                                        </div>
                                    </div>
                                    {option.text}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <button
                onClick={handleSubmit}
                disabled={submitted || timeUp}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                Submit
            </button>
            {(submitted || timeUp) && (
                <div className="mt-4 p-4 bg-white rounded shadow">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Quiz Results</h2>
                    <p className="text-gray-800">Your score: {score} out of {quizData.questions.length}</p>
                </div>
            )}
        </div>
    );
};

export default QuizComponent;