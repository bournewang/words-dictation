// src/components/PracticeSessionControls.js
import React from 'react';

function PracticeSessionControls({ onStartNewSession, onResumePractice, hasUnfinishedSession }) {
    return (
        <div className="max-w-md mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
            <div className="px-6 py-8 flex flex-col items-center justify-center space-y-4">

                <button
                    onClick={onStartNewSession}
                    className="px-4 py-2  bg-blue-500 text-white rounded hover:bg-blue-600 w-2/3"
                >
                    Start New Practice
                </button>
                {hasUnfinishedSession && (
                    <button
                        onClick={onResumePractice}
                        className="px-4 py-2 m-2 bg-green-500 text-white rounded hover:bg-green-600 w-2/3"
                    >
                        Resume Previous Practice
                    </button>
                )}
            </div>
        </div>
    );
}

export default PracticeSessionControls;