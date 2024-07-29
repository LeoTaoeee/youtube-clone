import { credential } from "firebase-admin";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";

initializeApp({credential: credential.applicationDefault()});

//theres only a single firetore object allowed per project, so we dont have to specify
const firestore = new Firestore();

// Note: This requires setting an env variable in Cloud Run
/** if (process.env.NODE_ENV !== 'production') {
  firestore.settings({
      host: "localhost:8080", // Default port for Firestore emulator
      ssl: false
  });
} */


const videoCollectionId = 'videos';

//? means optional
//id is required for all movies, but making it optional makes set requests less verbose/easier
export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title?: string,
  description?: string
}

/**
* @param videoId - The Id of the video to retrieve
* @returns The video, or undefined if the video doesnt exist
**/
async function getVideo(videoId: string) {
  const snapshot = await firestore.collection(videoCollectionId).doc(videoId).get();
  return (snapshot.data() as Video) ?? {};
}

/**
 * @param videoId - The Id of the video to set
 * @param video - The data of the video to set
 * @returns A promise that resolves when the video has been set
 */
export function setVideo(videoId: string, video: Video) {
  return firestore
    .collection(videoCollectionId)
    .doc(videoId)
    .set(video, { merge: true }) //merge ensures that it will not delete information from previous set attempts
}

/**
 * @param videoId - The Id of the video
 * @returns A binary representing whether the video already exist or not
 */
export async function isVideoNew(videoId: string) {
  const video = await getVideo(videoId);
  return video?.status === undefined;
}