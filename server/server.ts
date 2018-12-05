import * as express from "express";
import * as cors from "cors";
// import * as mongoose from "mongoose";
// import { Schema, Document } from "mongoose";
// import * as bodyParser from "body-parser";
// const validColorPattern = /^#[0-9A-F]{3,6}$/i;

//
// express app config
//
const expressApp = express();
const doorRouter = express.Router();
const port = 7753;
const host = "127.0.0.1";

expressApp.use(cors());

//
// Variable to store door state
//

let doorOpen : boolean = false


//
//POST close door
//
doorRouter.get("/close", function(req: express.Request, res: express.Response) {
  // Pixel.find({}, function(err: Error, pixels: Document[]) {
  //   if (err !== undefined && err !== null) {
  //     const msg = "error getting all pixels";
  //     console.error(msg, err);
  //     return res.status(500).json({ error: msg });
  //   }

  //   res.status(200).json(pixels);
  // });
  doorOpen = false
  console.log("CLOSED DOOR")

  
  res.status(200).json({"state":doorOpen})
});

// POST open door

doorRouter.get("/open", function(req: express.Request, res: express.Response) {

  doorOpen = true
  console.log("OPENED DOOR")
  res.status(200).json({"state":doorOpen})
});

doorRouter.get("/state", function(req: express.Request, res: express.Response) {
  res.status(200).json({"state":doorOpen})
});


//
// attach the door REST router
//
expressApp.use("/api/door", doorRouter);

//
// start up the express app
//
expressApp.listen(port, host);
console.log(`listening http://${host}:${port}`);

// //
// // connect to mongodb server
// //
// mongoose.connect(
//   "mongodb://127.0.0.1:27017/sample-sync-rest",
//   { useNewUrlParser: true }
// );
