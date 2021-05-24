OUTDATED

This project aims to refresh my Java programming skills by recreating the classic dice game, Yacht.

The main algorithm consists of a parser that reads the result of the dice rolls to display the applicable scoring categories to the player, then compute the chosen score. A text-based interface is also used, which could be further extended to a gui or even an Android project as a further exercise.

I aim to incrementally deploy this finished program to AWS.

Currently, the Java program successfully writes to DynamoDB, which triggers a Lambda function (code included). The Lambda function extracts the name of the player and total score of the game, then sends a formatted email to an SNS Topic.

Note: The AWS version source code is Yacht_AWS.java, I will not include the entire build on this repository. The non-AWS version has no dependencies and can be run on any Java platform, however the AWS version is built using the AWS SDK in Eclipse.

The remaining stages are as follows:
1. Cleanup website css
2. Move project to AWS
