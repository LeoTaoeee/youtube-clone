import express from 'express';

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

const app = express();
app.use(express.json());

// Process a video file from Cloud Storage into 360p
app.post("/process-video",(req,res) => {
    //Get path of the input video file from the request
    const inputPath = req.body.inputPath;
    const outputPath = req.body.outputPath;

    //Check the file path is specified
    if(!inputPath || !outputPath){
        res.status(400).send("Bad Request: Missing input or output path");
    }

    //create the ffmpeg command
    ffmpeg(inputPath)
        //vf video file; scale it to 360p
        .outputOptions("-vf","scale=-1:360")
        .on("end",()=>{
            console.log("Processing finished successfully");
            res.status(200).send("Processing finished successfully");
        })
        .on("error",(err: any)=>{
            console.log('Error: ' +  err.message);
            res.status(500).send("Internal Server Error: " + err.message);
        })
        .save(outputPath);
});

const port = process.env.PORT || 2468;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});