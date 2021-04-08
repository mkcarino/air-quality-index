# Air Quality Index (AQI) [Live Demo](https://air-quality-index-mkc.netlify.app)
A single-page user-friendly application that provides the air quality data of the user's current location or from any location in the world.
The application provides a clean user interface which presents you the air quality data in a clear and comprehensible manner that users of any age can easily understand.<br>


### Build with
* HTML
* CSS
* JS

## How to develop the app

**Initialize the environment**

1\. Clone the repository:

```
git clone https://github.com/mkcarino/air-quality-index.git
```

2\. Install the dependencies:

```bash
npm install
```

3\. Get Your Google Api and replace the one int ./src/index.html

```html
 <script src="https://maps.googleapis.com/maps/api/jslibraries=places&key={YOUR_KEY}&callback=initMap" async defer="defer"></script>   
```
3\. Get Your Air Quality Open Data Platform API [here](https://aqicn.org/data-platform/token/) and put it into the .env file
```bash
API_KEY={YOUR_KEY}
```
**Launch the app**

1\. Run the development server:

```bash
npm run start
```

2\. Open [localhost:8080](http://localhost:8080) to see the live app.

## What’s in the repo

This repo includes the source code of _LitHub_. The app has the following structure:

```

dist            
|- build         // Results of the webpack build (HTML,CSS,JS)
scripts
|-create-env.js  //Used for Netlify deploy
src
|- index.html    // Index html page
|- style.css     // Style for the application
|- templates     // Templates of HTML pages
|- utils         // Additional utilities
|- index.js      // The entry point.
.env.sample      // .env file for environment variables
.gitignore
package.json
package-lock.json
README.md
webpack.config.js //The webpack config file
```


## Acknowledgements
* [Google Maps API](https://developers.google.com/maps)
* [Air quality API](https://aqicn.org/data-platform/token/)
* [Webpack](https://webpack.js.org/)
* [Lodash](https://lodash.com/)
* [Dotenv](https://www.npmjs.com/package/dotenv-webpack)
* [AnimateCSS](https://animate.style/)
* [Axios](https://github.com/axios/axios)

Project for Javascript-Advanced by start2Impact
(the Google API is restricted, and can be used only by the site above)
