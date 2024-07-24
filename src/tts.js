import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const subscriptionKey = 'f6e22df4e31f4700a7d99201d9a01796';
const serviceRegion = 'eastasia'

export function speakText(text) {
  return new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    synthesizer.speakTextAsync(
      text,
      result => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log('Synthesis finished.');
          resolve();
        } else {
          console.error('Speech synthesis canceled, ' + result.errorDetails);
          reject(new Error(result.errorDetails));
        }
        synthesizer.close();
      },
      error => {
        console.error('Error: ', error);
        synthesizer.close();
        reject(error);
      }
    );
  });
}