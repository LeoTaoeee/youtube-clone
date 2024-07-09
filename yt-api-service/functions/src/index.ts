import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

initializeApp();

const firestore = new Firestore();

export const createUser = functions.auth.user().onCreate((user) => {
  // create user functions thats called on event
  // collect standard userInfo
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  // Update fireStore with userInfo
  // If one doesnt exist itll automatically create one
  firestore.collection("users").doc(user.uid).set(userInfo);
  // log User Creation
  logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  return;
});

