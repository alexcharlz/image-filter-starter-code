const URL = require('url').URL

import fs from "fs";
import Jimp = require("jimp");
import fetch from "node-fetch";


// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      let fimg = await fetch(inputURL)
      let fimgb = Buffer.from(await fimg.arrayBuffer())
      const photo = await Jimp.read(fimgb)
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
        console.log('success')
      } catch (error) {
      console.log('error')
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}



// validate URL
// helper function to validate if a string in actually a url
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    a boolean (true or false)
export function validateURL(inputURL: string) {

  if (!inputURL) return false 

  try {
    new URL(inputURL)
    return true
  } catch {
    return false
  }
}