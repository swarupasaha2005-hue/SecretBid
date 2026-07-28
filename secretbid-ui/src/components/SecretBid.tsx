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

import React, { useCallback, useEffect, useState } from 'react';
import { type ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import {
  Backdrop,
  CircularProgress,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material';
import CopyIcon from '@mui/icons-material/ContentPasteOutlined';
import StopIcon from '@mui/icons-material/HighlightOffOutlined';
import { type AuctionDerivedState, type AuctionId, type DeployedSecretBidAPI } from '../../../api/src/index';
import { useDeployedSecretBidContext } from '../hooks';
import { type SecretBidDeployment } from '../contexts';
import { type Observable } from 'rxjs';
import { EmptyCardContent } from './SecretBid.EmptyCardContent';

/** The props required by the {@link SecretBid} component. */
export interface SecretBidProps {
  /** The observable secret bid deployment. */
  secretBidDeployment$?: Observable<SecretBidDeployment>;
}

/**
 * Provides the placeholder landing UI for a deployed SecretBid contract.
 *
 * @remarks
 * Architecture: React -> {@link DeployedSecretBidAPI} -> Midnight SDK -> `secretbid.compact`. One
 * deployed contract is an auction house that can host many auctions, so this component subscribes to
 * {@link DeployedSecretBidAPI.auctions$} (a map of every known auction, keyed by `AuctionId`) rather
 * than a single-auction observable. No auction-specific UI is implemented yet — this component only
 * uses `auctions$` to know when the deployment has finished connecting, and always renders the same
 * placeholder message.
 *
 * With no `secretBidDeployment$` observable, the component will render a UI that allows the user to
 * create or join a secret bid contract (exercising the wallet connection and contract deployment
 * pipeline). It requires a `<DeployedSecretBidProvider />` to be in scope in order to manage these
 * additional secret bids. It does this by invoking the `resolve(...)` method on the currently
 * in-scope `DeployedSecretBidContext`.
 *
 * When a `secretBidDeployment$` observable is received, the component begins by rendering a skeletal
 * view of itself, along with a loading background. It does this until the secret bid deployment
 * receives a `DeployedSecretBidAPI` instance, upon which it will then subscribe to its `auctions$`
 * observable and display a placeholder message.
 */
export const SecretBid: React.FC<Readonly<SecretBidProps>> = ({ secretBidDeployment$ }) => {
  const secretBidApiProvider = useDeployedSecretBidContext();
  const [secretBidDeployment, setSecretBidDeployment] = useState<SecretBidDeployment>();
  const [deployedSecretBidAPI, setDeployedSecretBidAPI] = useState<DeployedSecretBidAPI>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [auctions, setAuctions] = useState<ReadonlyMap<AuctionId, AuctionDerivedState>>();
  const [isWorking, setIsWorking] = useState(!!secretBidDeployment$);

  // Two simple callbacks that call `resolve(...)` to either deploy or join a secret bid
  // contract. Since the `DeployedSecretBidContext` will create a new secret bid and update the UI, we
  // don't have to do anything further once we've called `resolve`.
  const onCreateSecretBid = useCallback(() => secretBidApiProvider.resolve(), [secretBidApiProvider]);
  const onJoinSecretBid = useCallback(
    (contractAddress: ContractAddress) => secretBidApiProvider.resolve(contractAddress),
    [secretBidApiProvider],
  );

  const onCopyContractAddress = useCallback(async () => {
    if (deployedSecretBidAPI) {
      await navigator.clipboard.writeText(deployedSecretBidAPI.deployedContractAddress);
    }
  }, [deployedSecretBidAPI]);

  // Subscribes to the `secretBidDeployment$` observable so that we can receive updates on the deployment.
  useEffect(() => {
    if (!secretBidDeployment$) {
      return;
    }

    const subscription = secretBidDeployment$.subscribe(setSecretBidDeployment);

    return () => {
      subscription.unsubscribe();
    };
  }, [secretBidDeployment$]);

  // Subscribes to the `auctions$` observable on a `DeployedSecretBidAPI` if we receive one, allowing the
  // component to receive updates to the change in contract state; otherwise we update the UI to
  // reflect the error was received instead.
  useEffect(() => {
    if (!secretBidDeployment) {
      return;
    }
    if (secretBidDeployment.status === 'in-progress') {
      return;
    }

    setIsWorking(false);

    if (secretBidDeployment.status === 'failed') {
      setErrorMessage(
        secretBidDeployment.error.message.length
          ? secretBidDeployment.error.message
          : 'Encountered an unexpected error.',
      );
      return;
    }

    // We need the secret bid API as well as subscribing to its `auctions$` observable — a map of every
    // auction currently known to this contract — so that future auction-specific UI can render off of it.
    setDeployedSecretBidAPI(secretBidDeployment.api);
    const subscription = secretBidDeployment.api.auctions$.subscribe(setAuctions);
    return () => {
      subscription.unsubscribe();
    };
  }, [secretBidDeployment, setIsWorking, setErrorMessage, setDeployedSecretBidAPI]);

  return (
    <Card sx={{ position: 'relative', width: 275, height: 300, minWidth: 275, minHeight: 300 }} color="primary">
      {!secretBidDeployment$ && (
        <EmptyCardContent onCreateSecretBidCallback={onCreateSecretBid} onJoinSecretBidCallback={onJoinSecretBid} />
      )}

      {secretBidDeployment$ && (
        <React.Fragment>
          <Backdrop
            sx={{ position: 'absolute', color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isWorking}
          >
            <CircularProgress data-testid="secretbid-working-indicator" />
          </Backdrop>
          <Backdrop
            sx={{ position: 'absolute', color: '#ff0000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={!!errorMessage}
          >
            <StopIcon fontSize="large" />
            <Typography component="div" data-testid="secretbid-error-message">
              {errorMessage}
            </Typography>
          </Backdrop>
          <CardHeader
            titleTypographyProps={{ color: 'primary' }}
            title={toShortFormatContractAddress(deployedSecretBidAPI?.deployedContractAddress) ?? 'Loading...'}
            action={
              deployedSecretBidAPI?.deployedContractAddress ? (
                <IconButton title="Copy contract address" onClick={onCopyContractAddress}>
                  <CopyIcon fontSize="small" />
                </IconButton>
              ) : (
                <Skeleton variant="circular" width={20} height={20} />
              )
            }
          />
          <CardContent>
            {auctions ? (
              <Typography
                data-testid="secretbid-placeholder-message"
                sx={{ minHeight: 160 }}
                color="primary"
                align="center"
              >
                Auction functionality coming next.
              </Typography>
            ) : (
              <Skeleton variant="rectangular" width={245} height={160} />
            )}
          </CardContent>
          <CardActions />
        </React.Fragment>
      )}
    </Card>
  );
};

/** @internal */
const toShortFormatContractAddress = (contractAddress: ContractAddress | undefined): React.ReactElement | undefined =>
  // Returns a new string made up of the first, and last, 8 characters of a given contract address.
  contractAddress ? (
    <span data-testid="secretbid-address">
      0x{contractAddress?.replace(/^[A-Fa-f0-9]{6}([A-Fa-f0-9]{8}).*([A-Fa-f0-9]{8})$/g, '$1...$2')}
    </span>
  ) : undefined;
