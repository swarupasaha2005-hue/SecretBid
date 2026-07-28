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
import { palette } from '../../theme/palette';

/** A minimal, elegant footer closing out the landing page. */
export const Footer: React.FC = () => (
  <footer
    style={{
      borderTop: `1px solid ${palette.border}`,
      padding: '40px 24px',
    }}
  >
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: palette.textPrimary }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${palette.softLavender} 0%, ${palette.primaryPurple} 100%)`,
          }}
        />
        SecretBid
      </div>

      <div style={{ fontSize: 13.5, color: palette.muted }}>Built on Midnight</div>

      <div style={{ display: 'flex', gap: 24, fontSize: 13.5 }}>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          style={{ color: palette.textSecondary, textDecoration: 'none' }}
        >
          GitHub
        </a>
        <a
          href="https://docs.midnight.network"
          target="_blank"
          rel="noreferrer"
          style={{ color: palette.textSecondary, textDecoration: 'none' }}
        >
          Documentation
        </a>
      </div>

      <div style={{ fontSize: 12.5, color: palette.muted }}>Built for the Midnight Hackathon</div>
    </div>
  </footer>
);
