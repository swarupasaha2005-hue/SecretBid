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
import { motion } from 'framer-motion';
import { palette } from '../../theme/palette';
import { GlassCard } from './GlassCard';
import { GradientButton } from './GradientButton';

export interface CTASectionProps {
  onCreateAuction?: () => void;
  onBrowseAuctions?: () => void;
}

/** The large glowing closing panel encouraging the visitor to take action. */
export const CTASection: React.FC<CTASectionProps> = ({ onCreateAuction, onBrowseAuctions }) => (
  <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 140px' }}>
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      <GlassCard
        hoverLift={false}
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: 'clamp(40px, 6vw, 72px)',
          textAlign: 'center',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 60% 80% at 50% 100%, ${palette.glow} 0%, rgba(168,107,255,0) 70%)`,
            opacity: 0.6,
          }}
        />
        <div style={{ position: 'relative' }}>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.6vw, 2.8rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: palette.textPrimary,
              margin: '0 0 32px',
              maxWidth: 640,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Ready to create your first private auction?
          </h2>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <GradientButton size="large" variant="primary" onClick={onCreateAuction}>
              Create Auction
            </GradientButton>
            <GradientButton size="large" variant="secondary" onClick={onBrowseAuctions}>
              Dashboard
            </GradientButton>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  </section>
);
