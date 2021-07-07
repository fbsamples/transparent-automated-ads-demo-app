# Copyright (c) Facebook, Inc. and its affiliates.

#!/bin/bash
source config.sh

SELLER_PAGE=$1
SELLER_ID=$2

result=`curl -X POST \
 -F 'active_page_id='$SELLER_PAGE \
 -F 'access_token='$ACCESS_TOKEN \
$GRAPH_API/$SELLER_ID/aams_seller_business_setup`

IFS='"' read -a strarr <<< "$result"

echo "${strarr[11]}" > seller-ad-account
