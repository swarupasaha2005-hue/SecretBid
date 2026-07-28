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
import { palette, gradients } from '../../theme/palette';

export interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'medium' | 'large';
}

/**
 * The shared call-to-action button style for the landing page: a rounded
 * purple gradient "primary" variant with a soft glow, and a glass
 * "secondary" variant with a hairline border. Both scale slightly on
 * hover/press for a tasteful, premium-feeling interaction.
 */
export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
}) => {
  const isPrimary = variant === 'primary';
  const padding = size === 'large' ? '16px 36px' : '13px 28px';
  const fontSize = size === 'large' ? 17 : 15;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        scale: 1.035,
        boxShadow: isPrimary ? `0 0 40px 4px ${palette.glow}` : `0 0 24px 2px ${palette.glow}`,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{
        cursor: 'pointer',
        border: isPrimary ? 'none' : `1px solid ${palette.border}`,
        borderRadius: 999,
        padding,
        fontSize,
        fontWeight: 600,
        fontFamily: 'inherit',
        letterSpacing: '-0.01em',
        color: palette.textPrimary,
        background: isPrimary ? gradients.buttonPrimary : 'rgba(255,255,255,0.04)',
        boxShadow: isPrimary ? `0 0 24px 0px ${palette.glow}` : 'none',
        backdropFilter: isPrimary ? undefined : 'blur(12px)',
      }}
    >
      {children}
    </motion.button>
  );
};
