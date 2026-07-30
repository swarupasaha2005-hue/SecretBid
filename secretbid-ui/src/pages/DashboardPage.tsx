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

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  FileCheck,
  Gavel,
  Lock,
  LayoutDashboard,
  RotateCcw,
  Search,
  Sparkles,
  User,
} from 'lucide-react';
import { AmbientBackground, Navbar, ProtocolActivity, Footer, GlassCard, GradientButton } from '../components/landing';
import { palette, gradients } from '../theme/palette';
import { useAuctions, useDeployment, usePageTitle, type LandingAuctionsState } from '../hooks';
import { classifyError, MIDNIGHT_UNAVAILABLE_MESSAGE } from '../lib/errors';
import { type AuctionDerivedState, type AuctionPhase } from '../../../api/src/index';
import './dashboard.css';

type PhaseFilter = 'all' | AuctionPhase;
type SortOption = 'newest' | 'oldest' | 'most-commits' | 'most-reveals';

const FILTERS: ReadonlyArray<{ value: PhaseFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'commit', label: 'Commit' },
  { value: 'reveal', label: 'Reveal' },
  { value: 'closed', label: 'Closed' },
];

const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most-commits', label: 'Most Commits' },
  { value: 'most-reveals', label: 'Most Reveals' },
];

/** Per-phase accent colours for the badges. Scoped to this page — not part of the shared palette. */
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
 * The Dashboard: the authenticated application hub, and the next screen of the SecretBid landing
 * experience. Shares the landing page's ambient background, glass surfaces, gradient buttons, and
 * animation language (via `AmbientBackground` / `GlassCard` / `GradientButton` / `theme/palette`),
 * but is an entirely separate page — the landing page itself is untouched. Formerly the "Auctions"
 * page; renamed to "Dashboard" (route `/dashboard`) while every underlying auction concept
 * (auctions, commits, reveals, phases) keeps its existing terminology.
 *
 * @remarks
 * All auction data comes from {@link useDeployment} + {@link useAuctions}, a TanStack Query hook
 * backed by the real `DeployedSecretBidAPI.auctions$` stream for whichever contract is currently
 * connected. Protocol activity, search, phase filtering, and sorting are all applied over that same
 * live data; nothing here is fabricated. Cards navigate to `/auction/:auctionId`.
 */
export const DashboardPage: React.FC = () => {
  usePageTitle('Dashboard');
  const navigate = useNavigate();
  const deployment = useDeployment();
  const api = deployment.status === 'ready' ? deployment.api : undefined;
  const auctionsQuery = useAuctions(api);

  // `ProtocolActivity` is shared with the landing page and expects `LandingAuctionsState`. Map the
  // deployment + query state onto it: a connection failure or a still-pending query both read as
  // "loading" there — this page's own error/empty states below carry the full detail and retry.
  const activityState: LandingAuctionsState =
    deployment.status === 'ready' && auctionsQuery.isSuccess
      ? { status: 'ready', auctions: auctionsQuery.data }
      : { status: 'loading' };

  const [query, setQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>('all');
  const [sort, setSort] = useState<SortOption>('newest');

  const allAuctions =
    deployment.status === 'ready' && auctionsQuery.isSuccess ? Array.from(auctionsQuery.data.values()) : [];

  const visibleAuctions = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    const filtered = allAuctions.filter((auction) => {
      if (phaseFilter !== 'all' && auction.phase !== phaseFilter) return false;
      if (!trimmedQuery) return true;
      return (
        auction.title.toLowerCase().includes(trimmedQuery) || auction.description.toLowerCase().includes(trimmedQuery)
      );
    });

    const sorted = [...filtered];
    switch (sort) {
      case 'oldest':
        sorted.reverse();
        break;
      case 'most-commits':
        sorted.sort((a, b) => b.commitCount - a.commitCount);
        break;
      case 'most-reveals':
        sorted.sort((a, b) => b.revealCount - a.revealCount);
        break;
      case 'newest':
      default:
        // `auctions$` yields auctions in ledger-insertion order; reversing puts newest first.
        sorted.reverse();
        break;
    }
    return sorted;
  }, [allAuctions, phaseFilter, query, sort]);

  const goToAuction = (auctionId: string) => navigate(`/auction/${auctionId}`);

  return (
    <div
      style={{ position: 'relative', minHeight: '100vh', color: '#FFFFFF', fontFamily: 'Inter, Helvetica, sans-serif' }}
    >
      <AmbientBackground />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />

        <main
          className="secretbid-auctions-page"
          style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 120px' }}
        >
          {/* Page header — same badge / gradient-heading / subtitle rhythm as the landing page. */}
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
              <LayoutDashboard size={13} />
              Dashboard
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
              Auction Dashboard
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.1rem)',
                lineHeight: 1.65,
                color: palette.textSecondary,
                maxWidth: 620,
                margin: '0 auto',
              }}
            >
              Monitor, browse and participate in private sealed-bid auctions powered by Midnight.
            </p>
          </motion.div>

          {/* Protocol activity — live stats derived from the same auction data as the grid below. */}
          <div style={{ marginBottom: 8 }}>
            <ProtocolActivity auctionsState={activityState} onConnect={() => navigate('/app')} />
          </div>

          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            style={{ marginBottom: 40 }}
          >
            <GlassCard hoverLift={false} style={{ padding: '16px 20px' }}>
              <div className="secretbid-auctions-toolbar">
                <div className="secretbid-auctions-search-wrap">
                  <span className="secretbid-auctions-search-icon" aria-hidden>
                    <Search size={16} color={palette.muted} />
                  </span>
                  <input
                    type="search"
                    className="secretbid-auctions-search"
                    placeholder="Search auctions..."
                    aria-label="Search auctions"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <div className="secretbid-auctions-chips" role="group" aria-label="Filter auctions by phase">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter.value}
                      type="button"
                      className="secretbid-auctions-chip"
                      data-active={phaseFilter === filter.value}
                      aria-pressed={phaseFilter === filter.value}
                      onClick={() => setPhaseFilter(filter.value)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <select
                  className="secretbid-auctions-sort"
                  aria-label="Sort auctions"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </GlassCard>
          </motion.div>

          {/* Main content */}
          {deployment.status === 'connecting' && <LoadingGrid />}
          {deployment.status === 'error' && (
            <ErrorState
              message={
                deployment.error.kind === 'midnight-unavailable'
                  ? MIDNIGHT_UNAVAILABLE_MESSAGE
                  : deployment.error.message
              }
              onRetry={deployment.retry}
            />
          )}
          {deployment.status === 'ready' && auctionsQuery.isPending && <LoadingGrid />}
          {deployment.status === 'ready' && auctionsQuery.isError && (
            <ErrorState message={classifyError(auctionsQuery.error).message} onRetry={() => auctionsQuery.refetch()} />
          )}
          {deployment.status === 'ready' && auctionsQuery.isSuccess && allAuctions.length === 0 && (
            <EmptyState onCreateAuction={() => navigate('/create-auction')} />
          )}
          {deployment.status === 'ready' &&
            auctionsQuery.isSuccess &&
            allAuctions.length > 0 &&
            visibleAuctions.length === 0 && <NoResultsState />}
          {deployment.status === 'ready' && auctionsQuery.isSuccess && visibleAuctions.length > 0 && (
            <div className="secretbid-auctions-grid">
              {visibleAuctions.map((auction, i) => (
                <AuctionCard key={auction.auctionId} auction={auction} delay={i * 0.05} onView={goToAuction} />
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

const LoadingGrid: React.FC = () => (
  <div className="secretbid-auctions-grid" aria-busy="true" aria-label="Loading auctions">
    {Array.from({ length: 6 }, (_, i) => (
      <GlassCard key={i} hoverLift={false} style={{ padding: 22, height: 260 }}>
        <div
          className="secretbid-auctions-skeleton"
          style={{ width: 84, height: 22, borderRadius: 999, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }}
        />
        <div
          className="secretbid-auctions-skeleton"
          style={{ width: '70%', height: 20, borderRadius: 6, background: 'rgba(255,255,255,0.06)', marginBottom: 12 }}
        />
        <div
          className="secretbid-auctions-skeleton"
          style={{ width: '100%', height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.05)', marginBottom: 8 }}
        />
        <div
          className="secretbid-auctions-skeleton"
          style={{ width: '85%', height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.05)', marginBottom: 28 }}
        />
        <div
          className="secretbid-auctions-skeleton"
          style={{
            width: '100%',
            height: 44,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            marginBottom: 20,
          }}
        />
        <div
          className="secretbid-auctions-skeleton"
          style={{ width: '100%', height: 40, borderRadius: 999, background: 'rgba(255,255,255,0.05)' }}
        />
      </GlassCard>
    ))}
  </div>
);

const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <GlassCard hoverLift={false} style={{ padding: '48px 24px', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
    <AlertTriangle size={28} color={palette.error} strokeWidth={1.5} style={{ marginBottom: 16 }} />
    <div style={{ fontSize: 16, fontWeight: 600, color: palette.textPrimary, marginBottom: 8 }}>
      Couldn&apos;t load auctions
    </div>
    <p style={{ fontSize: 14, color: palette.textSecondary, marginBottom: 24 }}>{message}</p>
    <GradientButton variant="secondary" onClick={onRetry}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <RotateCcw size={15} />
        Try Again
      </span>
    </GradientButton>
  </GlassCard>
);

const EmptyState: React.FC<{ onCreateAuction: () => void }> = ({ onCreateAuction }) => (
  <GlassCard hoverLift={false} style={{ padding: '64px 24px', textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
    <Gavel size={40} color={palette.muted} strokeWidth={1.25} style={{ marginBottom: 20 }} />
    <div style={{ fontSize: 20, fontWeight: 700, color: palette.textPrimary, marginBottom: 10 }}>No Auctions Yet</div>
    <p style={{ fontSize: 14.5, color: palette.textSecondary, marginBottom: 28 }}>
      Create the first private auction on SecretBid.
    </p>
    <GradientButton onClick={onCreateAuction}>Create Auction</GradientButton>
  </GlassCard>
);

const NoResultsState: React.FC = () => (
  <GlassCard hoverLift={false} style={{ padding: '48px 24px', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
    <Search size={26} color={palette.muted} strokeWidth={1.5} style={{ marginBottom: 14 }} />
    <div style={{ fontSize: 15.5, color: palette.textPrimary, marginBottom: 4 }}>No auctions match your filters</div>
    <p style={{ fontSize: 13.5, color: palette.muted, margin: 0 }}>Try a different search term or filter.</p>
  </GlassCard>
);

const PhaseBadge: React.FC<{ phase: AuctionPhase }> = ({ phase }) => {
  const { color, glow, icon: Icon } = PHASE_ACCENT[phase];
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 12px',
        borderRadius: 999,
        border: `1px solid ${palette.border}`,
        background: `linear-gradient(135deg, ${glow} 0%, rgba(255,255,255,0.02) 100%)`,
      }}
    >
      <Icon size={11} strokeWidth={2.25} />
      <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {phase}
      </span>
    </div>
  );
};

const AuctionCard: React.FC<{ auction: AuctionDerivedState; delay: number; onView: (auctionId: string) => void }> = ({
  auction,
  delay,
  onView,
}) => {
  const title = auction.title.trim().length > 0 ? auction.title : `Auction ${auction.auctionId.slice(0, 8)}…`;
  const description = auction.description.trim().length > 0 ? auction.description : 'No description provided.';

  return (
    <motion.button
      type="button"
      className="secretbid-auctions-card"
      onClick={() => onView(auction.auctionId)}
      aria-label={`View auction: ${title}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      <GlassCard hoverLift style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <PhaseBadge phase={auction.phase} />
        </div>

        <div>
          <h3
            style={{
              margin: '0 0 8px',
              fontSize: 17,
              fontWeight: 650,
              color: palette.textPrimary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 13.5,
              lineHeight: 1.6,
              color: palette.textSecondary,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '2.6em',
            }}
          >
            {description}
          </p>
        </div>

        <div style={{ height: 1, background: palette.border }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <StatRow
            label="Reserve Price"
            value={auction.reservePrice !== undefined ? auction.reservePrice.toLocaleString() : 'No Reserve'}
          />
          <div style={{ display: 'flex', gap: 20 }}>
            <span
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: palette.muted }}
            >
              <FileCheck size={13} color={palette.softLavender} />
              {auction.commitCount} commit{auction.commitCount === 1 ? '' : 's'}
            </span>
            <span
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: palette.muted }}
            >
              <EyeOff size={13} color={palette.softLavender} />
              {auction.revealCount} reveal{auction.revealCount === 1 ? '' : 's'}
            </span>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: palette.muted }}>
            <User size={13} color={palette.muted} />
            {shortenIdentity(auction.creator)}
          </span>
        </div>

        <div
          className="secretbid-auctions-view-btn"
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            borderRadius: 999,
            padding: '12px 20px',
            fontSize: 14,
            fontWeight: 600,
            color: palette.textPrimary,
            background: gradients.buttonPrimary,
            boxShadow: `0 0 20px 0px ${palette.glow}`,
          }}
        >
          <Sparkles size={14} />
          View Auction
        </div>
      </GlassCard>
    </motion.button>
  );
};

const StatRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
    <span style={{ fontSize: 12.5, color: palette.muted }}>{label}</span>
    <span style={{ fontSize: 13.5, fontWeight: 600, color: palette.textPrimary }}>{value}</span>
  </div>
);
