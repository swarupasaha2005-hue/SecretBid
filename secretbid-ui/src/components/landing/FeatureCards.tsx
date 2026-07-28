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

const FEATURES = [
  {
    icon: '🔒',
    title: 'Privacy First',
    description:
      'Bid amounts stay in your local private state — never disclosed on-chain until you choose to reveal them.',
  },
  {
    icon: '🔗',
    title: 'Cryptographic Commitments',
    description:
      'Every bid is sealed with a zero-knowledge commitment hash, binding it to you and the auction without exposing it.',
  },
  {
    icon: '⚖️',
    title: 'Fair Winner Selection',
    description:
      'Winners are determined by verifiable on-chain logic — no operator, no backroom deals, no trust required.',
  },
  {
    icon: '🌙',
    title: 'Powered by Midnight',
    description:
      'Built on Midnight’s zero-knowledge smart contracts, combining public verifiability with real confidentiality.',
  },
];

/**
 * The four premium feature cards shown just after the hero. Each is a
 * `GlassCard` with a soft hover lift and purple glow, revealed with a
 * gentle staggered fade/slide as it scrolls into view.
 */
export const FeatureCards: React.FC = () => (
  <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 120px' }}>
    <div className="secretbid-feature-grid">
      {FEATURES.map((feature, i) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, delay: i * 0.08, ease: 'easeOut' }}
        >
          <GlassCard style={{ padding: 28, height: '100%' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                background: 'linear-gradient(135deg, rgba(138,79,255,0.25), rgba(168,107,255,0.08))',
                border: `1px solid ${palette.border}`,
                marginBottom: 20,
              }}
            >
              {feature.icon}
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 650,
                color: palette.textPrimary,
                margin: '0 0 10px',
                letterSpacing: '-0.01em',
              }}
            >
              {feature.title}
            </h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: palette.textSecondary, margin: 0 }}>
              {feature.description}
            </p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  </section>
);
