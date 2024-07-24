import React, { useState } from 'react';

function Settings({ intervals, setIntervals }) {
    const [tempIntervals, setTempIntervals] = useState(intervals);

    const handleSave = () => {
        setIntervals(tempIntervals);
        alert('Settings saved successfully!');
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
            <div className="px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="correctInterval" className="block text-sm font-medium text-gray-700 mb-1">
                            Time interval for correct answers (milliseconds):
                        </label>
                        <input
                            type="number"
                            id="correctInterval"
                            value={tempIntervals.correct}
                            onChange={(e) => setTempIntervals({ ...tempIntervals, correct: Number(e.target.value) })}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-lg border-gray-300 rounded-md"
                            min="0"
                            step="100"
                        />
                    </div>
                    <div>
                        <label htmlFor="incorrectInterval" className="block text-sm font-medium text-gray-700 mb-1">
                            Time interval for incorrect answers (milliseconds):
                        </label>
                        <input
                            type="number"
                            id="incorrectInterval"
                            value={tempIntervals.incorrect}
                            onChange={(e) => setTempIntervals({ ...tempIntervals, incorrect: Number(e.target.value) })}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-lg border-gray-300 rounded-md"
                            min="0"
                            step="100"
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;