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

import { useEffect } from 'react';

const BASE_TITLE = 'SecretBid';

/**
 * Sets the browser tab title for the page it's called from, formatted as `"<title> | SecretBid"`
 * (or just `"SecretBid"` for the landing page). Restores the previous title on unmount so
 * navigating away — including back to a page that doesn't call this hook — doesn't leave a stale
 * title behind.
 */
export const usePageTitle = (title?: string): void => {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
    return () => {
      document.title = previous;
    };
  }, [title]);
};
