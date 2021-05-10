This project aims to refresh my Java programming skills by recreating the classic dice game, Yacht.

The main algorithm consists of a parser that reads the result of the dice rolls to display the applicable scoring categories to the player, then compute the chosen score. A text-based interface is also used, which could be further extended to a gui or even an Android project as a further excercise.

The rules for Yacht were taken from Wikipedia: https://en.wikipedia.org/wiki/Yacht_(dice_game)

A breakdown of the game is as follows:
1. Player rolls five dice.
2. Player can score their roll or choose any number of dice to reroll. The player can reroll up to two times.
3. Player chooses to score in any available category. If the dice to not apply to any available categories, then the player chooses to put a zero in any available category.
4. The game ends when all categories are filled with scores, including zeros, which lasts 12 total rounds per player.
5. The final score is simply the addition of all categories, including a bonus for the single-number categories if achieved.

Categories:
    Single Numbers:
        1. Ones: Sum of ones dice
        2. Twos: Sum of twos dice
        3. Threes: Sum of threes dice
        4. Fours: Sum of fours dice
        5. Fives: Sum of fives dice
        6. Sixes: Sum of sixes dice
        7. Bonus of 35 points if single number scores are greater than 62
    Combinations:
        8. Full House: A pair of three and a pair of two, score is sum of all dice
        9. Four-of-a-Kind: At least four matching dice, sum of the four matching dice
        10. Little Straight: 1-2-3-4-5, 30 points
        11. Big Straight 2-3-4-5-6, 30 points
        12. Choice: Sum of all dice
        13. Yacht: Five-of-a-Kind, 50 points

---UPDATE 5/10/2021

I aim to incrementally deploy this finished program to AWS.
This will be done in the stages as follows:
	1. Modify core program in preparation
		1.a. Initialize git repository
		1.b. Only allow 1 player at a time
		1.c. Prompt player name and game name at the end, allow option for no saving.
	2. Prepare database integration
		2.a. Create SaveToDatabase method, allowing for different implementations.
		2.b. Use AWS Java SDK functions for writing to DynamoDB. Create and document schema.
		2.c. OPTIONAL - use locally stored MongoDB
	3. Begin AWS migration
		3.a. Clone Git repository on EC2 instance
		3.b. Test DynamoDB functionallity from EC2
	4. Construct website version
		4.a. Port game to JavaScript if necessary
		4.b. Use NGINX for hosting, Use AWS Route 53 for DNS registration
		4.c. Use Vue.js for front-end integration, need input and output for game
		4.d. Web page for playing game, web page for viewing database, search database by player name
	5. Back-end monitoring
		5.a. Hook Lambda function on DynamoDB write, integrate with SES notification with target as environment variable
