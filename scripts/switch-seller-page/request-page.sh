# Copyright (c) Facebook, Inc. and its affiliates.

#! /bin/bash
source config.sh

SELLER_ID=$1
SELLER_PAGE=$2

curl -X POST \
 -F 'page_id='$SELLER_PAGE \
 -F 'permitted_tasks=["ADVERTISE"]' \
 -F 'access_token='$ACCESS_TOKEN \
$GRAPH_API/$SELLER_ID/client_pages
