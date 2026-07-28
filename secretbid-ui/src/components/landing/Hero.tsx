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

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { palette } from '../../theme/palette';
import { GradientButton } from './GradientButton';

export interface HeroProps {
  onExploreAuctions?: () => void;
  onCreateAuction?: () => void;
}

const PARTICLE_COUNT = 18;

/**
 * The landing page hero: a single full-bleed scene, not a two-column
 * layout. `public/hero1.png` — the artwork that defines SecretBid's
 * entire visual identity — is the hero background itself: absolutely
 * positioned, uncropped, undistorted, centered, and faded into the page
 * via a mask so it never ends on a hard edge. The headline/CTA copy is
 * layered on top via absolute positioning, with a soft dark gradient
 * between the two for readability.
 */
export const Hero: React.FC<HeroProps> = ({ onExploreAuctions, onCreateAuction }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 70}%`,
        size: 1.5 + Math.random() * 2,
        duration: 10 + Math.random() * 8,
        delay: Math.random() * 6,
      })),
    [],
  );

  return (
    <section className="secretbid-hero" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Layer 1: dark, mysterious base — the glow here is deliberately faint;
          the moon artwork itself is the primary light source (see layer 2) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(circle at 50% 15%, rgba(122,68,255,0.10) 0%, transparent 45%),
            radial-gradient(circle at 50% 100%, rgba(214,148,255,0.05) 0%, transparent 40%),
            linear-gradient(180deg, ${palette.background} 0%, ${palette.backgroundSecondary} 50%, ${palette.background} 100%)
          `,
        }}
      />

      {/* Tiny floating particles, ambient depth */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            animate={{ y: [0, -16, 0], opacity: [0.1, 0.55, 0.1] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
            style={{
              position: 'absolute',
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: palette.softLavender,
            }}
          />
        ))}
      </div>

      {/* Layer 2: hero1.png as the hero background itself — enlarged beyond
          the viewport and shifted down so it reads as the primary light
          source, without its brightest point sitting directly behind the
          paragraph text */}
      <div
        className="secretbid-hero-image-wrap"
        style={{
          position: 'absolute',
          zIndex: 1,
          top: '62%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '130%',
          maxWidth: 1700,
        }}
      >
        {/* Glow sourced from the artwork itself */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '-8%',
            background: `radial-gradient(circle, ${palette.glow} 0%, rgba(168,107,255,0) 60%)`,
            filter: 'blur(80px)',
            zIndex: 0,
          }}
        />
        <motion.img
          src="/hero1.png"
          alt="SecretBid — a glowing crescent moon watched over by a small lantern-lit figure"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1, y: [0, -14, 0] }}
          transition={{
            opacity: { duration: 0.9, ease: 'easeOut' },
            scale: { duration: 0.9, ease: 'easeOut' },
            y: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.9 },
          }}
          className="secretbid-hero-image"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'block',
            width: '100%',
            height: 'auto',
            WebkitMaskImage:
              'radial-gradient(ellipse 62% 68% at 50% 50%, black 55%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 62% 68% at 50% 50%, black 55%, transparent 100%)',
          }}
        />
      </div>

      {/* Layer 3: soft dark backdrop behind the text only — not a full-page
          overlay — so the moon stays the page's light source while the
          copy stays readable */}
      <div
        aria-hidden
        className="secretbid-hero-overlay"
        style={{
          position: 'absolute',
          zIndex: 2,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(90%, 900px)',
          height: 'min(80%, 620px)',
          background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(5,2,15,0.6) 0%, rgba(5,2,15,0.3) 55%, rgba(5,2,15,0) 80%)',
          filter: 'blur(6px)',
        }}
      />

      {/* Layer 4: hero content, absolutely centered on top */}
      <div
        className="secretbid-hero-content"
        style={{
          position: 'relative',
          zIndex: 3,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: 860,
          margin: '0 auto',
          padding: '140px 24px 120px',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
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
            marginBottom: 32,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: palette.secondaryPurple,
              boxShadow: `0 0 8px 2px ${palette.glow}`,
            }}
          />
          Powered by Midnight
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          style={{
            fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            fontWeight: 700,
            margin: 0,
            marginBottom: 28,
            background: `linear-gradient(135deg, ${palette.textPrimary} 30%, ${palette.softLavender} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Private Auctions.
          <br />
          Public Trust.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          style={{
            fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
            lineHeight: 1.65,
            color: palette.textSecondary,
            maxWidth: 560,
            margin: '0 auto 40px',
          }}
        >
          SecretBid is a privacy-preserving sealed-bid auction protocol built on Midnight that allows users to submit
          confidential bids, reveal them securely, and determine winners without exposing losing bids during the
          auction.
        </motion.p>

        <motion.div
          className="secretbid-hero-actions"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <GradientButton size="large" variant="primary" onClick={onExploreAuctions}>
            Explore Auctions
          </GradientButton>
          <GradientButton size="large" variant="secondary" onClick={onCreateAuction}>
            Create Auction
          </GradientButton>
        </motion.div>
      </div>
    </section>
  );
};
