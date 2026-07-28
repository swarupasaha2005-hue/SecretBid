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
import { Gavel, Lock, Eye, CheckCircle2, FileCheck, EyeOff, Loader2 } from 'lucide-react';
import { palette } from '../../theme/palette';
import { GlassCard } from './GlassCard';
import { AnimatedCounter } from './AnimatedCounter';
import { type LandingAuctionsState } from '../../hooks';
import { type AuctionDerivedState, type AuctionId } from '../../../../api/src/index';

export interface ProtocolActivityProps {
  auctionsState: LandingAuctionsState;
  onConnect: () => void;
}

/**
 * Replaces the old illustrative "Statistics" section with real protocol activity, derived
 * entirely from the live `AuctionDerivedState` map exposed by {@link DeployedSecretBidAPI.auctions$}
 * (see `useLandingAuctions`). No figure here is hardcoded: every number is counted from actual
 * on-ledger auction records for whichever contract is currently connected.
 */
export const ProtocolActivity: React.FC<ProtocolActivityProps> = ({ auctionsState, onConnect }) => (
  <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 100px' }}>
    <div style={{ marginBottom: 28, textAlign: 'center' }}>
      <h2 style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', fontWeight: 600, color: palette.textPrimary, margin: 0 }}>
        Protocol Activity
      </h2>
      <p style={{ fontSize: 14, color: palette.muted, marginTop: 6 }}>
        Live, on-ledger auction data — nothing here is simulated.
      </p>
    </div>

    {auctionsState.status === 'no-deployment' && <ConnectPrompt onConnect={onConnect} />}
    {auctionsState.status === 'loading' && <LoadingState />}
    {auctionsState.status === 'ready' && <ActivityGrid auctions={auctionsState.auctions} />}
  </section>
);

const ActivityGrid: React.FC<{ auctions: ReadonlyMap<AuctionId, AuctionDerivedState> }> = ({ auctions }) => {
  const list = Array.from(auctions.values());

  if (list.length === 0) {
    return (
      <GlassCard style={{ padding: '40px 24px', textAlign: 'center' }}>
        <div
          style={{ fontSize: 'clamp(2rem, 3vw, 2.6rem)', fontWeight: 700, color: palette.textPrimary, marginBottom: 8 }}
        >
          0
        </div>
        <div style={{ fontSize: 14, color: palette.muted }}>No auctions created yet.</div>
      </GlassCard>
    );
  }

  const totalAuctions = list.length;
  const inCommit = list.filter((a) => a.phase === 'commit').length;
  const inReveal = list.filter((a) => a.phase === 'reveal').length;
  const closed = list.filter((a) => a.phase === 'closed').length;
  const totalCommitments = list.reduce((sum, a) => sum + a.commitCount, 0);
  const totalReveals = list.reduce((sum, a) => sum + a.revealCount, 0);

  const cards = [
    { icon: Gavel, label: 'Total Auctions', value: totalAuctions },
    { icon: Lock, label: 'In Commit Phase', value: inCommit },
    { icon: Eye, label: 'In Reveal Phase', value: inReveal },
    { icon: CheckCircle2, label: 'Closed Auctions', value: closed },
    { icon: FileCheck, label: 'Total Commitments', value: totalCommitments },
    { icon: EyeOff, label: 'Total Reveals', value: totalReveals },
  ];

  return (
    <div className="secretbid-activity-grid">
      {cards.map(({ icon: Icon, label, value }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
        >
          <GlassCard hoverLift style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Icon size={18} color={palette.softLavender} strokeWidth={1.75} />
            <div style={{ fontSize: '1.9rem', fontWeight: 700, letterSpacing: '-0.02em', color: palette.textPrimary }}>
              <AnimatedCounter value={value} />
            </div>
            <div style={{ fontSize: 13, color: palette.muted, fontWeight: 500 }}>{label}</div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};

const LoadingState: React.FC = () => (
  <GlassCard style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
    <Loader2 size={18} color={palette.muted} className="secretbid-spin" />
    <span style={{ fontSize: 14, color: palette.muted }}>Loading live auction data…</span>
  </GlassCard>
);

const ConnectPrompt: React.FC<{ onConnect: () => void }> = ({ onConnect }) => (
  <GlassCard style={{ padding: '32px 24px', textAlign: 'center' }}>
    <div style={{ fontSize: 14, color: palette.muted, marginBottom: 16 }}>
      Connect a wallet to view live protocol activity for a deployed SecretBid contract.
    </div>
    <button
      onClick={onConnect}
      style={{
        background: 'transparent',
        border: `1px solid ${palette.border}`,
        borderRadius: 10,
        padding: '10px 20px',
        color: palette.textPrimary,
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      Connect Wallet
    </button>
  </GlassCard>
);
