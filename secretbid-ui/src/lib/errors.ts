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
 * Maps raw errors thrown by the wallet connector, providers, or the SecretBid API into a small,
 * closed set of friendly, user-facing messages. Nothing here changes what actually failed — it only
 * classifies the existing `Error` (from `BrowserDeployedSecretBidManager`, `DeployedSecretBidAPI`,
 * or the underlying Midnight SDK/network layer) so the UI never shows a raw stack trace or
 * technical exception message.
 *
 * @packageDocumentation
 */

export type AppErrorKind =
  | 'wallet-not-connected'
  | 'auction-not-found'
  | 'commit-exists'
  | 'already-revealed'
  | 'auction-closed'
  | 'midnight-unavailable'
  | 'unknown';

export interface AppError {
  readonly kind: AppErrorKind;
  readonly message: string;
  /** The original error, kept for logging — never rendered directly to the user. */
  readonly cause: unknown;
}

/** The exact copy required for a Midnight-backend-unavailable condition. */
export const MIDNIGHT_UNAVAILABLE_MESSAGE =
  'Midnight services are temporarily unavailable. Your application is ready and will reconnect automatically once the network is available.';

const RULES: ReadonlyArray<{ test: RegExp; kind: AppErrorKind; message: string }> = [
  // Wallet-specific failures come first and are deliberately distinct from a backend-unavailable
  // condition — "install/unlock/authorize the wallet" is a different fix than "wait for the
  // network", even though both originate from `connectToWallet`/`BrowserDeployedSecretBidManager`.
  {
    test: /could not find midnight lace|application is not authorized|wallet.*(extension|not (found|detected|installed))|has failed to respond/i,
    kind: 'wallet-not-connected',
    message: 'Wallet not connected. Install or unlock the Midnight Lace wallet extension and try again.',
  },
  // Network/proof-server/indexer failures — the case this task cares about most: the Midnight
  // backend (proof server, indexer, or node) is unreachable, independent of the wallet.
  {
    test: /failed to fetch|network ?error|econnrefused|enotfound|etimedout|timed? ?out|fetch failed|proof server|indexer|websocket/i,
    kind: 'midnight-unavailable',
    message: MIDNIGHT_UNAVAILABLE_MESSAGE,
  },
  {
    test: /auction (does not exist|not found)|no such auction|unknown auction/i,
    kind: 'auction-not-found',
    message: 'This auction could not be found. It may have been removed, or the link is incorrect.',
  },
  {
    test: /commit(ment)? already exists|already committed/i,
    kind: 'commit-exists',
    message: 'You have already committed a bid to this auction.',
  },
  {
    test: /already revealed|reveal already (submitted|exists)/i,
    kind: 'already-revealed',
    message: 'You have already revealed your bid for this auction.',
  },
  {
    test: /auction (is )?closed|not in (the )?(commit|reveal) phase|wrong phase|invalid phase/i,
    kind: 'auction-closed',
    message: 'This auction is closed and no longer accepting that action.',
  },
];

const rawMessageOf = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return '';
};

/** Classifies any thrown value into a small, friendly {@link AppError}. Never throws. */
export const classifyError = (error: unknown): AppError => {
  const raw = rawMessageOf(error);

  for (const rule of RULES) {
    if (rule.test.test(raw)) {
      return { kind: rule.kind, message: rule.message, cause: error };
    }
  }

  return { kind: 'unknown', message: 'Something went wrong. Please try again.', cause: error };
};
