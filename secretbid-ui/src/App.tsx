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

import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { MainLayout, SecretBid } from './components';
import { useDeployedSecretBidContext } from './hooks';
import { type SecretBidDeployment } from './contexts';
import { type Observable } from 'rxjs';

/**
 * The root secret bid application component.
 *
 * @remarks
 * The {@link App} component requires a `<DeployedSecretBidProvider />` parent in order to retrieve
 * information about current secret bid deployments.
 *
 * @internal
 */
const App: React.FC = () => {
  const secretBidApiProvider = useDeployedSecretBidContext();
  const [secretBidDeployments, setSecretBidDeployments] = useState<Array<Observable<SecretBidDeployment>>>([]);

  useEffect(() => {
    const subscription = secretBidApiProvider.secretBidDeployments$.subscribe(setSecretBidDeployments);

    return () => {
      subscription.unsubscribe();
    };
  }, [secretBidApiProvider]);

  return (
    <Box sx={{ background: '#000', minHeight: '100vh' }}>
      <MainLayout>
        {secretBidDeployments.map((secretBidDeployment, idx) => (
          <div data-testid={`secretbid-${idx}`} key={`secretbid-${idx}`}>
            <SecretBid secretBidDeployment$={secretBidDeployment} />
          </div>
        ))}
        <div data-testid="secretbid-start">
          <SecretBid />
        </div>
      </MainLayout>
    </Box>
  );
};

export default App;
