import express from 'express';
import { isVideoNew, setVideo } from "./firestore";

import {
  uploadProcessedVideo,
  downloadRawVideo,
  deleteRawVideo,
  deleteProcessedVideo,
  convertVideo,
  setupDirectories
} from './storage';

// Create the local directories for videos
setupDirectories();

//Use Express
const app = express();
app.use(express.json());

// Process a video file from Cloud Storage into 360p
app.post('/process-video', async (req, res) => {

  // Get the bucket and filename from the Cloud Pub/Sub message
  // refactored from Google Pub/Sub documentation
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload received.');
    }
  } catch (error) {
    console.error(error);
    return res.status(400).send('Bad Request: missing filename.');
  }

  const inputFileName = data.name; // In format of <UID>-<DATE>.<EXTENSION>
  const outputFileName = `processed-${inputFileName}`;
  const videoId = inputFileName.split('.')[0];

  if (!isVideoNew(videoId)) {
    //check that the video isnt already processed
    return res.status(400).send('Bad Request: video already processing or processed.');
  } else {
    //set video to processing status
    await setVideo(videoId, {
      id: videoId,
      uid: videoId.split('-')[0],
      status: 'processing'
    });
  }

  // Download the raw video from Cloud Storage
  await downloadRawVideo(inputFileName);

  // Process the video into 360p
  try {
    await convertVideo(inputFileName, outputFileName)
  } catch (err) {
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ]);
    return res.status(500).send('Processing failed');
  }

  // Upload the processed video to Cloud Storage
  await uploadProcessedVideo(outputFileName);

  //set video to processed
  await setVideo(videoId, {
    status: 'processed',
    filename: outputFileName
  });

  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName)
  ]);

  return res.status(200).send('Processing finished successfully');
});

const port = process.env.PORT || 2468;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
