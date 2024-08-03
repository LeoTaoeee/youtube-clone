This is a somewhat barebones mostly-backend youtube clone that I made to learn more about making scaleable applications. 

I used nextJS/react, TypeScript for the frontend.
I used and firebase (functions, firestore) & google cloud (cloud storage, pub/sub, cloud run) for the backend. 

Everything is containerized with docker.

Currently it supports features like uploading videos, automatically processing the video (using ffmpeg to turn video to 360p since video storage isnt free) and then serving the video on the browser.
