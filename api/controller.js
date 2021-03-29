/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const axios = require("axios");
const config = require("../config");
const mock = require("../mock");
const router = require("express").Router();

const hasAdminRole = async function(userID, accessToken) {
  let authorized = false;
  let request = `${config.GRAPH_API}/${userID}/businesses?` +
                `fields=permitted_roles,name&` +
                `access_token=${accessToken}`;
  try {
    let response = await axios.get(request);
    let businesses = response.data.data;
    businesses.forEach(function(business) {
      if (business.id === config.BUSSINESS_ID
          && business.permitted_roles.includes("ADMIN")
          ) {
            authorized = true;
          }
    });
  } catch (error) {
    console.log(error.response.data);
  }
  return authorized;
}

/**
 * 0. Marketplace Info
 */
const getMarketplaceInfoData = function (dataType) {
  let marketplace = {};
  marketplace.name = dataType.NAME;
  marketplace.businessID = dataType.BUSSINESS_ID;
  marketplace.creditLineID = dataType.CREDIT_LINE_ID;
  marketplace.catalogID = dataType.CATALOG_ID;
  marketplace.sellerCriteria = dataType.SELLER_CRITERIA;
  return marketplace;
}

const getMarketplaceInfo = async function(userID, accessToken) {
  let marketplace = getMarketplaceInfoData(mock);
  if (await hasAdminRole(userID, accessToken)) {
    marketplace = getMarketplaceInfoData(config);
  };
  return marketplace;
};

router.get("/getmarketplace", async (req, res, next) => {
  try {
    let marketplace =
      await getMarketplaceInfo(
        req.query.user_id,
        req.query.access_token,
      );
    res.send(JSON.stringify(marketplace)).end();
  } catch (error) {
    res
      .status(500)
      .send(error.response.data)
      .end();
  }
});

/**
 * 1. Seller Eligibility Check
 */

const composeSellerEligibilityRequest = function (dataType, sellerID) {
  let request = `${dataType.GRAPH_API}/${dataType.BUSSINESS_ID}/` +
                `?fields=collaborative_ads_aams_seller_eligibility` +
                `.catalog_id(${dataType.CATALOG_ID}).vendor_id(${sellerID})` +
                `&access_token=${dataType.APP_ACCESS_TOKEN}`;
  return request;
}

const checkSellerEligibilityMock = function(sellerID) {
  let seller_eligibility = {};
  if (mock.ELIGIBLE_SELLER_IDS.includes(sellerID)) {
    seller_eligibility.is_eligible = true;
    seller_eligibility.reason_code = mock.ELIGIBLE_SELLER_CODE;
    seller_eligibility.reason_description = mock.ELIGIBLE_SELLER_DESC;
  }
  else if (mock.INELIGIBLE_SELLER_IDS.includes(sellerID)) {
    seller_eligibility.is_eligible = false;
    seller_eligibility.reason_code = mock.INELIGIBLE_SELLER_CODE;
    seller_eligibility.reason_description = mock.INELIGIBLE_SELLER_DESC;
  }
  else {
    seller_eligibility.is_eligible = false;
    seller_eligibility.reason_code = mock.NOT_FOUND_SELLER_CODE;
    seller_eligibility.reason_description = mock.NOT_FOUND_SELLER_DESC;
  }
  let result = {};
  result.request = composeSellerEligibilityRequest(mock, sellerID);
  result.response = seller_eligibility;
  return result;
}

const checkSellerEligibilityAPI = async function(sellerID) {
  let result = {};
  result.request = composeSellerEligibilityRequest(config, sellerID);
  let response = (await axios.get(result.request)).data;
  result.response = response.collaborative_ads_aams_seller_eligibility;
  return result;
}

const checkSellerEligibility = async function(sellerID, userID, accessToken) {
  let result = checkSellerEligibilityMock(sellerID);
  if (await hasAdminRole(userID, accessToken)) {
    result = await checkSellerEligibilityAPI(sellerID);
  }
  return result;
};

router.get("/checkseller", async (req, res, next) => {
  try {
    let result =
      await checkSellerEligibility(
        req.query.seller_id,
        req.query.user_id,
        req.query.access_token,
      );
    res.send(JSON.stringify(result)).end();
  } catch (error) {
    res
      .status(500)
      .send(error.response.data)
      .end();
  }
});

/**
 * 2. Seller Business Creation
 */

const composeSellerBusinessRequest = function (dataType, seller) {
  let request = {};
  request.url = `${dataType.GRAPH_API}/${dataType.BUSSINESS_ID}/aams_seller_businesses`;
  request.params = {
    access_token: `${dataType.APP_ACCESS_TOKEN}`,
    id: `${dataType.BUSSINESS_ID}`,
    catalog_id: `${dataType.CATALOG_ID}`,
    line_of_credit_id: `${dataType.CREDIT_LINE_ID}`,
    name: `${seller.name}`,
    child_business_external_id: `${seller.child_business_external_id}`,
    seller_external_website_url: `${seller.seller_external_website_url}`,
    page_name: `${seller.page_name}`,
    page_profile_image_url: `${seller.page_profile_image_url}`,
    credit_limit: `${seller.credit_limit}`,
    ad_account_currency: `${seller.ad_account_currency}`,
    timezone_id: `${seller.timezone_id}`,
    seller_targeting_countries: `${seller.seller_targeting_countries}`,
    vertical: `${seller.vertical}`
  };
  return request;
}

const createSellerBusinessMock = function (seller) {
  let result = {};
  result.request = composeSellerBusinessRequest(mock, seller);
  result.response = {"id":"191238152396383"};
  return result;
}

const createSellerBusinessAPI = async function(seller) {
  let result = {};
  result.request = composeSellerBusinessRequest(config, seller);
  result.response = (await axios.post(
    result.request.url,
    result.request.params)
  ).data;
  return result;
}

const createSellerBusiness = async function(sellerInfo, userID, accessToken) {
  let result = createSellerBusinessMock(sellerInfo);
  if (await hasAdminRole(userID, accessToken)) {
    result = await createSellerBusinessAPI(sellerInfo);
  }
  return result;
}

router.get("/selleronboarding", async (req, res, next) => {
  let sellerInfo = {};
  sellerInfo.name = req.query.name;
  sellerInfo.vertical = req.query.vertical;
  sellerInfo.child_business_external_id = req.query.child_business_external_id;
  sellerInfo.timezone_id = req.query.timezone_id;
  sellerInfo.seller_external_website_url = decodeURIComponent(req.query.seller_external_website_url);
  sellerInfo.page_profile_image_url = decodeURIComponent(req.query.page_profile_image_url);
  sellerInfo.page_name = req.query.page_name;
  sellerInfo.ad_account_currency = req.query.ad_account_currency;
  sellerInfo.credit_limit = req.query.credit_limit;
  sellerInfo.seller_targeting_countries = req.query.seller_targeting_countries;

  try {
    let result =
      await createSellerBusiness(
        sellerInfo,
        req.query.user_id,
        req.query.access_token,
      );
    res.send(JSON.stringify(result)).end();
  } catch (error) {
    res
      .status(500)
      .send(error.response.data)
      .end();
  }
});

/**
 * 3. Seller Business Lookup
 */

const composeSellerBusinessLookupRequest = function (dataType, sellerID) {
  let request = `${dataType.GRAPH_API}/${dataType.BUSSINESS_ID}/owned_businesses` +
                `?child_business_external_id=${sellerID}` +
                `&access_token=${dataType.APP_ACCESS_TOKEN}`;
  return request;
}

const getSellerBusinessMock = function (sellerID) {
  let result = {};
  result.request = composeSellerBusinessLookupRequest(mock, sellerID);
  result.response = {
      "id": "191238152396383",
      "name": "TAA Seller"
  };
  return result;
}

const getSellerBusinessAPI = async function (sellerID) {
  let result = {};
  result.request = composeSellerBusinessLookupRequest(config, sellerID);
  result.response = (await axios.get(result.request)).data.data;
  return result;
}

const getSellerBusinessID = async function(sellerID, userID, accessToken) {
  let result = getSellerBusinessMock(sellerID);
  if (await hasAdminRole(userID, accessToken)) {
    result = await getSellerBusinessAPI(sellerID);
  }
  return result;
}

router.get("/getsellerbizid", async (req, res, next) => {
  try {
    let result =
      await getSellerBusinessID(
        req.query.seller_id,
        req.query.user_id,
        req.query.access_token,
      );
    res.send(JSON.stringify(result)).end();
  } catch (error) {
    res
      .status(500)
      .send(error.response.data)
      .end();
  }
});

/**
 * 4. Seller Business Info
 */
const composeSellerBusinessInfoRequest = function (dataType, businessID) {
  let request = `${dataType.GRAPH_API}/${businessID}` +
                `?fields=collaborative_ads_aams_seller_business_info` +
                `&access_token=${dataType.APP_ACCESS_TOKEN}`;
  return request;
}

const getSellerBusinessInfoMock = function (businessID) {
  let result = {};
  result.request = composeSellerBusinessInfoRequest(mock, businessID);
  result.response = {
      "seller_business_aams_status": "ready",
      "seller_business_info": {
        "seller_email_address": "seller@marketplace.com",
        "seller_external_website_url": "https://marketplace.com/stuffs"
      },
      "ad_account": {
        "id": "act_319769242719821",
        "currency": "USD"
      },
      "page": {
        "id": "101356215294589"
      },
      "extended_credit": {
        "receiving_credit_allocation_config": {
          "id": "423224102259163"
        },
        "max_balance": {
          "amount": "250.00",
          "amount_in_hundredths": "25000",
          "currency": "USD",
          "offsetted_amount": "25000"
        },
        "id": "3710622242385039"
      },
      "active_seller_campaign": {
        "status": "ACTIVE",
        "id": "23846663933220507"
      },
      "template": [
        {
          "budget_percentage": 0.5,
          "campaign_template_id": "1890545134419293",
          "adgroup_template_ids": [
            "750988515486255"
          ],
          "targeting_type": "retargeting"
        },
        {
          "budget_percentage": 0.5,
          "campaign_template_id": "271586340938767",
          "adgroup_template_ids": [
            "750988515486255"
          ],
          "targeting_type": "prospecting"
        }
      ]
  };
  return result;
}

const getSellerBusinessInfoAPI = async function (businessID) {
  let result = {};
  result.request = composeSellerBusinessInfoRequest(config, businessID);
  result.response = (await axios.get(result.request)).data.collaborative_ads_aams_seller_business_info;
  return result;
}

const getSellerBusinessInfo = async function(businessID, userID, accessToken) {
  let result = getSellerBusinessInfoMock(businessID);
  if (await hasAdminRole(userID, accessToken)) {
    result = await getSellerBusinessInfoAPI(businessID);
  }
  return result;
}

router.get("/getsellerbizinfo", async (req, res, next) => {
  try {
    let result =
      await getSellerBusinessInfo(
        req.query.business_id,
        req.query.user_id,
        req.query.access_token,
      );
    res.send(JSON.stringify(result)).end();
  } catch (error) {
    res
      .status(500)
      .send(error.response.data)
      .end();
  }
});

/**
 * 5. Seller Access Token
 */
const composeSellerAccessTokenRequest = function (dataType, businessID) {
  let request = {};
  request.url = `${dataType.GRAPH_API}/${businessID}/access_token`;
  request.params = {
    app_id: `${dataType.APP_ID}`,
    scope: "ads_management,business_management",
    access_token: `${dataType.APP_ACCESS_TOKEN}`,
  };
  return request;
}

const genSellerAccessTokenMock = function (businessID) {
  let result = {};
  result.request = composeSellerAccessTokenRequest(mock, businessID);
  result.response = {
    "access_token":"SellerBussinessAccessToken"
  };
  return result;
}

const genSellerAccessTokenAPI = async function (businessID) {
  let result = {};
  result.request = composeSellerAccessTokenRequest(config, businessID);
  result.response = (await axios.post(
                      result.request.url,
                      result.request.params)
                    ).data;
  return result;
}

const genSellerAccessToken = async function(businessID, userID, accessToken) {
  let result = genSellerAccessTokenMock(businessID);
  if (await hasAdminRole(userID, accessToken)) {
    result = await genSellerAccessTokenAPI(businessID);
  }
  return result;
}

router.get("/genaccesstoken", async (req, res, next) => {
  try {
    let result =
      await genSellerAccessToken(
        req.query.business_id,
        req.query.user_id,
        req.query.access_token,
      );
    res.send(JSON.stringify(result)).end();
  } catch (error) {
    res
      .status(500)
      .send(error.response.data)
      .end();
  }
});

/**
 * 6. Seller Campaign Launching
 */
const composeCampaignLaunchingRequest = function (dataType, campaign) {
  let request = {};
  request.url = `${dataType.GRAPH_API}/act_${campaign.ads_account}/aams_ads`;
  request.params = {
    lifetime_budget: `${campaign.lifetime_budget}`,
    start_time: `${campaign.start_time}`,
    end_time: `${campaign.end_time}`,
    override_targeting_countries: `${campaign.override_targeting_countries}`,
    override_creative_text: `${campaign.override_creative_text}`,
    use_marketplace_template: `${campaign.use_marketplace_template}`,
    access_token: `${campaign.access_token}`
  };
  return request;
}

const launchSellerCampaignMock = function (campaign) {
  let result = {};
  result.request = composeCampaignLaunchingRequest(mock, campaign);
  result.response = {
    "id":"23845579373050407",
    "success":true
  };
  return result;
}

const launchSellerCampaignAPI = async function(campaign) {
  let result = {};
  result.request = composeCampaignLaunchingRequest(config, campaign);
  result.response = (await axios.post(
    result.request.url,
    result.request.params)
  ).data;
  return result;
}

const launchSellerCampaign = async function(campaignInfo, userID, accessToken) {
  let result = launchSellerCampaignMock(campaignInfo);
  if (await hasAdminRole(userID, accessToken)) {
    result = await launchSellerCampaignAPI(campaignInfo);
  }
  return result;
}

router.get("/launchcampaign", async (req, res, next) => {
  let campaignInfo = {};
  campaignInfo.ads_account = req.query.ads_account;
  campaignInfo.access_token = req.query.seller_access_token;
  campaignInfo.lifetime_budget = req.query.lifetime_budget;
  campaignInfo.start_time = req.query.start_time;
  campaignInfo.end_time = req.query.end_time;
  campaignInfo.override_targeting_countries = req.query.override_targeting_countries;
  campaignInfo.override_creative_text = req.query.override_creative_text;
  campaignInfo.use_marketplace_template = req.query.use_marketplace_template;

  try {
    let result =
      await launchSellerCampaign(
        campaignInfo,
        req.query.user_id,
        req.query.access_token,
      );
    res.send(JSON.stringify(result)).end();
  } catch (error) {
    res
      .status(500)
      .send(error.response.data)
      .end();
  }
});

/**
 * 7. Seller Campaign Update
 */
const composeCampaignUpdateRequest = function (dataType, campaign) {
  let request = {};
  request.url = `${dataType.GRAPH_API}/act_${campaign.ads_account}/aams_ads`;
  request.params = {
    campaign_group_id: `${campaign.campaign_group_id}`,
    lifetime_budget: `${campaign.lifetime_budget}`,
    end_time: `${campaign.end_time}`,
    access_token: `${campaign.access_token}`
  };
  return request;
}

const updateSellerCampaignMock = function (campaign) {
  let result = {};
  result.request = composeCampaignUpdateRequest(mock, campaign);
  result.response = {
    "id":"23845579373050407",
    "success":true
  };
  return result;
}

const updateSellerCampaignAPI = async function(campaign) {
  let result = {};
  result.request = composeCampaignUpdateRequest(config, campaign);
  result.response = (await axios.post(
    result.request.url,
    result.request.params)
  ).data;
  return result;
}

const updateSellerCampaign = async function(campaignInfo, userID, accessToken) {
  let result = updateSellerCampaignMock(campaignInfo);
  if (await hasAdminRole(userID, accessToken)) {
    result = await updateSellerCampaignAPI(campaignInfo);
  }
  return result;
}

router.get("/updatecampaign", async (req, res, next) => {
  let campaignInfo = {};
  campaignInfo.ads_account = req.query.ads_account;
  campaignInfo.access_token = req.query.seller_access_token;
  campaignInfo.lifetime_budget = req.query.lifetime_budget;
  campaignInfo.end_time = req.query.end_time;
  campaignInfo.campaign_group_id = req.query.campaign_group_id;

  try {
    let result =
      await updateSellerCampaign(
        campaignInfo,
        req.query.user_id,
        req.query.access_token,
      );
    res.send(JSON.stringify(result)).end();
  } catch (error) {
    res
      .status(500)
      .send(error.response.data)
      .end();
  }
});

/**
 * 8. Seller Business Config Update
 */
const composeSellerBusinessConfigRequest = function (dataType, sellerConfig) {
  let request = {};
  request.url = `${dataType.GRAPH_API}/${sellerConfig.business_id}/aams_seller_business_setup`;
  request.params = {};
  request.params.access_token = dataType.APP_ACCESS_TOKEN;
  request.params.seller_external_website_url = sellerConfig.seller_external_website_url;
  request.params.seller_email_address = sellerConfig.seller_email_address;
  request.params.active_ad_account_id = sellerConfig.active_ad_account_id;
  return request;
}

const updateSellerBusinessConfigMock = function (sellerConfig) {
  let result = {};
  result.request = composeSellerBusinessConfigRequest(mock, sellerConfig);
  result.response = {
    "id": "701458537122686",
    "meta_data": {
      "ad_account": {
        "id": "959104837916969"
      },
      "seller_business_info": {
        "seller_external_website_url": "https://marketplace.com/stuffs",
        "seller_email_address": "seller@marketplace.com"
      }
    }
  };
  return result;
}

const updateSellerBusinessConfigAPI = async function (sellerConfig) {
  let result = {};
  result.request = composeSellerBusinessConfigRequest(config, sellerConfig);
  result.response = (await axios.post(
    result.request.url,
    result.request.params)
  ).data;
  return result;
}

const updateSellerBusinessConfig = async function(sellerConfig, userID, accessToken) {
  let result = updateSellerBusinessConfigMock(sellerConfig);
  if (await hasAdminRole(userID, accessToken)) {
    result = await updateSellerBusinessConfigAPI(sellerConfig);
  }
  return result;
}

router.get("/updatesellerbizconfig", async (req, res, next) => {
  let sellerConfig = {};
  sellerConfig.business_id = req.query.business_id;
  sellerConfig.seller_email_address = req.query.seller_email_address;
  sellerConfig.active_ad_account_id = req.query.active_ad_account_id;
  sellerConfig.seller_external_website_url = decodeURIComponent(req.query.seller_external_website_url);

  try {
    let result =
      await updateSellerBusinessConfig(
        sellerConfig,
        req.query.user_id,
        req.query.access_token,
      );
    res.send(JSON.stringify(result)).end();
  } catch (error) {
    res
      .status(500)
      .send(error.response.data)
      .end();
  }
});

/**
 * 9. Seller Campaign Reporting
 */
const composeCampaignReportingRequest = function (dataType, campaign) {
  let request = `${dataType.GRAPH_API}/${campaign.campaign_group_id}/insights` +
                `?fields=catalog_segment_actions,catalog_segment_value,catalog_segment_value_omni_purchase_roas,spend,clicks,impressions,converted_product_value,converted_product_quantity` +
                `&action_attribution_windows=["1d_view","28d_click"]` +
                `&action_breakdowns=action_converted_product_id` +
                `&access_token=${campaign.access_token}`;
  return request;
}

const getCampaignReportingMock = function (campaign) {
  let result = {};
  result.request = composeCampaignReportingRequest(mock, campaign);
  result.response = {
    "catalog_segment_actions": [
      {
        "action_type": "omni_add_to_cart",
        "value": "73",
        "28d_click": "73"
      },
      {
        "action_type": "omni_purchase",
        "value": "46",
        "28d_click": "46"
      },
    ],
    "catalog_segment_value": [
      {
        "action_type": "omni_add_to_cart",
        "value": "1210.23",
        "28d_click": "1210.23"
      },
      {
        "action_type": "omni_purchase",
        "value": "706.7",
        "28d_click": "706.7"
      }
    ],
    "catalog_segment_value_omni_purchase_roas": [
      {
        "action_type": "omni_purchase",
        "value": "3.383606",
        "28d_click": "3.383606"
      }
    ],
    "spend": "208.86",
    "impressions": "57155",
    "clicks": "3640",
    "converted_product_value": [
      {
        "action_converted_product_id": "3979883842023347",
        "28d_click": "87.36"
      },
      {
        "action_converted_product_id": "2046277955477342",
        "28d_click": "56.22"
      },
      {
        "action_converted_product_id": "3522211831172370",
        "28d_click": "40.94"
      },
    ],
    "converted_product_quantity": [
      {
        "action_converted_product_id": "3979883842023347",
        "28d_click": "12"
      },
      {
        "action_converted_product_id": "2046277955477342",
        "28d_click": "12"
      },
      {
        "action_converted_product_id": "3522211831172370",
        "28d_click": "8"
      },
    ],
    "date_start": "2020-12-21",
    "date_stop": "2021-01-19"
  };
  return result;
}

const getCampaignReportingAPI = async function(campaign) {
  let result = {};
  result.request = composeCampaignReportingRequest(config, campaign);
  result.response = (await axios.get(result.request)).data;
  return result;
}

const getCampaignReporting = async function(campaignInfo, userID, accessToken) {
  let result = getCampaignReportingMock(campaignInfo);
  if (await hasAdminRole(userID, accessToken)) {
    result = await getCampaignReportingAPI(campaignInfo);
  }
  return result;
}

router.get("/campaignreporting", async (req, res, next) => {
  let campaignInfo = {};
  campaignInfo.access_token = req.query.seller_access_token;
  campaignInfo.campaign_group_id = req.query.campaign_group_id;

  try {
    let result =
      await getCampaignReporting(
        campaignInfo,
        req.query.user_id,
        req.query.access_token,
      );
    res.send(JSON.stringify(result)).end();
  } catch (error) {
    res
      .status(500)
      .send(error.response.data)
      .end();
  }
});

/**
 * 10. Invoice Group Creation
 */
const composeInvoiceGroupCreationRequest = function (dataType, invoiceGroup) {
  let request = {};
  request.url = `${dataType.GRAPH_API}/${dataType.CREDIT_LINE_ID}/extended_credit_invoice_groups`;
  request.params = {};
  request.params.access_token = dataType.APP_ACCESS_TOKEN;
  request.params.emails = invoiceGroup.emails;
  request.params.name = invoiceGroup.name;
  return request;
}

const createInvoiceGroupMock = function (invoiceGroup) {
  let result = {};
  result.request = composeInvoiceGroupCreationRequest(mock, invoiceGroup);
  result.response = {
    "id":"2742746285973044"
  };
  return result;
}

const createInvoiceGroupAPI = async function (invoiceGroup) {
  let result = {};
  result.request = composeInvoiceGroupCreationRequest(config, invoiceGroup);
  result.response = (await axios.post(
    result.request.url,
    result.request.params)
  ).data;
  return result;
}

const createInvoiceGroup = async function(invoiceGroup, userID, accessToken) {
  let result = createInvoiceGroupMock(invoiceGroup);
  if (await hasAdminRole(userID, accessToken)) {
    result = await createInvoiceGroupAPI(invoiceGroup);
  }
  return result;
}

router.get("/createinvoicegroup", async (req, res, next) => {
  let invoiceGroup = {};
  invoiceGroup.emails = req.query.emails;
  invoiceGroup.name = req.query.name;

  try {
    let result =
      await createInvoiceGroup(
        invoiceGroup,
        req.query.user_id,
        req.query.access_token,
      );
    res.send(JSON.stringify(result)).end();
  } catch (error) {
    res
      .status(500)
      .send(error.response.data)
      .end();
  }
});

/**
 * 11. Invoice Group Ads Account Checking
 */
const composeInvoiceGroupCheckRequest = function (dataType, adsAccountID) {
  let request = `${dataType.GRAPH_API}/${adsAccountID}` +
                `?fields=extended_credit_invoice_group` +
                `&access_token=${dataType.APP_ACCESS_TOKEN}`;
  return request;
}

const checkInvoiceGroupMock = function (invoiceGroup) {
  let result = {};
  result.request = composeInvoiceGroupCheckRequest(mock, invoiceGroup);
  result.response = {
    "extended_credit_invoice_group": {
    "id": "2742746285973044",
    "name": "TAA Invoice Group"
  },
    "id": "act_768156353980606"
  };
  return result;
}

const checkInvoiceGroupAPI = async function (invoiceGroup) {
  let result = {};
  result.request = composeInvoiceGroupCheckRequest(config, invoiceGroup);
  result.response = (await axios.get(result.request)).data;
  return result;
}

const checkInvoiceGroup = async function(adsAccountID, userID, accessToken) {
  let result = checkInvoiceGroupMock(adsAccountID);
  if (await hasAdminRole(userID, accessToken)) {
    result = await checkInvoiceGroupAPI(adsAccountID);
  }
  return result;
}

router.get("/checkinvoicegroup", async (req, res, next) => {
  try {
    let result =
      await checkInvoiceGroup(
        req.query.ad_account_id,
        req.query.user_id,
        req.query.access_token,
      );
    res.send(JSON.stringify(result)).end();
  } catch (error) {
    res
      .status(500)
      .send(error.response.data)
      .end();
  }
});

/**
 * 12. Invoice Ads Account Addition/Deletion
 */
const composeInvoiceAdsAccountRequest = function (dataType, invoiceGroup) {
  let request = {};
  request.url = `${dataType.GRAPH_API}/${invoiceGroup.id}/ad_accounts`;
  request.params = {};
  request.params.access_token = dataType.APP_ACCESS_TOKEN;
  request.params.ad_account_id = invoiceGroup.ad_account_id;
  return request;
}

const handleInvoiceGroupAdsAccountMock = function (invoiceGroup) {
  let result = {};
  result.request = composeInvoiceAdsAccountRequest(mock, invoiceGroup);
  result.response = {
    "success":true
  };
  return result;
}

const handleInvoiceGroupAdsAccountAPI = async function (invoiceGroup) {
  let result = {};
  result.request = composeInvoiceAdsAccountRequest(config, invoiceGroup);
  let axiosConfig = {
    method: `${invoiceGroup.requestType}`,
    url: `${result.request.url}`,
    data: {
      ad_account_id: `${result.request.params.ad_account_id}`,
      access_token: `${result.request.params.access_token}`,
    },
  };
  result.response = (await axios(axiosConfig)).data;
  return result;
}

const handleInvoiceGroupAdsAccount = async function (invoiceGroup, userID, accessToken) {
  let result = handleInvoiceGroupAdsAccountMock(invoiceGroup);
  if (await hasAdminRole(userID, accessToken)) {
    result = await handleInvoiceGroupAdsAccountAPI(invoiceGroup);
  }
  return result;
}

router.get("/handleinvoiceadsaccount", async (req, res, next) => {
  let invoiceGroup = {};
  invoiceGroup.requestType = req.query.request_type;
  invoiceGroup.id = req.query.id;
  invoiceGroup.ad_account_id = req.query.ad_account_id;
  try {
    let result =
      await handleInvoiceGroupAdsAccount(
        invoiceGroup,
        req.query.user_id,
        req.query.access_token,
      );
    res.send(JSON.stringify(result)).end();
  } catch (error) {
    res
      .status(500)
      .send(error.response.data)
      .end();
  }
});

/**
 * 13. Update Seller Business Credit Limit
 */
const composeSellerCreditLimitRequest = function (dataType, sellerConfig) {
  let request = {};
  request.url = `${dataType.GRAPH_API}/${sellerConfig.alloc_config_id}`;
  request.params = {};
  request.params.access_token = dataType.APP_ACCESS_TOKEN;
  request.params.amount = sellerConfig.credit_limit;
  return request;
}

const updateSellerCreditLimitMock = function (sellerConfig) {
  let result = {};
  result.request = composeSellerCreditLimitRequest(mock, sellerConfig);
  result.response = {
    "success":true
  };
  return result;
}

const updateSellerCreditLimitAPI = async function (sellerConfig) {
  let result = {};
  result.request = composeSellerCreditLimitRequest(config, sellerConfig);
  result.response = (await axios.post(
    result.request.url,
    result.request.params)
  ).data;
  return result;
}

const updateSellerCreditLimit = async function(sellerConfig, userID, accessToken) {
  let result = updateSellerCreditLimitMock(sellerConfig);
  if (await hasAdminRole(userID, accessToken)) {
    result = await updateSellerCreditLimitAPI(sellerConfig);
  }
  return result;
}

router.get("/updatesellercreditlimit", async (req, res, next) => {
  let sellerConfig = {};
  sellerConfig.alloc_config_id = req.query.alloc_config_id;
  sellerConfig.credit_limit = req.query.credit_limit;

  try {
    let result =
      await updateSellerCreditLimit(
        sellerConfig,
        req.query.user_id,
        req.query.access_token,
      );
    res.send(JSON.stringify(result)).end();
  } catch (error) {
    res
      .status(500)
      .send(error.response.data)
      .end();
  }
});

/**
 * 14. Seller Campaign Info
 */
const composeCampaignInfoRequest = function (dataType, campaign) {
  let request = `${dataType.GRAPH_API}/${campaign.campaign_id}/` +
                `?fields=status,start_time,stop_time,lifetime_budget,budget_remaining,insights` +
                `&access_token=${campaign.access_token}`;
  return request;
}

const getCampaignInfoMock = function (campaign) {
  let result = {};
  result.request = composeCampaignInfoRequest(mock, campaign);
  result.response = {
    "status": "ACTIVE",
    "start_time": "2021-01-06T09:31:07-0800",
    "stop_time": "2021-01-23T04:53:36-0800",
    "lifetime_budget": "25600",
    "budget_remaining": "1",
    "insights": {
      "data": [
        {
          "account_id": "1332070203795426",
          "campaign_id": "23846479736210102",
          "date_start": "2020-12-29",
          "date_stop": "2021-01-27",
          "impressions": "71310",
          "spend": "255.99"
        }
      ]
    },
    "id": "1234567890"
  };
  return result;
}

const getCampaignInfoAPI = async function(campaign) {
  let result = {};
  result.request = composeCampaignInfoRequest(config, campaign);
  result.response = (await axios.get(result.request)).data;
  return result;
}

const getCampaignInfo = async function(campaignInfo, userID, accessToken) {
  let result = getCampaignInfoMock(campaignInfo);
  if (await hasAdminRole(userID, accessToken)) {
    result = await getCampaignInfoAPI(campaignInfo);
  }
  return result;
}

router.get("/campaigninfo", async (req, res, next) => {
  let campaignInfo = {};
  campaignInfo.access_token = req.query.seller_access_token;
  campaignInfo.campaign_id = req.query.campaign_id;

  try {
    let result =
      await getCampaignInfo(
        campaignInfo,
        req.query.user_id,
        req.query.access_token,
      );
    res.send(JSON.stringify(result)).end();
  } catch (error) {
    res
      .status(500)
      .send(error.response.data)
      .end();
  }
});

/**
 * Seller Management
 */
const getSellers = function() {
  let sellers = {
    sellers: [
      { id: 136729, name: "Marketplace Hucocase", campaignID: "23843830088230239" },
      { id: 519453, name: "Marketplace EShop24h", campaignID: "23844039875620127" },
      { id: 49635, name: "Marketplace Dasher", campaignID: "23843760412630566" },
      { id: 132497, name: "Marketplace Infotech", campaignID: "23843857362690261" },
      { id: 119850, name: "Marketplace JustIt", campaignID: "23843742427880758" }
    ]
  };
  return sellers;
};

router.get("/getsellers", async (req, res, next) => {
  try {
    res.send(JSON.stringify(getSellers())).end();
  } catch (err) {
    res.status(500).end();
  }
});

module.exports = router;
