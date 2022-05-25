/*
    Simple API for the backend 
    To get an image, run 'npm start' and go to 127.0.0.1:8090/req/...
    Example: http://127.0.0.1:8090/req/newcar will yield a png image of a randomly generated car
    ~~~~~~~~~~~~~ API USAGE ~~~~~~~~~~~~~~~~~~~~~~~~
    /req/newcar: Generate random car
    /req/newbus: Generate random bus
    /req/: Generate random vehicle(car, bus, etc.)
*/

const { Router } = require("express")

const NFT = require("../image.js")
const path = require("path")
const fs = require("fs")
const gm = require("gm")
const router = Router()

// 127.0.0.1:8090/create/newbus
    // Generate a random vehicle with a bus body

router.get("/newbus", async (req, res) => {
    newBusPath = await NFT.createRandomImage(false)
    // newBusPath = await NFT.createRandomBus()
    newBusPath = path.resolve(__dirname + "/../" + newBusPath)
    res.sendFile(newBusPath)
})


// 127.0.0.1:8090/create/newcar
    // Generate a random vehicle with a car body
router.get("/newcar", async (req, res) => {
    newCarPath = await NFT.createRandomImage(true)
    newCarPath = path.resolve(__dirname + "/../" + newCarPath)
    res.sendFile(newCarPath)
})

// 127.0.0.1:8090/create

// Get either random car or bus image
router.get("/", async (req, res) => {
    newCarPath = await NFT.createRandomImage()
    console.log("Path to new image:",newCarPath)
    newCarPath = path.resolve(__dirname + "/../" + newCarPath)
    res.sendFile(newCarPath)
})

module.exports = router