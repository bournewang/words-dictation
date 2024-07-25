import Papa from 'papaparse';

export const loadVocabulary = (vocabularyHandler) => {
    // Import the CSV file
    import('../data/vocabulary.csv')
        .then(module => {
            // The imported module contains the file path, not the content
            // We need to fetch the content using this path
            fetch(module.default)
                .then(response => response.text())
                .then(csvData => {
                    Papa.parse(csvData, {
                        complete: (results) => {
                            if (results.data && results.data.length > 0) {
                                const vocabularyByChapter = results.data
                                    .filter(row => row.length >= 3) // Ensure each row has at least 3 columns
                                    .reduce((acc, row) => {
                                        const chapter = row[0].trim();
                                        const word = row[1].trim();
                                        const meaning = row[2].trim();

                                        if (!acc[chapter]) {
                                            acc[chapter] = [];
                                        }

                                        acc[chapter].push({ word, meaning });
                                        return acc;
                                    }, {});

                                if (Object.keys(vocabularyByChapter).length > 0) {
                                    vocabularyHandler(vocabularyByChapter);

                                    // Create CSV content for display
                                    // const csvContent = Object.entries(vocabularyByChapter)
                                    //     .flatMap(([chapter, words]) =>
                                    //         words.map(({ word, meaning }) => `${chapter},${word},${meaning}`)
                                    //     )
                                    //     .join('\n');

                                    // setCsvInput(csvContent);
                                } else {
                                    console.error('No valid vocabulary entries found');
                                    alert('No valid vocabulary entries found in the CSV file. Please check the file format.');
                                }
                            } else {
                                console.error('CSV parsing resulted in empty data');
                                alert('Error parsing CSV file. Please check the file format.');
                            }
                        },
                        error: (error) => {
                            console.error('Error parsing CSV:', error);
                            alert('Error parsing CSV file. Please check the file format.');
                        }
                    });
                });
        })
        .catch(error => {
            console.error('Error importing CSV file:', error);
            alert('Error loading CSV file. Please check if the file exists and is accessible.');
        });

}