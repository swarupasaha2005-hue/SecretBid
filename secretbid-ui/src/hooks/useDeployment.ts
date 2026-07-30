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

import { useCallback, useEffect, useState } from 'react';
import { type Observable } from 'rxjs';
import { type DeployedSecretBidAPI } from '../../../api/src/index';
import { type DeployedSecretBidAPIProvider, type SecretBidDeployment } from '../contexts';
import { useDeployedSecretBidContext } from './useDeployedSecretBidContext';
import { classifyError, type AppError } from '../lib/errors';

export type DeploymentState =
  | { readonly status: 'connecting' }
  | { readonly status: 'ready'; readonly api: DeployedSecretBidAPI }
  | { readonly status: 'error'; readonly error: AppError; readonly retry: () => void };

/**
 * Module-level singleton: every page that calls {@link useDeployment} shares the *same* connection
 * attempt instead of each page independently calling `resolve()` (which, with no `contractAddress`,
 * always deploys a brand-new contract — see `BrowserDeployedSecretBidManager.resolve`). This is a
 * UI-only change (no edits to the manager or the API) that makes navigating between
 * Dashboard/Create Auction/Auction Details reuse one connection for the whole session, exactly what
 * a production app needs.
 */
let sharedDeployment$: Observable<SecretBidDeployment> | undefined;

const getSharedDeployment$ = (
  provider: DeployedSecretBidAPIProvider,
  forceNewAttempt: boolean,
): Observable<SecretBidDeployment> => {
  if (forceNewAttempt || !sharedDeployment$) {
    sharedDeployment$ = provider.resolve();
  }
  return sharedDeployment$;
};

/**
 * The single, shared entry point for "connect to the SecretBid contract" across every page. Wraps
 * the existing, unmodified `DeployedSecretBidAPIProvider.resolve()` (deploy-or-join) with:
 *
 * - a stable `connecting` / `ready` / `error` shape every page can render consistently, and
 * - {@link classifyError} applied to any failure, so a Midnight-backend-unavailable condition is
 *   distinguishable from "wallet not connected" from "unknown error" without ever surfacing a raw
 *   stack trace.
 *
 * When the Midnight backend (proof server / indexer / wallet connector) is unavailable, `resolve()`
 * still runs for real and fails for real — this hook does not fabricate a deployment or bypass the
 * failure, it only classifies and presents it. Once the backend returns, calling `retry()` (or a
 * fresh page load) uses the exact same, unmodified code path to connect successfully.
 */
export const useDeployment = (): DeploymentState => {
  const provider = useDeployedSecretBidContext();
  const [state, setState] = useState<DeploymentState>({ status: 'connecting' });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    const observable = getSharedDeployment$(provider, attempt > 0);
    const subscription = observable.subscribe((deployment) => {
      if (deployment.status === 'in-progress') {
        setState({ status: 'connecting' });
      } else if (deployment.status === 'deployed') {
        setState({ status: 'ready', api: deployment.api });
      } else {
        setState({ status: 'error', error: classifyError(deployment.error), retry });
      }
    });

    return () => subscription.unsubscribe();
  }, [provider, attempt, retry]);

  return state;
};
