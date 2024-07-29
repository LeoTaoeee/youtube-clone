"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVideo = setVideo;
exports.isVideoNew = isVideoNew;
const firebase_admin_1 = require("firebase-admin");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
(0, app_1.initializeApp)({ credential: firebase_admin_1.credential.applicationDefault() });
//theres only a single firetore object allowed per project, so we dont have to specify
const firestore = new firestore_1.Firestore();
// Note: This requires setting an env variable in Cloud Run
/** if (process.env.NODE_ENV !== 'production') {
  firestore.settings({
      host: "localhost:8080", // Default port for Firestore emulator
      ssl: false
  });
} */
const videoCollectionId = 'videos';
/**
* @param videoId - The Id of the video to retrieve
* @returns The video, or undefined if the video doesnt exist
**/
function getVideo(videoId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const snapshot = yield firestore.collection(videoCollectionId).doc(videoId).get();
        return (_a = snapshot.data()) !== null && _a !== void 0 ? _a : {};
    });
}
/**
 * @param videoId - The Id of the video to set
 * @param video - The data of the video to set
 * @returns A promise that resolves when the video has been set
 */
function setVideo(videoId, video) {
    return firestore
        .collection(videoCollectionId)
        .doc(videoId)
        .set(video, { merge: true }); //merge ensures that it will not delete information from previous set attempts
}
/**
 * @param videoId - The Id of the video
 * @returns A binary representing whether the video already exist or not
 */
function isVideoNew(videoId) {
    return __awaiter(this, void 0, void 0, function* () {
        const video = yield getVideo(videoId);
        return (video === null || video === void 0 ? void 0 : video.status) === undefined;
    });
}
