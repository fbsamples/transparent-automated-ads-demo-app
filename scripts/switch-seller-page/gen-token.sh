# Copyright (c) Facebook, Inc. and its affiliates.

#!/bin/bash
source config.sh

SELLER_ID=$1

result=`curl \
 -F 'app_id='$APP_ID \
 -F 'scope=ads_management,business_management' \
 -F 'access_token='$ACCESS_TOKEN \
$GRAPH_API/$SELLER_ID/access_token`

IFS='"' read -a strarr <<< "$result"

echo "${strarr[3]}" > seller-token
