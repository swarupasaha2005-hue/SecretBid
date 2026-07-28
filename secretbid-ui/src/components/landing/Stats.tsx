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
import { AnimatedCounter } from './AnimatedCounter';

const STATS = [
  { label: 'Active Auctions', value: 128, suffix: '' },
  { label: 'Completed Auctions', value: 942, suffix: '' },
  { label: 'Total Bids', value: 6300, suffix: '+' },
  { label: 'Winning Volume', value: 480, prefix: '$', suffix: 'K' },
];

/**
 * Four large statistic cards with animated count-up numbers. Illustrative
 * placeholder figures for the landing page presentation — not wired to any
 * live API data (this redesign only touches the UI layer).
 */
export const Stats: React.FC = () => (
  <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 120px' }}>
    <div className="secretbid-stats-grid">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          <GlassCard style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div
              style={{
                fontSize: 'clamp(2rem, 3vw, 2.6rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                background: `linear-gradient(135deg, ${palette.textPrimary} 20%, ${palette.softLavender} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 8,
              }}
            >
              <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </div>
            <div style={{ fontSize: 14, color: palette.muted, fontWeight: 500 }}>{stat.label}</div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  </section>
);
