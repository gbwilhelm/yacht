import os
import boto3

ec2 = boto3.client('ec2',region_name='us-east-1')

def lambda_handler(event, context):
    ec2.stop_instances(InstanceIds=[os.environ['EC2_ID']])
    return 'Lambda stopped the Yacht EC2 instance.'
