// Functions to generate the image to be returned by the API

const config = require("./config.json")
const fs = require("fs")
const gm = require("gm")
const replaceColor = require("replace-color") //npm library to create colorized vehicle bodies
const uuid = require("uuid-random")





// Create ID and ensure that it is unique...prevents duplicate file names/seeds 
let getUniqueIdentifier = function () {
    let R;
    while (1) {
        R = uuid();
        if (uuid.test(R)) {
            return R;
        }
    }
}

// Returns random RGB array to be plugged in to getRandomLayerColored()
let getRandomRGB = function (min = 0, max = 255) {
    let result = Array(3);
    for (let i = 0; i < 3; i++) {
        result[i] = Math.floor(Math.random() * max)
        if (result[i] < min) {
            result[i] += min;
        }
    }
    return result;
}


// Creates a copy of the image passed by baseLayerPath and gives it a random color, then saves it to newLayerPath
let getRandomLayerColored = async function (baseLayerPath, newLayerPath) {
    return new Promise(resolve => {
        replaceColor({
            image: baseLayerPath,
            colors: {
                type: 'rgb',
                targetColor: [0, 0, 0],
                replaceColor: getRandomRGB(),
            },
            deltaE: 30
        }).then(jimpObject => {
            jimpObject.write(newLayerPath)
            console.log("Created: ", newLayerPath)
            resolve(newLayerPath)
        })
    })

}

function selectRandomFromConfig(componentName) {
    items = config[componentName]
    // console.log("items: ",items)
    let idx = Math.floor(Math.random() * items.length);
    return items[idx];
}


function selectComponents(iscar) {
    var _components = {
        "base": "",
        "top": "",
        "tire": "",
        "rim": ""
    };
    let wheelSet = selectRandomFromConfig("wheelSets"); //Wheel sets come in pairs of rims/tires
    if (iscar == true) {
        _components.base = selectRandomFromConfig("carBases")
        _components.top = selectRandomFromConfig("carTops")
    } else {
        _components.base = selectRandomFromConfig("busBases")
        _components.top = selectRandomFromConfig("busTops")
    }
    //Wheels are independent of the body type
    _components.tire = config[wheelSet][0]
    _components.rim = config[wheelSet][1]
    return _components
}

// used Graphics Magic package to combine layers...optionally remove one or both of the layers combined
// GM only allows 2 images to be composited at a time, so they must be split up and combined 1 layer at a time
// The function must return a promise so that the images can be layered synchronously, otherwise they will not be ordered correctly.
function mergeImages(lower, upper, newName, removeLower = false, removeUpper = false) {
    return new Promise(resolve => {
        gm(lower).composite(upper).write(newName, err => {
            if (err) {
                console.log("Error in merge: ", err)
            } else {
                if (removeUpper) {          // Delete source layers if needed
                    fs.unlinkSync(upper)
                }
                if (removeLower) {
                    fs.unlinkSync(lower)
                }
                resolve(newName)
            }
        })
    })
}


// Pass boolean for whether making a car or not
// If creating a random car/bus, then pass nothing
let createRandomImage = async (makingCar = null) => {
    let isCar
    if (makingCar == null) {
        isCar = false
        if (Math.random() > 0.5) {
            isCar = true
        }
    }else{
        isCar = makingCar 
    }
    uniqueBase = getUniqueIdentifier()
    let colorName = uniqueBase +".png"
    let components = selectComponents(isCar)
    let coloredBody = await getRandomLayerColored(components.base, colorName)
    let bodyWithColor = await mergeImages(coloredBody, components.top, "bodyWithColor.png", true, false)
    let wheelsLower = await mergeImages(components.tire, bodyWithColor, "wheelsLower.png", false, true);
    let finalPath = await mergeImages(wheelsLower, components.rim, "./generated/" + uniqueBase + ".png", true, false);
    return finalPath
}



module.exports = {
    createRandomImage,
}

// ~~~~~~~~~~~~~ Utility functions not used in main code ~~~~~~~~~~~~~~~~~~~~~~

// Utility function to replace color with black
// - Used to sanitize layers when adding new model layers
// - targetColor is the color to replace with black...#58abd1 is the color that I recieved the images as
let removeColor = function (layerPath, newName, _targetColor = "#58abd1") {
    replaceColor({
        image: layerPath,
        colors: {
            type: 'hex',
            targetColor: _targetColor,
            replaceColor: "#000000",
        },
        deltaE: 30
    }).then((jimpObject) => {
        console.log("in jimp")
        jimpObject.write(newName, (err) => {
            if (err) {
                console.log("Error in jimp write: " + err)
            } else {
                console.log("New written")
            }
        })
    }).catch((err) => {
        console.log(err)
    })
}

// Function used when testing different filters/coloring methods
let colorizeImage = function (layerPath, newName) {
    retValue = "ERROR"
    gm(layerPath).colorize(120, 44, 200).write(newName, (e) => {
        if (e) {
            console.log("Error colorizing:" + newName)
        } else {
            console.log(newName + " created")
            retValue = newName
        }
    })
    return retValue
}


// These 2 functions were created to test creating cars and busses.  They were combined in the function createRandomImage() instead.
let createRandomBus = async () => {
    uniqueBase = getUniqueIdentifier()
    colorName = uniqueBase + "a.png"
    let components = selectComponents(false)
    let coloredBody = await getRandomLayerColored(components.base, colorName)
    let bodyWithColor = await mergeImages(coloredBody, components.top, "bodyWithColor.png", true, false)
    let wheelsLower = await mergeImages(components.tire, bodyWithColor, "wheelsLower.png", false, true);
    let finalPath = await mergeImages(wheelsLower, components.rim, "./generated/" + uniqueBase + ".png", true, false);
    return finalPath
}

let createRandomCar = async () => {
    uniqueBase = getUniqueIdentifier()
    colorName = uniqueBase + "a.png"
    let components = selectComponents(true)
    let coloredBody = await getRandomLayerColored(components.base, colorName)
    let bodyWithColor = await mergeImages(coloredBody, components.top, "bodyWithColor.png", true, false)
    let wheelsLower = await mergeImages(components.tire, bodyWithColor, "wheelsLower.png", false, true);
    let finalPath = await mergeImages(wheelsLower, components.rim, "./generated/" + uniqueBase + ".png", true, false);
    return finalPath
}
