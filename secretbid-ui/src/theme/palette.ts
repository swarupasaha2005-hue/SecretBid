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

/**
 * The SecretBid landing page colour system — derived from the deep purple,
 * glowing-moon mood of `public/hero1.png`. Shared by every landing section
 * so the whole page reads as one consistent visual language.
 */
export const palette = {
  background: '#05020F',
  backgroundSecondary: '#09041A',
  surface: '#10081F',
  surfaceElevated: '#191033',
  primaryPurple: '#8A4FFF',
  secondaryPurple: '#A86BFF',
  softLavender: '#DCC5FF',
  glow: 'rgba(168,107,255,0.35)',
  border: 'rgba(255,255,255,0.08)',
  textPrimary: '#FFFFFF',
  textSecondary: '#B7B2C8',
  muted: '#7B7690',
  success: '#22C55E',
  error: '#EF4444',
} as const;

export const gradients = {
  buttonPrimary: `linear-gradient(135deg, ${palette.primaryPurple} 0%, ${palette.secondaryPurple} 100%)`,
  heroGlow: `radial-gradient(circle, ${palette.glow} 0%, rgba(168,107,255,0) 70%)`,
  textGlow: `linear-gradient(135deg, ${palette.textPrimary} 20%, ${palette.softLavender} 100%)`,
} as const;
