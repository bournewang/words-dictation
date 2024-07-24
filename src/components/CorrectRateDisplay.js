import React from 'react';

function CorrectRateDisplay({ rates }) {
    return (
        <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Correct Rates</h3>
            <dl className="mt-5 grid grid-cols-1 gap-2">
                {Object.entries(rates).map(([chapter, rate]) => (
                    <div key={chapter} className="px-4 py-2 bg-white1 shadow rounded-lg overflow-hidden sm:p-2">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            Chapter {chapter}
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {((rate.correct / rate.total) * 100).toFixed(2)}%
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

export default CorrectRateDisplay;