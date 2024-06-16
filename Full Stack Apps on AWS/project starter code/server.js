import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // image URL checks
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  const isImageUrl = (string) => {
    return (/\.(jpg|jpeg|png|gif|bmp)$/i).test(string);
  };

  // endpoint to filter an image from a public url.
  app.get('/filteredimage', async (req, res) => {
    const imageUrl = req.query.image_url;
  
    // 1. Validate the image_url query
    if (!imageUrl) {
      return res.status(422).send({ message: 'image_url is required' });
    }

    // Validate if imageUrl is a valid URL
    if (!isValidUrl(imageUrl)) {
      return res.status(422).send({ message: 'image_url must be a valid URL' });
    }

    // Validate if imageUrl is a valid image URL
    if (!isImageUrl(imageUrl)) {
      return res.status(422).send({ message: 'image_url must be a URL to an image file' });
    }
  
    try {
      // 2. Call filterImageFromURL(imageUrl) to filter the image
      const filteredPath = await filterImageFromURL(imageUrl);

      // 3. Send the resulting file in the response
      res.sendFile(filteredPath, (err) => {
        if (err) {
          return res.status(500).send({ message: 'Error sending the file' });
        }
        // 4. Delete files after finishing off the response
        deleteLocalFiles([filteredPath]);
      });
    } catch (error) {
      res.status(422).send({
        message: 'Error 422: Unprocessable Entity',
        error: error.message || error
      });
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
