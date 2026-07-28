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
import { motion, type HTMLMotionProps } from 'framer-motion';
import { palette } from '../../theme/palette';

export interface GlassCardProps extends HTMLMotionProps<'div'> {
  /** Adds a lift + purple glow on hover. Defaults to true. */
  hoverLift?: boolean;
  children?: React.ReactNode;
}

/**
 * The shared glassmorphism surface used by every card on the SecretBid
 * landing page: translucent surface colour, backdrop blur, a hairline
 * border, and a soft ambient shadow. `hoverLift` adds the "premium product
 * site" hover treatment — a small upward lift plus a brighter purple glow.
 */
export const GlassCard: React.FC<GlassCardProps> = ({ hoverLift = true, style, children, ...rest }) => (
  <motion.div
    {...rest}
    whileHover={
      hoverLift
        ? {
            y: -6,
            boxShadow: `0 24px 64px -12px ${palette.glow}, 0 0 0 1px rgba(255,255,255,0.12)`,
          }
        : undefined
    }
    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    style={{
      background: 'linear-gradient(180deg, rgba(25,16,51,0.6) 0%, rgba(18,10,36,0.6) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: `1px solid ${palette.border}`,
      borderRadius: 24,
      boxShadow: '0 12px 40px -16px rgba(0,0,0,0.6)',
      ...style,
    }}
  >
    {children}
  </motion.div>
);
