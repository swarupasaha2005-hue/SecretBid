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

import React, { createContext, useCallback, useContext, useRef, useState, type PropsWithChildren } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { palette } from '../theme/palette';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  readonly id: number;
  readonly variant: ToastVariant;
  readonly message: string;
}

export interface ToastContextValue {
  /** Shows a toast using the application's shared glass notification style. Auto-dismisses. */
  readonly showToast: (variant: ToastVariant, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/** Retrieves the currently in-scope toast API. Requires a `<ToastProvider />` ancestor. */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('A <ToastProvider /> is required.');
  }
  return context;
};

const VARIANT_META: Record<
  ToastVariant,
  { icon: React.ComponentType<{ size?: number; color?: string }>; color: string }
> = {
  success: { icon: CheckCircle2, color: palette.success },
  error: { icon: AlertTriangle, color: palette.error },
  warning: { icon: AlertCircle, color: '#FFA857' },
  info: { icon: Info, color: palette.softLavender },
};

const AUTO_DISMISS_MS = 5500;

/**
 * The single source of toast notifications for the app: consistent glass styling matching the
 * rest of SecretBid's design language (translucent surface, backdrop blur, hairline border, soft
 * glow), stacked bottom-right, auto-dismissing, with a manual close affordance.
 */
export const ToastProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (variant: ToastVariant, message: string) => {
      const id = ++nextId.current;
      setToasts((current) => [...current, { id, variant, message }]);
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 'calc(100vw - 32px)',
          width: 380,
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const { icon: Icon, color } = VARIANT_META[toast.variant];
            return (
              <motion.div
                key={toast.id}
                role="status"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.96 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '14px 16px',
                  borderRadius: 16,
                  background: 'linear-gradient(180deg, rgba(25,16,51,0.85) 0%, rgba(18,10,36,0.85) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${palette.border}`,
                  boxShadow: `0 12px 40px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02)`,
                }}
              >
                <Icon size={18} color={color} />
                <p style={{ margin: 0, flex: 1, fontSize: 13.5, lineHeight: 1.55, color: palette.textPrimary }}>
                  {toast.message}
                </p>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Dismiss notification"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 2,
                    cursor: 'pointer',
                    color: palette.muted,
                    display: 'flex',
                    flexShrink: 0,
                  }}
                >
                  <X size={15} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
