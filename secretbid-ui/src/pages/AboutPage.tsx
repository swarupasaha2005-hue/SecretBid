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
import { motion } from 'framer-motion';
import { EyeOff, Info, Lock, ShieldCheck } from 'lucide-react';
import { AmbientBackground, Navbar, Footer, GlassCard, GradientButton } from '../components/landing';
import { palette, gradients } from '../theme/palette';
import { usePageTitle } from '../hooks';

const POINTS = [
  {
    icon: Lock,
    title: 'Commit privately',
    body: 'Bidders submit only a cryptographic commitment to their bid — a hash. The amount never leaves their machine at this stage.',
  },
  {
    icon: EyeOff,
    title: 'Stay sealed until reveal',
    body: 'Every commitment looks identical on-ledger, so no one — not other bidders, not the auction creator — can rank or compare bids before the reveal phase.',
  },
  {
    icon: ShieldCheck,
    title: 'Reveal with proof',
    body: 'When a bidder reveals, they prove — via zero-knowledge proof — that the disclosed amount matches their original commitment, enforced by the contract itself.',
  },
];

/**
 * A short "About" page explaining SecretBid's premise and privacy model in plain terms, reusing
 * the same glass/gradient design language as every other page (`AmbientBackground` / `GlassCard` /
 * `GradientButton` / `theme/palette`). Content is a condensed version of the README's "Product
 * Idea" and "Privacy Claim" sections — no new design system, no contract or API changes.
 */
export const AboutPage: React.FC = () => {
  usePageTitle('About');
  const navigate = useNavigate();

  return (
    <div
      style={{ position: 'relative', minHeight: '100vh', color: '#FFFFFF', fontFamily: 'Inter, Helvetica, sans-serif' }}
    >
      <AmbientBackground />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />

        <main style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px 120px' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 16px',
                borderRadius: 999,
                border: `1px solid ${palette.border}`,
                background: 'rgba(138,79,255,0.08)',
                color: palette.softLavender,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.02em',
                marginBottom: 24,
              }}
            >
              <Info size={13} />
              About
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                fontWeight: 700,
                margin: 0,
                marginBottom: 18,
                background: gradients.textGlow,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              About SecretBid
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.1rem)',
                lineHeight: 1.65,
                color: palette.textSecondary,
                maxWidth: 640,
                margin: '0 auto',
              }}
            >
              Traditional on-chain auctions leak every bid the moment it&apos;s submitted. SecretBid fixes this with
              zero-knowledge proofs: a sealed-bid auction where bid amounts stay confidential until you choose to reveal
              them.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 56 }}>
            {POINTS.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              >
                <GlassCard style={{ padding: 24, display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: 'rgba(138,79,255,0.12)',
                      border: `1px solid ${palette.border}`,
                      flexShrink: 0,
                    }}
                  >
                    <point.icon size={18} color={palette.softLavender} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 650, color: palette.textPrimary }}>
                      {point.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: palette.textSecondary }}>
                      {point.body}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ textAlign: 'center' }}
          >
            <GradientButton size="large" onClick={() => navigate('/dashboard')}>
              Explore Dashboard
            </GradientButton>
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
