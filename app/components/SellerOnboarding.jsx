/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React, { useState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useAuth } from "../context/auth";

const SellerOnboarding = function() {
  const { auth } = useAuth();
  const [name, setName] = useState('TAA Seller');
  const [vertical, setVertical] = useState('OTHER');
  const [externalID, setExternalID] = useState('cpas_demo_vendor_500');
  const [timezoneID, setTimezoneID] = useState('1');
  const [externalWebsiteURL, setExternalWebsiteURL] = useState('https://www.ebay.com/str/PremiumBattery2015');
  const [pageName, setPageName] = useState('TAA Seller Page Name');
  const [profileURL, setProfileURL] = useState('https://static.remove.bg/remove-bg-web/6a52a5138a9abf57fc19c01d996367588cfdee72/assets/start_remove-79a4598a05a77ca999df1dcb434160994b6fde2c3e9101984fb1be0f16d0a74e.png');
  const [currency, setCurrency] = useState('USD');
  const [creditLimit, setCreditLimit] = useState('200');
  const [targetingCountries, setTargetingCountries] = useState('["US"]');
  const [sellerBusiness, setSellerBusiness] = useState();

  const onStartOnbboarding = useCallback(async () => {
    let request = `/api/selleronboarding?` +
      `name=${name}&` +
      `vertical=${vertical}&` +
      `child_business_external_id=${externalID}&` +
      `seller_external_website_url=${encodeURIComponent(externalWebsiteURL)}&` +
      `page_profile_image_url=${encodeURIComponent(profileURL)}&` +
      `page_name=${pageName}&` +
      `credit_limit=${creditLimit}&` +
      `ad_account_currency=${currency}&` +
      `seller_targeting_countries=${targetingCountries}&` +
      `timezone_id=${timezoneID}&` +
      `user_id=${auth.userID}&` +
      `access_token=${auth.accessToken}`;
    let sellerBusiness = await fetch(request);
    sellerBusiness = await sellerBusiness.json();
    setSellerBusiness(sellerBusiness);
  }, [name, vertical, externalID, externalWebsiteURL, pageName,
      profileURL, currency, creditLimit, targetingCountries]);

  const onLookupSeller = useCallback(async () => {
    let request = `/api/getsellerbizid?` +
      `seller_id=${externalID}&` +
      `user_id=${auth.userID}&` +
      `access_token=${auth.accessToken}`;
    let sellerBusiness = await fetch(request);
    sellerBusiness = await sellerBusiness.json();
    setSellerBusiness(sellerBusiness);
  }, [externalID]);

  return (
    <div>
      <h1>Seller Onboarding </h1>
      <Form>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Child Business External ID</Form.Label>
            <Form.Control
              value={externalID}
              onChange={e => setExternalID(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Seller External Website URL</Form.Label>
            <Form.Control
              value={externalWebsiteURL}
              onChange={e => setExternalWebsiteURL(e.target.value)}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Page Name</Form.Label>
            <Form.Control
              value={pageName}
              onChange={e => setPageName(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Profile URL</Form.Label>
            <Form.Control
              value={profileURL}
              onChange={e => setProfileURL(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Vertical</Form.Label>
            <Form.Control
              value={vertical}
              onChange={e => setVertical(e.target.value)}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Credit Limit (USD)</Form.Label>
            <Form.Control
              value={creditLimit}
              onChange={e => setCreditLimit(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>
              Ad Account Currency&nbsp;
              <a target="_blank" href="https://www.facebook.com/business/help/2780175265550591">
              (Accepted Currencies List)
              </a>
            </Form.Label>
            <Form.Control
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Targeting Countries</Form.Label>
            <Form.Control
              value={targetingCountries}
              onChange={e => setTargetingCountries(e.target.value)}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Timezone ID&nbsp;
            <a target="_blank" href="https://developers.facebook.com/docs/marketing-api/reference/ad-account/timezone-ids/">
                (List of all the timezone IDs)
              </a>
            </Form.Label>
            <Form.Control
              value={timezoneID}
              onChange={e => setTimezoneID(e.target.value)}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col}>
            <Button
              variant="primary"
              onClick={() => {
                onStartOnbboarding();
              }}
            >
              Create Seller Biz
            </Button>
          </Form.Group>
          <Form.Group as={Col}>
            <Button
              variant="secondary"
              onClick={() => {
                onLookupSeller();
              }}
            >
              Lookup Seller Biz
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
              value={JSON.stringify(sellerBusiness, null, 2)}
            />
          </Form.Group>
        </Form.Row>
      </Form>
    </div>
  );
};

export default SellerOnboarding;
