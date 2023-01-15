import express from 'express';
import bodyParser from 'body-parser';
import {
  filterImageFromURL, 
  deleteLocalFiles, 
  validateURL
} from './util/util';



(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  // filter image url
  app.get("/filteredimage/", async (req, res) => {
    const { image_url } = req.query
    const is_valid = validateURL(image_url)

    if (!is_valid) {
      return res.status(422).send("Invalid or No Image URL provided")
    }

    await filterImageFromURL(image_url)
    .then(response => {
      res.status(200).sendFile(response, err => {
        if(err) res.sendStatus(500)
        deleteLocalFiles([response])
      })
    })
    .catch(() => {
      res.status(500).send('Internal Server Error.')
    })
  })
  

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();