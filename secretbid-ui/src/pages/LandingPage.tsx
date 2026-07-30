// This file is part of midnightntwrk/example-secretbid.
// Copyright (C) Midnight Foundation
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AmbientBackground,
  Navbar,
  Hero,
  FeatureCards,
  HowItWorks,
  ProtocolActivity,
  RecentAuctions,
  CTASection,
  Footer,
} from '../components/landing';
import { useLandingAuctions, usePageTitle } from '../hooks';

/**
 * The SecretBid marketing landing page: a cinematic, premium Web3 landing
 * experience built entirely around `public/hero1.png`. Every visual here —
 * background glow, card surfaces, gradients — is UI-only presentation, with one exception: the
 * "Protocol Activity" and "Recent Auctions" sections below display real, live auction data (via
 * `useLandingAuctions`) whenever a SecretBid contract deployment is already connected. "Explore
 * Dashboard" / "Create Auction" / "Dashboard" (CTA) route to `/dashboard`, the app's authenticated
 * hub; "Connect Wallet" routes to `/app`, where wallet connection and contract interactions happen.
 */
export const LandingPage: React.FC = () => {
  usePageTitle();
  const navigate = useNavigate();
  const auctionsState = useLandingAuctions();
  const goToApp = () => navigate('/app');
  const goToCreateAuction = () => navigate('/create-auction');
  const goToDashboard = () => navigate('/dashboard');

  return (
    <div
      style={{ position: 'relative', minHeight: '100vh', color: '#FFFFFF', fontFamily: 'Inter, Helvetica, sans-serif' }}
    >
      <AmbientBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Hero onExploreAuctions={goToDashboard} onCreateAuction={goToCreateAuction} />
        <FeatureCards />
        <HowItWorks />
        <ProtocolActivity auctionsState={auctionsState} onConnect={goToApp} />
        <RecentAuctions
          auctionsState={auctionsState}
          onCreateAuction={goToCreateAuction}
          onViewAuction={goToDashboard}
        />
        <CTASection onCreateAuction={goToCreateAuction} onBrowseAuctions={goToDashboard} />
        <Footer />
      </div>
    </div>
  );
};
