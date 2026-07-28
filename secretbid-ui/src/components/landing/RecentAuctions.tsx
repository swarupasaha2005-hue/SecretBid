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
import { Lock, Eye, CheckCircle2, Gavel } from 'lucide-react';
import { palette } from '../../theme/palette';
import { GlassCard } from './GlassCard';
import { GradientButton } from './GradientButton';
import { type LandingAuctionsState } from '../../hooks';
import { type AuctionDerivedState, type AuctionPhase } from '../../../../api/src/index';

export interface RecentAuctionsProps {
  auctionsState: LandingAuctionsState;
  onCreateAuction: () => void;
  onViewAuction: () => void;
}

const MAX_RECENT = 6;

const PHASE_LABEL: Record<AuctionPhase, string> = {
  commit: 'Commit',
  reveal: 'Reveal',
  closed: 'Closed',
};

const PHASE_ICON: Record<AuctionPhase, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  commit: Lock,
  reveal: Eye,
  closed: CheckCircle2,
};

const PHASE_COLOR: Record<AuctionPhase, string> = {
  commit: palette.secondaryPurple,
  reveal: palette.softLavender,
  closed: palette.success,
};

/**
 * Shows the most recently created auctions from the live `AuctionDerivedState` map (see
 * `useLandingAuctions`). Every field displayed — title, phase, reserve price, commit/reveal
 * counts — comes directly off the ledger-derived `AuctionRecord`; nothing is invented.
 */
export const RecentAuctions: React.FC<RecentAuctionsProps> = ({ auctionsState, onCreateAuction, onViewAuction }) => {
  if (auctionsState.status !== 'ready') {
    // No connected deployment yet, or still resolving — ProtocolActivity above already
    // communicates this; avoid showing a second, redundant message here.
    return null;
  }

  const recent = Array.from(auctionsState.auctions.values()).slice(-MAX_RECENT).reverse();

  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 120px' }}>
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', fontWeight: 600, color: palette.textPrimary, margin: 0 }}>
          Recent Auctions
        </h2>
      </div>

      {recent.length === 0 ? (
        <GlassCard style={{ padding: '48px 24px', textAlign: 'center' }}>
          <Gavel size={28} color={palette.muted} strokeWidth={1.5} style={{ marginBottom: 14 }} />
          <div style={{ fontSize: 16, color: palette.textPrimary, marginBottom: 20 }}>
            No auctions have been created yet.
          </div>
          <GradientButton onClick={onCreateAuction}>Create Auction</GradientButton>
        </GlassCard>
      ) : (
        <div className="secretbid-recent-grid">
          {recent.map((auction, i) => (
            <AuctionCard key={auction.auctionId} auction={auction} onViewAuction={onViewAuction} delay={i * 0.05} />
          ))}
        </div>
      )}
    </section>
  );
};

const AuctionCard: React.FC<{ auction: AuctionDerivedState; onViewAuction: () => void; delay: number }> = ({
  auction,
  onViewAuction,
  delay,
}) => {
  const PhaseIcon = PHASE_ICON[auction.phase];
  const title = auction.title.trim().length > 0 ? auction.title : `Auction ${auction.auctionId.slice(0, 8)}…`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay }}
    >
      <GlassCard
        hoverLift
        style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: palette.textPrimary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 999,
              border: `1px solid ${palette.border}`,
              flexShrink: 0,
            }}
          >
            <PhaseIcon size={12} color={PHASE_COLOR[auction.phase]} strokeWidth={2} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: PHASE_COLOR[auction.phase],
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {PHASE_LABEL[auction.phase]}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, fontSize: 13, color: palette.muted }}>
          <div>
            <div style={{ color: palette.textSecondary, fontWeight: 600 }}>
              {auction.reservePrice !== undefined ? auction.reservePrice.toLocaleString() : 'No reserve'}
            </div>
            <div>Reserve Price</div>
          </div>
          <div>
            <div style={{ color: palette.textSecondary, fontWeight: 600 }}>{auction.commitCount}</div>
            <div>Commits</div>
          </div>
          <div>
            <div style={{ color: palette.textSecondary, fontWeight: 600 }}>{auction.revealCount}</div>
            <div>Reveals</div>
          </div>
        </div>

        <button
          onClick={onViewAuction}
          style={{
            marginTop: 'auto',
            alignSelf: 'flex-start',
            background: 'transparent',
            border: 'none',
            padding: 0,
            color: palette.softLavender,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          View Auction →
        </button>
      </GlassCard>
    </motion.div>
  );
};
