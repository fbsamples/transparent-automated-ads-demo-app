#! /bin/bash
source config.sh

SELLER_ID=$1
SELLER_PAGE=$2

response=`curl -G \
 -d 'access_token='$ACCESS_TOKEN \
$GRAPH_API/$SELLER_ID/owned_pages?fields=id`

IFS='"' read -a strarr <<< "$response"
primary_page="${strarr[5]}"

curl -X POST \
 -F 'primary_page='$primary_page \
 -F 'access_token='$ACCESS_TOKEN \
$GRAPH_API/$SELLER_ID

curl -X POST \
 -F 'page_id='$SELLER_PAGE \
 -F 'permitted_tasks=["ADVERTISE"]' \
 -F 'access_token='$ACCESS_TOKEN \
$GRAPH_API/$SELLER_ID/client_pages
