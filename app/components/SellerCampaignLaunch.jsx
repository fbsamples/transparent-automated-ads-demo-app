/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React, { useState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useAuth } from "../context/auth";

const SellerCampaignLaunch = function() {
  const { auth } = useAuth();
  const [campaign, setCampaign] = useState();
  const [adsAccount, setAdsAccount] = useState('959104837916969');
  const [accessToken, setAccessToken] = useState('SellerBussinessAccessToken');
  const [startTime, setStartTime] = useState('1609485623');
  const [endTime, setEndTime] = useState('1610695223');
  const [budget, setBudget] = useState('30000');
  const [targetingCountries, setTargetingCountries] = useState('["US","CA"]');
  const [creativeText, setCreativeText] = useState('Buy Now at this store');
  const [marketplaceTemplate, setMarketplaceTemplate] = useState(true);

  const onStartAds = useCallback(async () => {
    let request = `/api/launchcampaign?` +
                `lifetime_budget=${budget}&` +
                `start_time=${startTime}&` +
                `end_time=${endTime}&` +
                `override_targeting_countries=${targetingCountries}&` +
                `override_creative_text=${creativeText}&` +
                `use_marketplace_template=${marketplaceTemplate}&` +
                `ads_account=${adsAccount}&` +
                `seller_access_token=${accessToken}&` +
                `userID=${auth.userID}&` +
                `accessToken=${auth.accessToken}`;
    let campaign = await fetch(request);
    campaign = await campaign.json();
    setCampaign(campaign);
  }, [startTime, endTime, budget,adsAccount, accessToken,
      targetingCountries, creativeText, marketplaceTemplate]);

  return (
    <div>
      <h1>Seller Campaign Launching</h1>
      <Form>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Ads Account</Form.Label>
            <Form.Control
              value={adsAccount}
              onChange={e => setAdsAccount(e.target.value)}
            >
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Seller Access Token</Form.Label>
            <Form.Control
              value={accessToken}
              onChange={e => setAccessToken(e.target.value)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Lifetime Budget (in cents)</Form.Label>
            <Form.Control
              value={budget}
              onChange={e => setBudget(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Use Marketplace Template</Form.Label>
            <Form.Control
              value={marketplaceTemplate}
              onChange={e => setMarketplaceTemplate(e.target.value)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Start Time (Timestamp)</Form.Label>
            <Form.Control
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>End Time (Timestamp)</Form.Label>
            <Form.Control
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Override Creative Text</Form.Label>
            <Form.Control
              value={creativeText}
              onChange={e => setCreativeText(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Override Targeting Countries</Form.Label>
            <Form.Control
              value={targetingCountries}
              onChange={e => setTargetingCountries(e.target.value)}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col}>
            <Button
              variant="primary"
              onClick={() => {
                onStartAds();
              }}
            >
              Launch Seller Campaign
            </Button>
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Debugging</Form.Label>
            <Form.Control
              as="textarea"
              rows="15"
              placeholder="Response"
              value={JSON.stringify(campaign, null, 2)}
            />
          </Form.Group>
        </Form.Row>
      </Form>
    </div>
  );
};

export default SellerCampaignLaunch;
