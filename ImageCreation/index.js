/*
How to use: start API with node ./index.js
- to request new car: http://127.0.0.1:8090/create
- will return a png image of the randomly generated car
NOTE: This is only a small subset of images that I was generously given from a friend's project...
  The full set is more robust, but will run on this same API.
*/


const express = require("express")
const app = express()
let port = 8090
const requestRoute = require("./routes/create")

app.use("/create", requestRoute)
app.use(express.json())
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
})