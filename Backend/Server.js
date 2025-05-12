const express = require("express")
var bodyParser = require('body-parser')
var cors = require("cors");
const timeout = require('connect-timeout');
//-------------------------------------------------------
const app = express()

const allowedOrigins = ['http://localhost:5173', 'https://imapdf.vercel.app'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(timeout('5m'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// PDF Operation
const pdfOperation = require('./routes/pdfOperation')
app.use("/pdf-operation", pdfOperation)

// Image Operation
const imageOperation = require("./routes/imageOperation")
app.use("/image-operation", imageOperation)


// === Multer and general error handling middleware ===
app.use((err, req, res, next) => {
  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      status: "ERR",
      msg: err.message,
      data: []
    });
  }
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      status: "ERR",
      msg: "CORS error: Not allowed",
      data: []
    });
  }
  // Default error handler
  console.error(err.stack);
  res.status(500).json({
    status: "ERR",
    msg: "Internal Server Error",
    data: []
  });
});


app.listen(9999, () => {
  console.log("server is running on port :", 9999)
});
