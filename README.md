# Transparent Automated Ads Demo App

This app is a demo app to help you test, debug and get started with Transparent Automated Ads API. It uses Node/Express for the backend and API, and React with hooks, routing and styled component support on the frontend.

## Supported API List
- Seller Eligibility Check
- Seller Business Onboarding
- Seller Business Retrieval
- Seller Business Config Update
- Seller Campaign Creation and Update
- Campaign Info and Reporting
- Invoice Group Management

## On the front-end

- edit files in `app` folder, it contains all the React stuff

## On the back-end

- your app starts at `server.js`
- api controller lives in `api/controller.js`
- configuration in `config.js`

## Configuartion
- If the authentication is not configured in the field AUTH_APP_ID of `config.js`, the mock data in `mock.js` will be used for all of API calls.
- Otherwise, the logged in user is required to have ADMIN permission to make API calls.

## To run the app locall:
```
- Install Nodejs version >= 12.x
- Go to the working directory
- Run command 'npm install && node server.js'
```

## License
As with any software that integrates with the Facebook platform, your use of this software is subject to the [Facebook Platform Policy](http://developers.facebook.com/policy/). This copyright notice shall be included in all copies or substantial portions of the software.
