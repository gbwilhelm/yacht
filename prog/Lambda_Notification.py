import os
import boto3

def lambda_handler(event, context):
    print(event)
    message = ''
    for r in event['Records']:
        #ignore non-insert events
        if r['eventName']!='INSERT': continue
        entry = r['dynamodb']['NewImage']
        message += entry['name']['S']+' finished the game '+entry['title']['S']+' with a score of '+str(entry['total']['N'])+'!\n'
        if entry['comment']['S']: message+='They left the following comment:\n'+entry['comment']['S']+'\n'
    if message:
        topic_arn = os.environ['SNS_TOPIC_ARN']
        subject = "Project Yacht Was Played"
        sns = boto3.client('sns')
        response = sns.publish(TopicArn=topic_arn,Message=message,Subject=subject)
        return {
            'statusCode': 200,
            'snsResponse':response
        }
    else:
        return {
            'statusCode': 200,
            'body': 'No INSERT events'
        }