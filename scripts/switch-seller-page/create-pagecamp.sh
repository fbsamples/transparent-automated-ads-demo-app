#!/bin/bash
source config.sh

SELLER_PAGE=$1
SELLER_ID=$2
BUDGET=$3
START_TIME=$4
END_TIME=$5

./update-page.sh $SELLER_PAGE $SELLER_ID

./gen-token.sh $SELLER_ID

./create-campaign.sh $BUDGET $START_TIME $END_TIME
