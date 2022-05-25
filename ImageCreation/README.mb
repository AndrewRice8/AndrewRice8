#Description
Functions for generating randomly configured and colored vehicle images, as well as a simple API
to pull them from a browser.  There aren't many different varieties of art, but more layers can be added
and more base images can be added to those layers to add variety.

#Usage
##Run index.js to start the API at 127.0.0.1:8090/create
##API routes
###/create/
Creates a random vehicle image
###/create/newcar
Create a random car
###/create/newbus
Create a random bus
##Adding more images to increase variety
1. Add .png images to the baseImages folder
2. Add the path to that layer to the layer title in config.json.

#Files
##index.js
Creates a simple API that can be accessed from 127.0.0.1:8090/create


###image.js
Contains most of the code and exports functions for manipulating and stacking .png images and producing a final image.
###routes/accept.js
Contains API endpoints for serving the image to the requester
###config.json
Contains paths to base images to be used in image generation

##NOTE
The file paths were created on windows...use Mac/Linux at your own risk
