
require("dotenv").config()
require("./db")
const express = require("express")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const cors = require("cors")
const path = require("path");
const morgan = require("morgan")

const user = require("./routes")

const app = express();

const port = process.env.PORT;



app.use(express.static(path.join(__dirname, "src/uploads")));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(mongoSanitize())
app.use(cors())
app.use(express.json())
app.use(xss())
app.use(morgan("tiny"))

app.use("/", user)


app.listen(port, () => {
    console.log(`App is running at port ${port}`)
})