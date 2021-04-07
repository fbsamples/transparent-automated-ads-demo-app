/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const NAME = 'The Marketplace';
const BUSSINESS_ID = 'BIZ-1234567890';
const CREDIT_LINE_ID = 'CRE-364655460317958';
const CATALOG_ID = 'CAT-487699041383103';
const GRAPH_API = 'https://graph.themock.com/v10.0';
const APP_ACCESS_TOKEN = 'admin_system_user_access_token';
const APP_ID = 'your_app_id';

const SELLER_CRITERIA = {transactions: 250, basketSize: 2 };
const ELIGIBLE_SELLER_CODE = "seller_allow_listed";
const ELIGIBLE_SELLER_DESC = "Seller is in allow list.";
const INELIGIBLE_SELLER_CODE = "seller_fails_eligibility_check";
const INELIGIBLE_SELLER_DESC = "Lack of purchase. This seller only generated 16.00% of signals needed.";
const NOT_FOUND_SELLER_CODE = "seller_vendor_id_not_found";
const NOT_FOUND_SELLER_DESC = "Cannot find seller vendor ID.";
const ELIGIBLE_SELLER_IDS = ["cpas_demo_vendor_500", "cpas_demo_vendor_501"];
const INELIGIBLE_SELLER_IDS = ["cpas_demo_vendor_555", "cpas_demo_vendor_567"];

module.exports = {
  NAME,
  BUSSINESS_ID,
  CREDIT_LINE_ID,
  CATALOG_ID,
  SELLER_CRITERIA,
  GRAPH_API,
  APP_ID,
  APP_ACCESS_TOKEN,
  ELIGIBLE_SELLER_CODE,
  ELIGIBLE_SELLER_DESC,
  INELIGIBLE_SELLER_CODE,
  INELIGIBLE_SELLER_DESC,
  NOT_FOUND_SELLER_CODE,
  NOT_FOUND_SELLER_DESC,
  ELIGIBLE_SELLER_IDS,
  INELIGIBLE_SELLER_IDS,
};
