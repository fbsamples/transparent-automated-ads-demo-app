/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React, { useState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useAuth } from "../context/auth";

const SellerBusiness = function() {
  const { auth } = useAuth();
  const [businessID, setBusinessID] = useState('257744445707305');
  const [sellerBusiness, setSellerBusiness] = useState();
  const [adsAccountID, setAdsAccountID] =  useState('319769242719821');
  const [websiteURL, setWebsiteURL] = useState('https://marketplace.com/stuffs');
  const [emailAddr, setEmailAddr] = useState('seller@marketplace.com');
  const [allocConfigID, setAllocConfigID] = useState('423224102259163');
  const [creditLimit, setCreditLimit] = useState('200');
  const [retargetingAdsetID, setRetargetingAdsetID] = useState('160235235998069');
  const [retargetingAdID, setRetargetingAdID] = useState('447963739637509');
  const [retargetingBudget, setRetargetingBudget] = useState('0.5');
  const [prospectingAdsetID, setProspectingAdsetID] = useState('278452090413983');
  const [prospectingAdID, setProspecdtingAdID] = useState('458654975391261');
  const [prospectingBudget, setProspectingBudget] = useState('0.5');

  const onGetSellerBusinessInfo = useCallback(async () => {
    let request = `/api/getsellerbizinfo?` +
      `business_id=${businessID}&` +
      `user_id=${auth.userID}&` +
      `access_token=${auth.accessToken}`;
    handleRequest(request);
  }, [businessID]);

  const onGenerateAccessToken = useCallback(async () => {
    let request = `/api/genaccesstoken?` +
      `business_id=${businessID}&` +
      `user_id=${auth.userID}&` +
      `access_token=${auth.accessToken}`;
    handleRequest(request);
  }, [businessID]);

  const onUpdateSellerBusinessConfig = useCallback(async () => {
    let request = `/api/updatesellerbizconfig?` +
      `business_id=${businessID}&` +
      `active_ad_account_id=${adsAccountID}&` +
      `seller_email_address=${emailAddr}&` +
      `seller_external_website_url=${encodeURIComponent(websiteURL)}&` +
      `retargeting_adset_template_id=${retargetingAdsetID}&` +
      `retargeting_ad_template_id=${retargetingAdID}&` +
      `retargeting_budget=${retargetingBudget}&` +
      `prospecting_adset_template_id=${prospectingAdsetID}&` +
      `prospecting_ad_template_id=${prospectingAdID}&` +
      `prospecting_budget=${prospectingBudget}&` +
      `user_id=${auth.userID}&` +
      `access_token=${auth.accessToken}`;
    handleRequest(request);
  },[businessID, adsAccountID, emailAddr, websiteURL]);

  const onUpdateSellerCreditLimit = useCallback(async () => {
    let request = `/api/updatesellercreditlimit?` +
        `alloc_config_id=${allocConfigID}&` +
        `credit_limit=${creditLimit}&` +
        `user_id=${auth.userID}&` +
        `access_token=${auth.accessToken}`;
    ;
    handleRequest(request);
  },[allocConfigID, creditLimit]);

  const handleRequest = async function (request) {
    let sellerBusiness = await fetch(request);
    sellerBusiness = await sellerBusiness.json();
    setSellerBusiness(sellerBusiness);
  }

  return (
    <div>
      <h1>Seller Business </h1>
      <Form>
        <Form.Row>
          <Form.Group as={Col}>
              <Form.Label>Seller Business ID</Form.Label>
              <Form.Control
                value={businessID}
                onChange={e => setBusinessID(e.target.value)}
              />
          </Form.Group>
          <Form.Group as={Col}></Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Button
              variant="info"
              onClick={() => {
                onGetSellerBusinessInfo();
              }}
            >
              Get Seller Business Info
            </Button>
          </Form.Group>
          <Form.Group as={Col}>
            <Button
              variant="secondary"
              onClick={() => {
                onGenerateAccessToken();
              }}
            >
             Generate Seller Access Token
            </Button>
          </Form.Group>
          <Form.Group as={Col}></Form.Group>
          <Form.Group as={Col}></Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
                <Form.Label>Active Ads Account ID</Form.Label>
                <Form.Control
                  value={adsAccountID}
                  onChange={e => setAdsAccountID(e.target.value)}
                />
            </Form.Group>
          <Form.Group as={Col}>
              <Form.Label>Seller External Website URL</Form.Label>
              <Form.Control
                value={websiteURL}
                onChange={e => setWebsiteURL(e.target.value)}
              />
          </Form.Group>
          <Form.Group as={Col}>
              <Form.Label>Seller Email Address</Form.Label>
              <Form.Control
                value={emailAddr}
                onChange={e => setEmailAddr(e.target.value)}
              />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Retargeting Adset Template ID</Form.Label>
            <Form.Control
              value={retargetingAdsetID}
              onChange={e => setRetargetingAdsetID(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Retargeting Ad Template ID</Form.Label>
            <Form.Control
              value={retargetingAdID}
              onChange={e => setRetargetingAdID(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Retargeting Budget (value from 0.0 to 1.0)</Form.Label>
            <Form.Control
              value={retargetingBudget}
              onChange={e => setRetargetingBudget(e.target.value)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Prospecting Adset Template ID</Form.Label>
            <Form.Control
              value={prospectingAdsetID}
              onChange={e => setProspectingAdsetID(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Prospecting Ad Template ID</Form.Label>
            <Form.Control
              value={prospectingAdID}
              onChange={e => setProspectingAdID(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Prospecting Budget (value from 0.0 to 1.0)</Form.Label>
            <Form.Control
              value={prospectingBudget}
              onChange={e => setProspectingBudget(e.target.value)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Button
              variant="primary"
              onClick={() => {
                onUpdateSellerBusinessConfig();
              }}
            >
              Update Seller Business Config
            </Button>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
              <Form.Label>Seller Allocation Config ID</Form.Label>
              <Form.Control
                value={allocConfigID}
                onChange={e => setAllocConfigID(e.target.value)}
              />
          </Form.Group>
          <Form.Group as={Col}>
              <Form.Label>Seller Credit Limit</Form.Label>
              <Form.Control
                value={creditLimit}
                onChange={e => setCreditLimit(e.target.value)}
              />
          </Form.Group>
          <Form.Group as={Col}></Form.Group>
          <Form.Group as={Col}></Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Button
              variant="warning"
              onClick={() => {
                onUpdateSellerCreditLimit();
              }}
            >
              Update Seller Credit Limit
            </Button>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Debugging</Form.Label>
            <Form.Control
              as="textarea"
              rows="20"
              placeholder="Response"
              value={JSON.stringify(sellerBusiness, null, 2)}
            />
          </Form.Group>
        </Form.Row>
      </Form>
    </div>
  );
};

export default SellerBusiness;
