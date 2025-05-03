const express = require("express")
var bodyParser = require('body-parser')
var cors = require("cors");
import timeout from 'connect-timeout'; // npm install connect-timeout

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
  credentials: true // if you need to send cookies, else you can remove this
}));


app.use(timeout('5m'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


// PDF Operation
const pdfOperation = require('./routes/pdfOperation')
app.use("/pdf-operation",pdfOperation)

// Image Operation
const imageOperation = require("./routes/imageOperation")
app.use("/image-operation",imageOperation)

app.listen(9999, ()=>{
  console.log("server is running on port : ", 9999)
});