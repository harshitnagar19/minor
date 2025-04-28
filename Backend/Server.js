const express = require("express")
var bodyParser = require('body-parser')
var cors = require("cors");

//-------------------------------------------------------
const app = express()
app.use(cors())



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