# Copyright (c) Facebook, Inc. and its affiliates.

#!/bin/bash
source config.sh

BUDGET=$1
START_TIME=$2
END_TIME=$3
AD_ACCOUNT_ID=`cat seller-ad-account`
SELLER_TOKEN=`cat seller-token`

curl -X POST \
 -F "lifetime_budget="$BUDGET \
 -F "start_time="$START_TIME \
 -F "end_time="$END_TIME \
 -F "override_targeting_countries=['VN']" \
 -F "override_creative_text=Buy Now at store" \
 -F "use_marketplace_template=true" \
 -F "conversion_domain=sendo.vn" \
 -F "access_token="$SELLER_TOKEN \
$GRAPH_API/act_$AD_ACCOUNT_ID/aams_ads > seller-campaign
