import React from 'react';

function CorrectRateDisplay({ rates }) {
    return (
        <div className="bg-white shadow rounded-lg p-4 mt-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Correct Rates</h3>
            <div className="mt-5 text-center">
                <p className="mt-1 text-3xl font-semibold text-green-600">
                    {rates.rate}
                </p>
                <p classname="text-sm text-gray-100 ">
                    {rates.correct}/{rates.total}
                </p>
            </div>
        </div>
    );
}

export default CorrectRateDisplay;