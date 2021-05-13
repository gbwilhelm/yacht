This project aims to refresh my Java programming skills by recreating the classic dice game, Yacht.

The main algorithm consists of a parser that reads the result of the dice rolls to display the applicable scoring categories to the player, then compute the chosen score. A text-based interface is also used, which could be further extended to a gui or even an Android project as a further exercise.

The rules for Yacht were taken from Wikipedia: https://en.wikipedia.org/wiki/Yacht_(dice_game)

A breakdown of the game is as follows:
1. Player rolls five dice.
2. Player can score their roll or choose any number of dice to reroll. The player can reroll up to two times.
3. Player chooses to score in any available category. If the dice to not apply to any available categories, then the player chooses to put a zero in any available category.
4. The game ends when all categories are filled with scores, including zeros, which lasts 12 total rounds per player.
5. The final score is simply the addition of all categories, including a bonus for the single-number categories if achieved.

Categories:
1. Ones: Sum of ones dice
2. Twos: Sum of twos dice
3. Threes: Sum of threes dice
4. Fours: Sum of fours dice
5. Fives: Sum of fives dice
6. Sixes: Sum of sixes dice
7. Bonus of 35 points if single number scores are greater than 62
8. Full House: A pair of three and a pair of two, score is sum of all dice
9. Four-of-a-Kind: At least four matching dice, sum of the four matching dice
10. Little Straight: 1-2-3-4-5, 30 points
11. Big Straight 2-3-4-5-6, 30 points
12. Choice: Sum of all dice
13. Yacht: Five-of-a-Kind, 50 points

NOTE: The player must score in a valid category before being allowed to zero a category

---UPDATE 5/10/2021

I aim to incrementally deploy this finished program to AWS.

Currently, the Java program successfully writes to DynamoDB, which triggers a Lambda function (code included). The Lambda function extracts the name of the player and total score of the game, then sends a formatted email to an SNS Topic.

Note: The AWS version source code is Yacht_AWS.java, I will not include the entire build on this repository. The non-AWS version has no dependencies and can be run on any Java platform, however the AWS version is built using the AWS SDK in Eclipse.

The remaining stages are as follows:
1. Construct local web version
	1. Construct skeleton website: About/Home, Game, Leaderboard pages
	2. Convert Java to Javascript, integrate with front end via Vue
2. Move project to AWS
	1. Provision EC2 server, install NGINX and node.js
	2. Upload project .zip to S3, download on EC2
	3. Alter code to use AIM Role and not local access keys
	4. Use AWS Route 53 for DNS registration
