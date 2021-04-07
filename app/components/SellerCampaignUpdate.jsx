/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React, { useState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useAuth } from "../context/auth";

const SellerCampaignUpdate = function() {
  const { auth } = useAuth();
  const [campaign, setCampaign] = useState();
  const [adsAccount, setAdsAccount] = useState('959104837916969');
  const [campaignID, setCampaignID] = useState('23845590753110407');
  const [accessToken, setAccessToken] = useState('SellerBussinessAccessToken');
  const [endTime, setEndTime] = useState('1610766606');
  const [budget, setBudget] = useState('33300');
  const [campaignStatus, setCampaignStatus] = useState('ACTIVE');

  const onUpdateAds = useCallback(async () => {
    let request = `/api/updatecampaign?` +
                `lifetime_budget=${budget}&` +
                `end_time=${endTime}&` +
                `campaign_group_status=${campaignStatus}&` +
                `campaign_group_id=${campaignID}&` +
                `ads_account=${adsAccount}&` +
                `seller_access_token=${accessToken}&` +
                `user_id=${auth.userID}&` +
                `access_token=${auth.accessToken}`;
    let campaign = await fetch(request);
    campaign = await campaign.json();
    setCampaign(campaign);
  }, [campaignID, endTime, budget, campaignStatus, adsAccount, accessToken]);

  return (
    <div>
      <h1>Seller Campaign Update</h1>
      <Form>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Ads Account ID</Form.Label>
            <Form.Control
              value={adsAccount}
              onChange={e => setAdsAccount(e.target.value)}
            >
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Campaign ID</Form.Label>
            <Form.Control
              value={campaignID}
              onChange={e => setCampaignID(e.target.value)}
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
            <Form.Label>End Time (Timestamp)</Form.Label>
            <Form.Control
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Campaign Status (ACTIVE or PAUSED)</Form.Label>
            <Form.Control
              value={campaignStatus}
              onChange={e => setCampaignStatus(e.target.value)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>
              <a target="_blank" href="https://developers.facebook.com/docs/marketing-api/reference/ad-campaign-group#Updating">
                More on Campagin API
              </a>
            </Form.Label>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Button
              variant="primary"
              onClick={() => {
                onUpdateAds();
              }}
            >
              Update Campaign
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

export default SellerCampaignUpdate;
