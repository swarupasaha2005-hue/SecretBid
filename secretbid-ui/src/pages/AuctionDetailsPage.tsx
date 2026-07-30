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

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  FileCheck,
  Gavel,
  Loader2,
  Lock,
  RotateCcw,
  Trophy,
  User,
} from 'lucide-react';
import { AmbientBackground, Navbar, Footer, GlassCard, GradientButton } from '../components/landing';
import { palette, gradients } from '../theme/palette';
import {
  useAuction,
  useCloseAuction,
  useCommitBid,
  useDeployment,
  usePageTitle,
  useRevealBid,
  useStartReveal,
} from '../hooks';
import { useToast } from '../contexts';
import { classifyError } from '../lib/errors';
import { type AuctionPhase } from '../../../api/src/index';
import './create-auction.css';
import './dashboard.css';

const PHASE_ACCENT: Record<
  AuctionPhase,
  { color: string; glow: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }
> = {
  commit: { color: palette.softLavender, glow: 'rgba(168,107,255,0.35)', icon: Lock },
  reveal: { color: '#FFA857', glow: 'rgba(255,168,87,0.35)', icon: Eye },
  closed: { color: palette.success, glow: 'rgba(34,197,94,0.3)', icon: CheckCircle2 },
};

const shortenIdentity = (value: string): string => {
  const hex = value.startsWith('0x') ? value.slice(2) : value;
  return hex.length <= 12 ? hex : `${hex.slice(0, 4)}...${hex.slice(-4)}`;
};

/**
 * `/auction/:auctionId` — the auction details page, completing the wiring the Dashboard cards link
 * out to. Reads via {@link useAuction} (the same live `auctions$` stream backing the Dashboard) and
 * writes via {@link useCommitBid} / {@link useStartReveal} / {@link useRevealBid} /
 * {@link useCloseAuction} — each a direct, unmodified call into `DeployedSecretBidAPI`. No action
 * here fabricates a transaction: every button attempts the real circuit call and reports the real
 * outcome (including "Midnight services are unavailable" when the backend can't be reached).
 */
export const AuctionDetailsPage: React.FC = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const deployment = useDeployment();
  const api = deployment.status === 'ready' ? deployment.api : undefined;

  const auctionQuery = useAuction(auctionId, api);
  usePageTitle(auctionQuery.data?.title.trim() || 'Auction Details');
  const commitMutation = useCommitBid(api);
  const startRevealMutation = useStartReveal(api);
  const revealMutation = useRevealBid(api);
  const closeMutation = useCloseAuction(api);

  const [bidAmount, setBidAmount] = useState('');

  const runAction = async (action: () => Promise<unknown>, successMessage: string): Promise<void> => {
    try {
      await action();
      showToast('success', successMessage);
    } catch (error) {
      const classified = classifyError(error);
      showToast(classified.kind === 'midnight-unavailable' ? 'warning' : 'error', classified.message);
    }
  };

  const handleCommit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!auctionId || !bidAmount.trim() || commitMutation.isPending) return;
    void runAction(
      () => commitMutation.mutateAsync({ auctionId, amount: BigInt(bidAmount.trim()) }),
      'Bid committed. Your amount stays confidential until you reveal it.',
    ).then(() => setBidAmount(''));
  };

  const handleStartReveal = () => {
    if (!auctionId || startRevealMutation.isPending) return;
    void runAction(() => startRevealMutation.mutateAsync(auctionId), 'Reveal phase started.');
  };

  const handleReveal = () => {
    if (!auctionId || revealMutation.isPending) return;
    void runAction(() => revealMutation.mutateAsync(auctionId), 'Bid revealed successfully.');
  };

  const handleClose = () => {
    if (!auctionId || closeMutation.isPending) return;
    void runAction(() => closeMutation.mutateAsync(auctionId), 'Auction closed.');
  };

  return (
    <div
      style={{ position: 'relative', minHeight: '100vh', color: '#FFFFFF', fontFamily: 'Inter, Helvetica, sans-serif' }}
    >
      <AmbientBackground />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />

        <main style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px 120px' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: palette.textSecondary,
                fontSize: 13.5,
                fontFamily: 'inherit',
                marginBottom: 32,
                padding: 0,
              }}
            >
              <ArrowLeft size={15} />
              Back to Dashboard
            </button>
          </motion.div>

          {deployment.status === 'connecting' && <DetailsSkeleton />}

          {deployment.status === 'error' && (
            <StatusCard
              icon={<AlertTriangle size={28} color={palette.error} strokeWidth={1.5} />}
              title={
                deployment.error.kind === 'midnight-unavailable' ? 'Midnight services unavailable' : "Couldn't connect"
              }
              message={deployment.error.message}
              action={
                <GradientButton variant="secondary" onClick={deployment.retry}>
                  Try Again
                </GradientButton>
              }
            />
          )}

          {deployment.status === 'ready' && auctionQuery.isPending && <DetailsSkeleton />}

          {deployment.status === 'ready' && auctionQuery.isError && (
            <StatusCard
              icon={<AlertTriangle size={28} color={palette.error} strokeWidth={1.5} />}
              title={
                classifyError(auctionQuery.error).kind === 'auction-not-found'
                  ? 'Auction not found'
                  : "Couldn't load this auction"
              }
              message={classifyError(auctionQuery.error).message}
              action={
                classifyError(auctionQuery.error).kind === 'auction-not-found' ? (
                  <GradientButton onClick={() => navigate('/dashboard')}>Back to Dashboard</GradientButton>
                ) : (
                  <GradientButton variant="secondary" onClick={() => auctionQuery.refetch()}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <RotateCcw size={15} />
                      Try Again
                    </span>
                  </GradientButton>
                )
              }
            />
          )}

          {deployment.status === 'ready' && auctionQuery.isSuccess && (
            <>
              {(() => {
                const auction = auctionQuery.data;
                const { color, glow, icon: PhaseIcon } = PHASE_ACCENT[auction.phase];
                const title =
                  auction.title.trim().length > 0 ? auction.title : `Auction ${auction.auctionId.slice(0, 8)}…`;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                  >
                    <GlassCard hoverLift={false} style={{ padding: 'clamp(28px, 4vw, 40px)', marginBottom: 24 }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '5px 12px',
                          borderRadius: 999,
                          border: `1px solid ${palette.border}`,
                          background: `linear-gradient(135deg, ${glow} 0%, rgba(255,255,255,0.02) 100%)`,
                          marginBottom: 18,
                        }}
                      >
                        <PhaseIcon size={11} strokeWidth={2.25} />
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {auction.phase}
                        </span>
                      </div>

                      <h1
                        style={{
                          fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                          lineHeight: 1.15,
                          letterSpacing: '-0.02em',
                          fontWeight: 700,
                          margin: '0 0 12px',
                          background: gradients.textGlow,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {title}
                      </h1>

                      <p style={{ margin: '0 0 24px', fontSize: 14.5, lineHeight: 1.7, color: palette.textSecondary }}>
                        {auction.description.trim().length > 0 ? auction.description : 'No description provided.'}
                      </p>

                      <div style={{ height: 1, background: palette.border, marginBottom: 20 }} />

                      <div className="secretbid-create-info-grid" style={{ marginBottom: 0 }}>
                        <Stat
                          icon={<Gavel size={16} color={palette.softLavender} />}
                          label="Reserve Price"
                          value={
                            auction.reservePrice !== undefined ? auction.reservePrice.toLocaleString() : 'No Reserve'
                          }
                        />
                        <Stat
                          icon={<FileCheck size={16} color={palette.softLavender} />}
                          label="Commits"
                          value={String(auction.commitCount)}
                        />
                        <Stat
                          icon={<EyeOff size={16} color={palette.softLavender} />}
                          label="Reveals"
                          value={String(auction.revealCount)}
                        />
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginTop: 20,
                          fontSize: 12.5,
                          color: palette.muted,
                        }}
                      >
                        <User size={13} />
                        Created by {shortenIdentity(auction.creator)}
                        {auction.isCreator && ' (you)'}
                      </div>

                      {auction.phase === 'closed' && auction.winner && (
                        <div
                          style={{
                            marginTop: 20,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '14px 18px',
                            borderRadius: 14,
                            border: `1px solid ${palette.border}`,
                            background: 'rgba(34,197,94,0.08)',
                          }}
                        >
                          <Trophy size={18} color={palette.success} />
                          <span style={{ fontSize: 13.5, color: palette.textPrimary }}>
                            Winner: {shortenIdentity(auction.winner)}
                            {auction.isWinner && ' — that’s you!'}
                            {auction.winningBid !== undefined && ` · ${auction.winningBid.toLocaleString()}`}
                          </span>
                        </div>
                      )}
                    </GlassCard>

                    <GlassCard hoverLift={false} style={{ padding: 'clamp(24px, 4vw, 36px)' }}>
                      {auction.phase === 'commit' && !auction.hasCommitted && (
                        <form onSubmit={handleCommit}>
                          <label
                            htmlFor="secretbid-bid-amount"
                            style={{
                              display: 'block',
                              fontSize: 14,
                              fontWeight: 600,
                              color: palette.textPrimary,
                              marginBottom: 10,
                            }}
                          >
                            Your Bid Amount
                          </label>
                          <input
                            id="secretbid-bid-amount"
                            className="secretbid-create-input"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="e.g. 750"
                            inputMode="numeric"
                            disabled={commitMutation.isPending}
                            required
                          />
                          <p style={{ margin: '8px 0 20px', fontSize: 12.5, color: palette.muted }}>
                            Only a commitment hash is sent on-chain — the amount stays private until you reveal it.
                          </p>
                          <ActionButton loading={commitMutation.isPending} disabled={!bidAmount.trim()}>
                            {commitMutation.isPending ? 'Committing Bid…' : 'Commit Bid'}
                          </ActionButton>
                        </form>
                      )}

                      {auction.phase === 'commit' && auction.hasCommitted && (
                        <InlineNotice
                          icon={<CheckCircle2 size={18} color={palette.success} />}
                          text="You have committed a bid to this auction. Waiting for the reveal phase to begin."
                        />
                      )}

                      {auction.phase === 'commit' && auction.isCreator && (
                        <div style={{ marginTop: 20 }}>
                          <ActionButton
                            variant="secondary"
                            loading={startRevealMutation.isPending}
                            onClick={handleStartReveal}
                          >
                            {startRevealMutation.isPending ? 'Starting Reveal…' : 'Start Reveal Phase'}
                          </ActionButton>
                        </div>
                      )}

                      {auction.phase === 'reveal' && !auction.hasRevealed && auction.hasCommitted && (
                        <ActionButton loading={revealMutation.isPending} onClick={handleReveal}>
                          {revealMutation.isPending ? 'Revealing Bid…' : 'Reveal Bid'}
                        </ActionButton>
                      )}

                      {auction.phase === 'reveal' && !auction.hasCommitted && (
                        <InlineNotice
                          icon={<AlertTriangle size={18} color={palette.muted} />}
                          text="You did not commit a bid to this auction, so there is nothing to reveal."
                        />
                      )}

                      {auction.phase === 'reveal' && auction.hasRevealed && (
                        <InlineNotice
                          icon={<CheckCircle2 size={18} color={palette.success} />}
                          text={
                            auction.myBidAmount !== undefined
                              ? `You revealed a bid of ${auction.myBidAmount.toLocaleString()}.`
                              : 'You have revealed your bid.'
                          }
                        />
                      )}

                      {auction.phase === 'reveal' && auction.isCreator && (
                        <div style={{ marginTop: auction.hasRevealed || !auction.hasCommitted ? 0 : 20 }}>
                          <ActionButton variant="secondary" loading={closeMutation.isPending} onClick={handleClose}>
                            {closeMutation.isPending ? 'Closing Auction…' : 'Close Auction'}
                          </ActionButton>
                          <p style={{ margin: '10px 0 0', fontSize: 12, color: palette.muted }}>
                            Closing finalizes the auction once every commitment has been revealed.
                          </p>
                        </div>
                      )}

                      {auction.phase === 'closed' && (
                        <InlineNotice
                          icon={<CheckCircle2 size={18} color={palette.success} />}
                          text="This auction is closed."
                        />
                      )}
                    </GlassCard>
                  </motion.div>
                );
              })()}
            </>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: palette.muted, fontSize: 12.5 }}>
      {icon}
      {label}
    </div>
    <div style={{ fontSize: 16, fontWeight: 650, color: palette.textPrimary }}>{value}</div>
  </div>
);

const InlineNotice: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 16px',
      borderRadius: 14,
      border: `1px solid ${palette.border}`,
      background: 'rgba(255,255,255,0.03)',
    }}
  >
    {icon}
    <span style={{ fontSize: 13.5, color: palette.textSecondary }}>{text}</span>
  </div>
);

const ActionButton: React.FC<{
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}> = ({ children, loading, disabled, variant = 'primary', onClick }) => (
  <motion.button
    type={onClick ? 'button' : 'submit'}
    onClick={onClick}
    disabled={disabled || loading}
    whileHover={!disabled && !loading ? { scale: 1.015, y: -2 } : undefined}
    whileTap={!disabled && !loading ? { scale: 0.985 } : undefined}
    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      border: variant === 'secondary' ? `1px solid ${palette.border}` : 'none',
      borderRadius: 999,
      padding: '15px 28px',
      fontSize: 15,
      fontWeight: 600,
      fontFamily: 'inherit',
      letterSpacing: '-0.01em',
      color: palette.textPrimary,
      background: variant === 'secondary' ? 'rgba(255,255,255,0.04)' : gradients.buttonPrimary,
      boxShadow: variant === 'primary' ? `0 0 24px 0px ${palette.glow}` : 'none',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled && !loading ? 0.55 : 1,
    }}
  >
    {loading && (
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'inline-flex' }}
      >
        <Loader2 size={17} />
      </motion.span>
    )}
    {children}
  </motion.button>
);

const StatusCard: React.FC<{ icon: React.ReactNode; title: string; message: string; action: React.ReactNode }> = ({
  icon,
  title,
  message,
  action,
}) => (
  <GlassCard hoverLift={false} style={{ padding: '48px 24px', textAlign: 'center' }}>
    <div style={{ marginBottom: 16 }}>{icon}</div>
    <div style={{ fontSize: 16, fontWeight: 600, color: palette.textPrimary, marginBottom: 8 }}>{title}</div>
    <p style={{ fontSize: 14, color: palette.textSecondary, marginBottom: 24 }}>{message}</p>
    {action}
  </GlassCard>
);

const DetailsSkeleton: React.FC = () => (
  <GlassCard hoverLift={false} style={{ padding: 32 }}>
    <div
      className="secretbid-auctions-skeleton"
      style={{ width: 84, height: 22, borderRadius: 999, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }}
    />
    <div
      className="secretbid-auctions-skeleton"
      style={{ width: '60%', height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.06)', marginBottom: 16 }}
    />
    <div
      className="secretbid-auctions-skeleton"
      style={{ width: '100%', height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.05)', marginBottom: 8 }}
    />
    <div
      className="secretbid-auctions-skeleton"
      style={{ width: '80%', height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.05)', marginBottom: 28 }}
    />
    <div
      className="secretbid-auctions-skeleton"
      style={{ width: '100%', height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.04)' }}
    />
  </GlassCard>
);
