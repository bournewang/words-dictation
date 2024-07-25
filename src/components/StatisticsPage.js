import React from 'react';

function StatisticsPage({ exerciseStats }) {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Exercise Statistics</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chapter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Words</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wrong Words</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct Rate</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(exerciseStats).map(([chapter, stats]) => (
              <tr key={chapter}>
                <td className="px-6 py-4 whitespace-nowrap">{chapter}</td>
                <td className="px-6 py-4 whitespace-nowrap">{stats.total}</td>
                <td className="px-6 py-4 whitespace-nowrap">{stats.wrong}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {((stats.correct / stats.total) * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StatisticsPage;