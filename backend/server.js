//import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const port = process.env.PORT || 8081;

const notes = require('./notes/routes/api/notes');

// define the Express app
const app = express();

// enhance your app security with Helmet
app.use(helmet());

// use bodyParser to parse application/json content-type
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// enable all CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan('combined'));

// DB Config
const db = require("./backend/config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Note Routes
app.use("/api/notes", notes);

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  http.use(express.static("client/build"));
}

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// start the server
app.listen(port, () => { console.log(`Server up and running on port ${port} !`);
});
