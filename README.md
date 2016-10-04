# NexusMUD
Web-based MUD with some modern MMORPG functionality.

## Goal
The goal with this project is to create a MUD that obfuscates the ability for the user to know their stats or even the names of other players (when first meeting), mirroring the real world as a result.  It hopes to make all stat values translated into a language that reduces the ability of players to "min-max", furthermore there will be random variation during the creation of characters.

## Requirements
The following programs need to be installed to be able to run the server

1. [Node.js](https://nodejs.org/en/) - Latest version
2. [MongoDB](https://www.mongodb.com/) - Latest version - Make sure the mongod.exe is specified in the path variable.
3. [Gulp Global Install](https://www.npmjs.com/package/gulp) - Installed via NPM - `npm install -g gulp`

## Setup

1. Clone the repository into your preferred location - `git clone https://github.com/Migsect/NexusMUD`
2. Install the required modules via NPM - `npm install`
3. Build the client-side javascript - `gulp webpack` or `gulp webpack:watch` if you are developing and want autocompiling
4. Start the database (unless you already have one running and its configured) - `gulp database`
5. Start the server - `gulp server`

Note that the `start.bat` and `start_dev.bat` run the server for each respective mode.  These do not clone the repository.

## Configuration
All configuration files are to be located in the `ROOT/config` directory of the project.  Here you can customize many of the features of the server as well as specify database paths and other operational parameters.

## Features

### Current
* Account creation
* Component based Attributes
* Character creation
* Chat

### Planned
* Location moving and creation
* Abilities and Spells
* Professions and Trade Skills
* Combat
* Construction / Improving Locations
* ... more ...

## Pull Requests
TODO
