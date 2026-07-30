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
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { palette } from '../../theme/palette';
import { GradientButton } from './GradientButton';

const NAV_LINKS = ['Home', 'Dashboard', 'Create Auction', 'About'];

/** Maps each nav label to its route, for both default navigation and active-link highlighting. */
const LABEL_TO_PATH: Record<string, string> = {
  Home: '/',
  Dashboard: '/dashboard',
  'Create Auction': '/create-auction',
  About: '/about',
};

export interface NavbarProps {
  onConnectWallet?: () => void;
  onNavigate?: (label: string) => void;
  walletConnected?: boolean;
}

/**
 * A single nav link with a glowing underline indicator that animates in on
 * hover — the "premium object" feel the capsule is going for. `active`
 * keeps that same underline (and brighter text) visible without hovering,
 * for whichever page is currently open.
 */
const NavLink: React.FC<{ label: string; active?: boolean; onClick?: () => void }> = ({
  label,
  active = false,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  const highlighted = hovered || active;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-current={active ? 'page' : undefined}
      style={{
        position: 'relative',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 14.5,
        fontWeight: 500,
        padding: '4px 0',
        color: highlighted ? '#FFFFFF' : '#CFC8E9',
        transition: 'color 0.25s ease',
      }}
    >
      {label}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ opacity: highlighted ? 1 : 0, scaleX: highlighted ? 1 : 0.4 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -6,
          height: 2,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${palette.secondaryPurple}, ${palette.softLavender})`,
          boxShadow: `0 0 8px 1px ${palette.glow}`,
          transformOrigin: 'center',
        }}
      />
    </button>
  );
};

/**
 * The floating glass navigation capsule: fit-content width, perfectly
 * centered at the top of the viewport, never touching the edges. Modeled
 * after the premium floating-nav pattern seen in Linear / Arc / Vercel —
 * a self-contained object placed on top of the page rather than a
 * conventional full-width bar. Collapses to a glass hamburger menu on
 * mobile while keeping the same capsule shell.
 */
export const Navbar: React.FC<NavbarProps> = ({ onConnectWallet, onNavigate, walletConnected = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (label: string) => {
    setMenuOpen(false);
    if (onNavigate) {
      onNavigate(label);
      return;
    }
    const path = LABEL_TO_PATH[label];
    if (path) void navigate(path);
  };

  const handleConnectWallet = onConnectWallet ?? (() => void navigate('/app'));

  return (
    <>
      <div
        style={{
          position: 'relative',
          margin: '24px auto 0',
          zIndex: 50,
          width: 'fit-content',
          maxWidth: 'calc(100% - 32px)',
        }}
      >
        <motion.nav
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="secretbid-navbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontWeight: 700,
              fontSize: 18,
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
            }}
          >
            <motion.span
              aria-hidden
              animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.15, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${palette.softLavender} 0%, ${palette.primaryPurple} 100%)`,
                boxShadow: `0 0 12px 2px ${palette.glow}`,
                display: 'inline-block',
              }}
            />
            SecretBid
          </div>

          <div
            className="secretbid-nav-links"
            style={{ display: 'flex', alignItems: 'center', gap: 48, marginLeft: 48 }}
          >
            {NAV_LINKS.map((label) => (
              <NavLink
                key={label}
                label={label}
                active={location.pathname === LABEL_TO_PATH[label]}
                onClick={() => handleNavigate(label)}
              />
            ))}
          </div>

          <div
            className="secretbid-nav-right"
            style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 48 }}
          >
            {walletConnected && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  color: palette.success,
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: palette.success,
                    boxShadow: `0 0 8px 1px ${palette.success}`,
                  }}
                />
                Connected
              </span>
            )}
            <GradientButton variant="primary" onClick={handleConnectWallet}>
              {walletConnected ? 'Wallet' : 'Connect Wallet'}
            </GradientButton>
          </div>

          <button
            className="secretbid-nav-hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginLeft: 20,
              padding: 4,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <motion.span
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
                style={{ width: 20, height: 2, borderRadius: 2, background: '#FFFFFF', transformOrigin: 'center' }}
              />
              <motion.span
                animate={{ opacity: menuOpen ? 0 : 1 }}
                style={{ width: 20, height: 2, borderRadius: 2, background: '#FFFFFF' }}
              />
              <motion.span
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
                style={{ width: 20, height: 2, borderRadius: 2, background: '#FFFFFF', transformOrigin: 'center' }}
              />
            </div>
          </button>
        </motion.nav>

        <AnimatePresence>
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: 12,
                zIndex: 49,
                width: 'calc(100vw - 32px)',
                maxWidth: 320,
              }}
            >
              <motion.div
                className="secretbid-nav-mobile-menu"
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{
                  display: 'none',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 20,
                  padding: '16px 8px',
                  width: '100%',
                }}
              >
                {NAV_LINKS.map((label) => (
                  <button
                    key={label}
                    onClick={() => handleNavigate(label)}
                    aria-current={location.pathname === LABEL_TO_PATH[label] ? 'page' : undefined}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: 16,
                      fontWeight: 500,
                      color: location.pathname === LABEL_TO_PATH[label] ? '#FFFFFF' : '#CFC8E9',
                    }}
                  >
                    {label}
                  </button>
                ))}
                <GradientButton variant="primary" onClick={handleConnectWallet}>
                  {walletConnected ? 'Wallet' : 'Connect Wallet'}
                </GradientButton>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
