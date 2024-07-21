// app/Timer.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface TimerProps {
    initialTime: number;
    onTimeUp: () => void;
    stopTimer: boolean;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, stopTimer }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (stopTimer) {
            return;
        }

        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, onTimeUp, stopTimer]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="text-xl font-semibold mb-4 text-gray-800">
            Time left: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
    );
};

export default Timer;