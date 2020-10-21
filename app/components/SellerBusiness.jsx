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
  const [businessID, setBusinessID] = useState('701458537122686');
  const [sellerBusiness, setSellerBusiness] = useState();
  const [adsAccountID, setAdsAccountID] =  useState('959104837916969');
  const [websiteURL, setWebsiteURL] = useState('https://marketplace.com/stuffs');
  const [emailAddr, setEmailAddr] = useState('seller@marketplace.com');

  const onGetSellerBusinessInfo = useCallback(async () => {
    let request = `/api/getsellerbizinfo?` +
      `businessID=${businessID}&` +
      `userID=${auth.userID}&` +
      `accessToken=${auth.accessToken}`;
    let sellerBusiness = await fetch(request);
    sellerBusiness = await sellerBusiness.json();
    setSellerBusiness(sellerBusiness);
  }, [businessID]);

  const onGenerateAccessToken = useCallback(async () => {
    let request = `/api/genaccesstoken?` +
      `businessID=${businessID}&` +
      `userID=${auth.userID}&` +
      `accessToken=${auth.accessToken}`;
    let sellerBusiness = await fetch(request);
    sellerBusiness = await sellerBusiness.json();
    setSellerBusiness(sellerBusiness);
  }, [businessID]);

  const onUpdateSellerBusinessConfig = useCallback(async () => {
    let request = `/api/updatesellerbizconfig?` +
      `businessID=${businessID}&` +
      `active_ad_account_id=${adsAccountID}&` +
      `seller_email_address=${emailAddr}&` +
      `seller_external_website_url=${encodeURIComponent(websiteURL)}&` +
      `userID=${auth.userID}&` +
      `accessToken=${auth.accessToken}`;
    console.log(request);
    let sellerBusiness = await fetch(request);
    sellerBusiness = await sellerBusiness.json();
    setSellerBusiness(sellerBusiness);
  },[businessID, adsAccountID, emailAddr, websiteURL]);

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
          <Form.Group as={Col}>
              <Form.Label>Active Ads Account ID</Form.Label>
              <Form.Control
                value={adsAccountID}
                onChange={e => setAdsAccountID(e.target.value)}
              />
          </Form.Group>
        </Form.Row>
        <Form.Row>
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
