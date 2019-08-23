# Web Service Price Checker

## Overview
This is a simple Lambda function to keep an eye on a list of prices for you from a given website.

This is a bare bones implementation and does not include user friendly interfaces - you will have to get your hands a little dirty to make it run for your situation. You will also need to use a single service (e.g. Amazon) for all your product searches as it doesn't currently support multiple sources of information.

## Requirements
This has been written with AWS Lambdas in mind and you may have mixed success with other systems that run similar toolsets.

Your environment needs to be Node V10.x capable and be able to pass environment variables to the runtime.

### Steps to implement 
- Clone the repository 
- Run `npm install`
- Find the `getWishList` function in `utilities.ts`
- Replace the path to a file that is accessible to you. You can see an example of the structure needed in `./lib/products.json` (or just edit this one and change the path to match this file)
- If using a different website to Amazon you will need to alter the regex in `extractPrice` and `extractTitle` in `utilities.ts` to match the website `<div>`'s
- After making your changes be sure to `npm run compile` to produce your dist versions of the .ts files
- .zip your `dist` and `node_modules` folders into a single archive.
- Create your lambda function
- Upload your new archive to the lambda
- Set the source of your handler to `dist/index.handler`
- Add the following environment variables (with corresponding values):
  - `emailRecipient` (Who should receive the email)
  - `emailService` (Which email service you are using (e.g. gmail))
  - `username` (The username of your email service you wish to email from)
  - `password` (The password to your email account)
- You may need to configure your email account to allow for unsecure / 3rd party access
- Finally set up a schedule for the lambda to run

### Testing
You can test the code by running `npm run test`. If you are using a different website (than Amazon) then update the stub product in `./test/utilities.test.ts`.

Various watch scripts are provided when editing the main program or tests, these can be found in `package.json` under `scripts`

## Disclaimer
This is a personal project and as such is provided for free, but without warranty or guarentee.

Use at your own risk