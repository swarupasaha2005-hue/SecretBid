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
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gavel, Loader2, Lock, Shield, Sparkles } from 'lucide-react';
import { AmbientBackground, Navbar, Footer, GlassCard } from '../components/landing';
import { palette, gradients } from '../theme/palette';
import { useCreateAuction, useDeployment, usePageTitle } from '../hooks';
import { useToast } from '../contexts';
import { classifyError } from '../lib/errors';
import './create-auction.css';

/**
 * The "Create Auction" page: a premium, cinematic continuation of the
 * SecretBid landing page. Replaces the previous default Midnight demo
 * screen (the black background + coin + white MUI card) entirely.
 *
 * @remarks
 * All business logic here is a thin wrapper around the existing, unmodified `DeployedSecretBidAPI`:
 * {@link useDeployment} connects (deploy-or-join) exactly as before, and submitting the form calls
 * {@link useCreateAuction} — a TanStack Query mutation wrapping `createAuction(...)` with no changes
 * to its signature or validation. On a real failure (including the Midnight backend being
 * unavailable) the form fields are preserved untouched and a toast explains what happened, so the
 * user can simply retry once the network is back — nothing here fabricates a successful submission.
 */
export const CreateAuctionPage: React.FC = () => {
  usePageTitle('Create Auction');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const deployment = useDeployment();
  const api = deployment.status === 'ready' ? deployment.api : undefined;
  const createAuction = useCreateAuction(api);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reservePrice, setReservePrice] = useState('');

  const isConnecting = deployment.status === 'connecting';
  const isFailed = deployment.status === 'error';
  const submitting = createAuction.isPending;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!api || submitting || !title.trim()) return;

    const trimmedReserve = reservePrice.trim();

    createAuction.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        reservePrice: trimmedReserve ? BigInt(trimmedReserve) : undefined,
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setReservePrice('');
          showToast('success', 'Auction created successfully.');
          void navigate('/dashboard');
        },
        onError: (error) => {
          // Form state is intentionally left untouched here so the user can just retry.
          const classified = classifyError(error);
          showToast(classified.kind === 'midnight-unavailable' ? 'warning' : 'error', classified.message);
        },
      },
    );
  };

  return (
    <div
      style={{ position: 'relative', minHeight: '100vh', color: '#FFFFFF', fontFamily: 'Inter, Helvetica, sans-serif' }}
    >
      <AmbientBackground />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar onConnectWallet={() => navigate('/app')} onNavigate={() => navigate('/')} />

        <main
          className="secretbid-create-page"
          style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 120px' }}
        >
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: 64 }}
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
              <Sparkles size={13} />
              Create Auction
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
              Create a Private Auction
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.1rem)',
                lineHeight: 1.65,
                color: palette.textSecondary,
                maxWidth: 560,
                margin: '0 auto',
              }}
            >
              Launch a sealed-bid auction on Midnight where bids remain confidential until the reveal phase.
            </p>
          </motion.div>

          {/* Main form card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            style={{ maxWidth: 700, margin: '0 auto 56px' }}
          >
            <GlassCard hoverLift={false} style={{ padding: 'clamp(28px, 4vw, 48px)' }}>
              {isConnecting && (
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '32px 0' }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 size={28} color={palette.softLavender} />
                  </motion.div>
                  <p style={{ color: palette.textSecondary, fontSize: 14.5, margin: 0, textAlign: 'center' }}>
                    Connecting to the Midnight network and preparing your auction contract…
                  </p>
                </div>
              )}

              {isFailed && deployment.status === 'error' && (
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '32px 0' }}
                >
                  <p style={{ color: palette.error, fontSize: 14.5, margin: 0, textAlign: 'center' }}>
                    {deployment.error.message}
                  </p>
                  <SubmitButton type="button" onClick={deployment.retry}>
                    Try Again
                  </SubmitButton>
                </div>
              )}

              {api && (
                <form onSubmit={handleSubmit}>
                  <FormField
                    id="secretbid-auction-title"
                    label="Auction Title"
                    helperText="The public name of your auction."
                    required
                  >
                    <input
                      id="secretbid-auction-title"
                      className="secretbid-create-input"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Rare Digital Artifact #042"
                      disabled={submitting}
                      maxLength={120}
                      required
                    />
                  </FormField>

                  <FormField
                    id="secretbid-auction-description"
                    label="Description"
                    helperText="Explain what bidders are bidding for."
                  >
                    <textarea
                      id="secretbid-auction-description"
                      className="secretbid-create-input secretbid-create-textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the item, terms, or context for this auction…"
                      disabled={submitting}
                      rows={4}
                    />
                  </FormField>

                  <FormField
                    id="secretbid-auction-reserve-price"
                    label="Reserve Price (optional)"
                    helperText="Minimum acceptable bid. Leave empty if no reserve price is required."
                  >
                    <input
                      id="secretbid-auction-reserve-price"
                      className="secretbid-create-input"
                      value={reservePrice}
                      onChange={(e) => setReservePrice(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 500"
                      disabled={submitting}
                      inputMode="numeric"
                    />
                  </FormField>

                  <SubmitButton type="submit" disabled={submitting || !title.trim()} loading={submitting}>
                    {submitting ? 'Creating Auction…' : 'Create Auction'}
                  </SubmitButton>
                </form>
              )}
            </GlassCard>
          </motion.div>

          {/* Information cards */}
          <div className="secretbid-create-info-grid">
            <InfoCard icon={<Gavel size={20} color={palette.softLavender} />} title="How it Works" delay={0.15}>
              <ol style={{ margin: 0, paddingLeft: 18, color: palette.textSecondary, fontSize: 14, lineHeight: 1.8 }}>
                <li>Users commit hidden bids.</li>
                <li>Bids remain private.</li>
                <li>Reveal phase verifies commitments.</li>
              </ol>
            </InfoCard>

            <InfoCard icon={<Lock size={20} color={palette.softLavender} />} title="Privacy" delay={0.2}>
              <p style={{ margin: 0, color: palette.textSecondary, fontSize: 14, lineHeight: 1.8 }}>
                Your bid remains hidden until you reveal it.
              </p>
            </InfoCard>

            <InfoCard icon={<Shield size={20} color={palette.softLavender} />} title="Security" delay={0.25}>
              <p style={{ margin: 0, color: palette.textSecondary, fontSize: 14, lineHeight: 1.8 }}>
                Powered by Midnight&apos;s privacy-preserving smart contracts.
              </p>
            </InfoCard>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

/** A single labelled form field with helper text, matching the premium glass form style. */
const FormField: React.FC<{
  id: string;
  label: string;
  helperText: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ id, label, helperText, required, children }) => (
  <div style={{ marginBottom: 26 }}>
    <label
      htmlFor={id}
      style={{
        display: 'block',
        fontSize: 14,
        fontWeight: 600,
        color: palette.textPrimary,
        marginBottom: 10,
      }}
    >
      {label}
      {required && <span style={{ color: palette.secondaryPurple }}> *</span>}
    </label>
    {children}
    <p style={{ margin: '8px 0 0', fontSize: 12.5, color: palette.muted }}>{helperText}</p>
  </div>
);

/** The large, full-width gradient submit button with a loading spinner state. */
const SubmitButton: React.FC<{
  type: 'submit' | 'button';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}> = ({ type, onClick, disabled, loading, children }) => (
  <motion.button
    type={type}
    onClick={onClick}
    disabled={disabled}
    whileHover={!disabled ? { scale: 1.015, y: -2, boxShadow: `0 12px 48px -4px ${palette.glow}` } : undefined}
    whileTap={!disabled ? { scale: 0.985 } : undefined}
    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      border: 'none',
      borderRadius: 999,
      padding: '16px 28px',
      fontSize: 16,
      fontWeight: 600,
      fontFamily: 'inherit',
      letterSpacing: '-0.01em',
      color: palette.textPrimary,
      background: gradients.buttonPrimary,
      boxShadow: `0 0 28px 0px ${palette.glow}`,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled && !loading ? 0.55 : 1,
    }}
  >
    {loading && (
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'inline-flex' }}
      >
        <Loader2 size={18} />
      </motion.span>
    )}
    {children}
  </motion.button>
);

/** A small glass information card used in the three-up grid below the form. */
const InfoCard: React.FC<{ icon: React.ReactNode; title: string; delay: number; children: React.ReactNode }> = ({
  icon,
  title,
  delay,
  children,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut', delay }}
  >
    <GlassCard style={{ padding: 24, height: '100%' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: 12,
          background: 'rgba(138,79,255,0.12)',
          border: `1px solid ${palette.border}`,
          marginBottom: 16,
        }}
      >
        {icon}
      </div>
      <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 600, color: palette.textPrimary }}>{title}</h3>
      {children}
    </GlassCard>
  </motion.div>
);
