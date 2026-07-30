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
 * TanStack Query hooks wrapping the real, unmodified {@link DeployedSecretBidAPI}. None of this
 * fabricates data or bypasses the API: `useAuctions`/`useAuction` fetch via the API's own
 * `auctions$` observable (first emission satisfies the query; the same subscription then keeps the
 * query cache live for as long as the API instance exists), and every mutation hook is a direct,
 * 1:1 wrapper around one circuit call (`createAuction`, `commitBid`, `startReveal`, `revealBid`,
 * `closeAuction`). When the Midnight backend is unavailable, these calls fail for real and the
 * failure is classified via `lib/errors.ts` — nothing here mocks success or invents a transaction.
 *
 * @packageDocumentation
 */

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';
import { type AuctionDerivedState, type AuctionId, type DeployedSecretBidAPI } from '../../../api/src/index';

export const auctionsQueryKey = ['auctions'] as const;
export const auctionQueryKey = (auctionId: AuctionId | undefined) => ['auction', auctionId] as const;

/**
 * Fetches every auction known to the given deployment and keeps the result live. `api` should be
 * `undefined` whenever no deployment is connected yet (see `useDeployment`) — the query simply
 * stays disabled in that case rather than fabricating empty data.
 */
export const useAuctions = (api: DeployedSecretBidAPI | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!api) return;
    const subscription = api.auctions$.subscribe((auctions) => {
      queryClient.setQueryData(auctionsQueryKey, auctions);
    });
    return () => subscription.unsubscribe();
  }, [api, queryClient]);

  return useQuery({
    queryKey: auctionsQueryKey,
    queryFn: async () => {
      if (!api) throw new Error('Wallet not connected');
      return firstValueFrom(api.auctions$);
    },
    enabled: !!api,
  });
};

/** Fetches a single auction by id from the same live `auctions$` stream as {@link useAuctions}. */
export const useAuction = (auctionId: AuctionId | undefined, api: DeployedSecretBidAPI | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!api || !auctionId) return;
    const subscription = api.auctions$.subscribe((auctions) => {
      queryClient.setQueryData(auctionsQueryKey, auctions);
      queryClient.setQueryData(auctionQueryKey(auctionId), auctions.get(auctionId));
    });
    return () => subscription.unsubscribe();
  }, [api, auctionId, queryClient]);

  return useQuery({
    queryKey: auctionQueryKey(auctionId),
    queryFn: async (): Promise<AuctionDerivedState> => {
      if (!api || !auctionId) throw new Error('Wallet not connected');
      const auctions = await firstValueFrom(api.auctions$);
      const auction = auctions.get(auctionId);
      if (!auction) throw new Error('Auction does not exist');
      return auction;
    },
    enabled: !!api && !!auctionId,
  });
};

const requireApi = (api: DeployedSecretBidAPI | undefined): DeployedSecretBidAPI => {
  if (!api) throw new Error('Wallet not connected');
  return api;
};

/** Wraps `DeployedSecretBidAPI.createAuction`. Invalidates the auctions list on success. */
export const useCreateAuction = (api: DeployedSecretBidAPI | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { title: string; description: string; reservePrice?: bigint }) =>
      requireApi(api).createAuction(params),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: auctionsQueryKey });
    },
  });
};

/** Wraps `DeployedSecretBidAPI.commitBid`. Invalidates the affected auction on success. */
export const useCommitBid = (api: DeployedSecretBidAPI | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ auctionId, amount }: { auctionId: AuctionId; amount: bigint }) =>
      requireApi(api).commitBid(auctionId, amount),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: auctionsQueryKey });
      void queryClient.invalidateQueries({ queryKey: auctionQueryKey(variables.auctionId) });
    },
  });
};

/** Wraps `DeployedSecretBidAPI.startReveal`. Invalidates the affected auction on success. */
export const useStartReveal = (api: DeployedSecretBidAPI | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (auctionId: AuctionId) => requireApi(api).startReveal(auctionId),
    onSuccess: (_data, auctionId) => {
      void queryClient.invalidateQueries({ queryKey: auctionsQueryKey });
      void queryClient.invalidateQueries({ queryKey: auctionQueryKey(auctionId) });
    },
  });
};

/** Wraps `DeployedSecretBidAPI.revealBid`. Invalidates the affected auction on success. */
export const useRevealBid = (api: DeployedSecretBidAPI | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (auctionId: AuctionId) => requireApi(api).revealBid(auctionId),
    onSuccess: (_data, auctionId) => {
      void queryClient.invalidateQueries({ queryKey: auctionsQueryKey });
      void queryClient.invalidateQueries({ queryKey: auctionQueryKey(auctionId) });
    },
  });
};

/** Wraps `DeployedSecretBidAPI.closeAuction`. Invalidates the affected auction on success. */
export const useCloseAuction = (api: DeployedSecretBidAPI | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (auctionId: AuctionId) => requireApi(api).closeAuction(auctionId),
    onSuccess: (_data, auctionId) => {
      void queryClient.invalidateQueries({ queryKey: auctionsQueryKey });
      void queryClient.invalidateQueries({ queryKey: auctionQueryKey(auctionId) });
    },
  });
};
