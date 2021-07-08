# Introduction

This project aims to refresh my Java and JavaScript programming skills and gain AWS experience by recreating the classic dice game, Yacht, and deploying it using AWS infrastructure. A more detailed explanation of this project can be found on the web version's homepage. The full source code for this project is public; however, a locally ran copy would only work front-end.

To set up my web server over SSH, I cloned my git repository, then copied the web directory to a local workspace. I needed to modify the filepaths in my server.js to use absolute paths instead of local paths, and I did not want to track these changes with git or open a different branch. I edited the crontab of my VM to run my server with the @reboot hook; this is why I needed to use absolute filepaths. Instead of running my server via node, I installed and run my server via Forever, which should relaunch my server if it ever crashes.

The EC2 instance is currently terminated; the DynamoDB table has also been deleted with a backup. There are no current plans to relaunch the server, but the source code will still be available.

Since the scope of this project is small and the cost of DNS hosting is high for my needs, I do not plan on registering a new domain name other than the default EC2 DNS name. Since I do not own my EC2 instance's domain, I am unable to get an official SSL certificate. As such, I am using a self-signed certificate, which throws a browser warning on the first visit.

If I did register a domain name and obtain a signed cert, this is how I would do it. First, I would register a domain name with AWS Route 53. I would probably use a com TLD, which Amazon prices at $12. Then, I would simply obtain a free SSL certificate from AWS Certificate Manager using that domain. My server code would be modified to access the cert via the AWS Javascript SDK. I would also install and run NGINX to enable my site to use ports 80 and 443.

The structure of this repository is as follows:

# prog/

* prog/ contains my original Java version of this game that runs on the terminal, an AWS SDK project Java file that hooks the game up to my database, and my AWS Lambda Python scripts.
* The file Yacht.java can be run as-is; however, Yacht_AWS.java needs dependencies and credentials that are not included in this repository.

# web/

* web/ contains my node server, yarn configuration, and all the front-end pages and scripts. I also included a README with some additional explanations for running the server locally.
* The page index.html has no JavaScript and acts as a landing-page with a brief write-up of this project.
* The page game.html can be run without the back-end server and AWS credentials, however saving to the database would not be possible.
* The page leaderboard.html requires the back-end server to be running and AWS credentials in order to function.
