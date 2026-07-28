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

const STEPS = [
  { icon: '📝', title: 'Create Auction', description: 'Set a title, description, and optional reserve price.' },
  { icon: '🔏', title: 'Commit Bid', description: 'Submit a sealed commitment — your amount stays private.' },
  { icon: '🔓', title: 'Reveal Bid', description: 'Prove your commitment and disclose your bid amount.' },
  { icon: '🏆', title: 'Winner Selected', description: 'The highest valid bid wins — verifiably, on-chain.' },
];

/**
 * The "How It Works" timeline: four glass cards, each representing one step
 * of the SecretBid auction lifecycle (mirroring the underlying
 * `createAuction` → `commitBid` → `revealBid` → `closeAuction` circuits),
 * connected by a horizontal line on desktop that collapses away on mobile.
 */
export const HowItWorks: React.FC = () => (
  <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 120px' }}>
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{ textAlign: 'center', marginBottom: 56 }}
    >
      <h2
        style={{
          fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: palette.textPrimary,
          margin: '0 0 12px',
        }}
      >
        How It Works
      </h2>
      <p style={{ color: palette.textSecondary, fontSize: 15.5, margin: 0 }}>
        Four steps from sealed bid to verifiable winner.
      </p>
    </motion.div>

    <div className="secretbid-steps-grid">
      <div
        className="secretbid-step-connector"
        aria-hidden
        style={{
          position: 'absolute',
          top: 40,
          left: '12.5%',
          right: '12.5%',
          height: 1,
          background: `linear-gradient(90deg, transparent, ${palette.border}, transparent)`,
        }}
      />
      {STEPS.map((step, i) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          style={{ position: 'relative', textAlign: 'center' }}
        >
          <GlassCard
            hoverLift={false}
            style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                background: `radial-gradient(circle, rgba(138,79,255,0.28) 0%, rgba(138,79,255,0.05) 100%)`,
                border: `1px solid ${palette.border}`,
                marginBottom: 18,
              }}
            >
              {step.icon}
            </div>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: palette.secondaryPurple,
                letterSpacing: '0.08em',
                marginBottom: 6,
              }}
            >
              STEP {i + 1}
            </div>
            <h3 style={{ fontSize: 16.5, fontWeight: 650, color: palette.textPrimary, margin: '0 0 8px' }}>
              {step.title}
            </h3>
            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: palette.textSecondary, margin: 0 }}>
              {step.description}
            </p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  </section>
);
