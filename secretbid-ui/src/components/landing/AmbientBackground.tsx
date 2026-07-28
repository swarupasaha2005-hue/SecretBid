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

/** A handful of tiny, slow-drifting particles — deliberately sparse and subtle. */
const PARTICLE_COUNT = 24;

/**
 * The full-page ambient background for the SecretBid landing page: layered
 * radial gradients evoking the glowing moon in `hero1.png`, two large
 * blurred purple orbs, an SVG grain/noise overlay, and a scattering of
 * tiny floating particles. Everything here is fixed-position and behind
 * the content (`zIndex: 0`), and deliberately understated — no
 * attention-grabbing motion, just a sense of depth and atmosphere.
 */
export const AmbientBackground: React.FC = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 2,
        duration: 12 + Math.random() * 10,
        delay: Math.random() * 8,
      })),
    [],
  );

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        background: palette.background,
      }}
    >
      {/* Base layered radial gradients, echoing the glow of the hero moon */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 50% -10%, rgba(138,79,255,0.20) 0%, rgba(138,79,255,0) 60%),
            radial-gradient(ellipse 60% 40% at 90% 20%, rgba(168,107,255,0.12) 0%, rgba(168,107,255,0) 60%),
            radial-gradient(ellipse 50% 40% at 5% 70%, rgba(138,79,255,0.10) 0%, rgba(138,79,255,0) 60%),
            linear-gradient(180deg, ${palette.background} 0%, ${palette.backgroundSecondary} 100%)
          `,
        }}
      />

      {/* Large blurred glowing orbs */}
      <motion.div
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: palette.primaryPurple,
          filter: 'blur(160px)',
          opacity: 0.5,
        }}
      />
      <motion.div
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '10%',
          width: 640,
          height: 640,
          borderRadius: '50%',
          background: palette.secondaryPurple,
          filter: 'blur(200px)',
          opacity: 0.4,
        }}
      />

      {/* Tiny floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.6, 0.15] }}
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

      {/* Subtle grain overlay */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.05,
          mixBlendMode: 'overlay',
        }}
      >
        <filter id="secretbid-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#secretbid-grain)" />
      </svg>
    </div>
  );
};
