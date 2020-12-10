# Chat Logger

This is an app to log what users say in a specific Twitch chat. It can log multiple channels
and it creates folders for each channel, in these folders a .log file is created with the name format: dd-mm-yyyy.log


## Getting Started

These instructions will instruct you on how to set it up on your machine.

### Prerequisites

  You need a computer or server running Linux OS

### Installing

How to get the development enviroment up and going

    Download & Install Node.js
    
    Change the opts.json file by removing "#torkitisthebest" and adding your own channel or the channel you want to use to use the command "#log xQcOW" f.e.
    But remember to have a hashtag (#) in front of the username.
    
    npm install tmi.js, node-fetch, fs, express, colors

## Running the app

To run the test after you've installed the necessary packages, do **node index.js** or **npm run main** in the same folder that the file is in

## Versioning

I use [SemVer](http://semver.org/) when updating the version of the app.
