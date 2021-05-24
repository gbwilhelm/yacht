# Introduction

This project aims to refresh my Java and JavaScript programming skills and gain AWS experience by recreating the classic dice game, Yacht, and deploying it using AWS infrastructure. A more detailed explanation of this project can be found on the web version's homepage. The full source code for this project is public; however, AWS functionality requires my access credentials, which are obviously not included.

_When I host the web server, the link will be included here._

The structure of this repository is as follows:

# prog/

* prog/ contains my original Java version of this game that runs on the terminal, an AWS SDK project Java file that hooks the game up to my database, and my AWS Lambda Python script that sends me an email whenever my database is written to.
* The file Yacht.java can be run as-is; however, Yacht_AWS.java needs dependencies and credentials that are not included in this repository.

# web/

* web/ contains my node server, yarn configuration, and all the front-end pages and scripts. I also included a README with commands for adding the required node dependencies using yarn.
* The page index.html has no JavaScript and acts as a landing-page with a brief write-up of this project.
* The page game.html can be run without the back-end server and AWS credentials, however saving to the database would not be possible.
* The page leaderboard.html requires the back-end server to be running and AWS credentials in order to function.
