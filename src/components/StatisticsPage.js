// StatisticsPage.js
import React from 'react';

function StatisticsPage({ statistics, vocabulary }) {
    const chapters = Object.keys(statistics).sort();

    // Find the maximum number of sessions for any chapter
    const maxSessions = Math.max(
      0,  // Ensure we always have a non-negative number
      ...chapters.map(chapter => (statistics[chapter] && statistics[chapter].length) || 0)
    );
  
    if (maxSessions === 0) {
      return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Statistics</h1>
          <p>No practice sessions recorded yet.</p>
        </div>
      );
    }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Statistics</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chapter
              </th>
              {[...Array(maxSessions)].map((_, index) => (
                <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chapters.map(chapter => (
              <tr key={chapter}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {chapter} 
                  <p className="text-sm text-gray-500">Total: </p>
                </td>
                {[...Array(maxSessions)].map((_, index) => {
                  const session = statistics[chapter][index];
                  return (
                    <td key={index} className="px-6 py-4 whitespace-nowrap ">
                      {session ? (
                        <div>
                            <p className="text-lg text-black-500">{session.rate}</p>
                            <p className="text-sm text-gray-500">{session.correct}/{session.total}</p>
                          {/* <p>Correct: {session.correct}</p> */}
                          {/* <p>Wrong: {session.wrong}</p> */}
                          
                        </div>
                      ) : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StatisticsPage;