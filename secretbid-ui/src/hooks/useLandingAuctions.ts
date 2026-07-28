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

import { useEffect, useState } from 'react';
import { combineLatest, of, switchMap, map } from 'rxjs';
import { type AuctionDerivedState, type AuctionId } from '../../../api/src/index';
import { useDeployedSecretBidContext } from './useDeployedSecretBidContext';

/**
 * The live-data status of {@link useLandingAuctions}.
 *
 * @remarks
 * - `no-deployment` — no secret bid contract has been connected to yet (no wallet session has
 *   resolved a deployment). There is no live data to show.
 * - `loading` — at least one deployment has been requested but none has finished resolving yet.
 * - `ready` — a deployed contract's `auctions$` observable has emitted at least once. `auctions`
 *   reflects the real, current on-ledger state (it may be empty if no auctions exist yet).
 */
export type LandingAuctionsState =
  | { readonly status: 'no-deployment' }
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly auctions: ReadonlyMap<AuctionId, AuctionDerivedState> };

/**
 * Subscribes to whichever {@link DeployedSecretBidAPI} deployment is currently active (if any) and
 * exposes its live `auctions$` state for read-only display on the landing page.
 *
 * @remarks
 * This does not deploy or join a contract itself — it only observes deployments already resolved
 * elsewhere in the app (e.g. via the `/app` dashboard). If no deployment has been resolved yet, it
 * reports `no-deployment` rather than fabricating data or silently prompting a wallet connection.
 */
export const useLandingAuctions = (): LandingAuctionsState => {
  const secretBidApiProvider = useDeployedSecretBidContext();
  const [state, setState] = useState<LandingAuctionsState>({ status: 'no-deployment' });

  useEffect(() => {
    const subscription = secretBidApiProvider.secretBidDeployments$
      .pipe(
        switchMap((deployments) => {
          if (deployments.length === 0) {
            return of<LandingAuctionsState>({ status: 'no-deployment' });
          }

          return combineLatest(deployments).pipe(
            switchMap((resolved) => {
              const deployed = resolved.find((deployment) => deployment.status === 'deployed');

              if (!deployed || deployed.status !== 'deployed') {
                return of<LandingAuctionsState>({ status: 'loading' });
              }

              return deployed.api.auctions$.pipe(
                map((auctions): LandingAuctionsState => ({ status: 'ready', auctions })),
              );
            }),
          );
        }),
      )
      .subscribe(setState);

    return () => {
      subscription.unsubscribe();
    };
  }, [secretBidApiProvider]);

  return state;
};
