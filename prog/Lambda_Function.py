import json
import os
import boto3

def lambda_handler(event, context):
    message = ''
    for r in event['Records']:
        entry = r['dynamodb']['NewImage']
        message += entry['name']['S']+' finished a round with a score of '+str(entry['total']['N'])+'!\n'
    
    print(message)
    
    topic_arn = os.environ['SNS_TOPIC_ARN']
    subject = "Project Yacht Was Played"
    sns = boto3.client('sns')
    response = sns.publish(TopicArn=topic_arn,Message=message,Subject=subject)
    
    print(response)
    
    return {
        'statusCode': 200,
        'snsResponse':response
    }
