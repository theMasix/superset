/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { render } from '@testing-library/react';
import { Theme } from './Theme';

beforeEach(() => {
  document.documentElement.removeAttribute('dir');
  document.documentElement.removeAttribute('data-direction');
});

test('SupersetThemeProvider sets document direction on mount', () => {
  const theme = Theme.fromConfig();
  theme.setDirection('rtl');

  const { SupersetThemeProvider } = theme;
  render(
    <SupersetThemeProvider>
      <div>child</div>
    </SupersetThemeProvider>,
  );

  expect(document.documentElement.getAttribute('dir')).toBe('rtl');
  expect(document.documentElement.getAttribute('data-direction')).toBe('rtl');
});

test('Theme prioritizes Estedad font in RTL mode and restores in LTR mode', () => {
  const theme = Theme.fromConfig({
    token: {
      fontFamily: 'Inter, Estedad, Helvetica, Arial, sans-serif',
    },
  });

  expect(theme.theme.fontFamily).toBe(
    'Inter, Estedad, Helvetica, Arial, sans-serif',
  );

  theme.setDirection('rtl');
  expect(theme.theme.fontFamily).toBe(
    'Estedad, Inter, Helvetica, Arial, sans-serif',
  );

  theme.setDirection('ltr');
  expect(theme.theme.fontFamily).toBe(
    'Inter, Estedad, Helvetica, Arial, sans-serif',
  );
});

test('Theme initializes with Estedad font when created with direction rtl', () => {
  const theme = Theme.fromConfig({
    direction: 'rtl',
    token: {
      fontFamily: 'Inter, Estedad, Helvetica, Arial, sans-serif',
    },
  });

  expect(theme.theme.direction).toBe('rtl');
  expect(theme.theme.fontFamily).toBe(
    'Estedad, Inter, Helvetica, Arial, sans-serif',
  );
});

test('Theme injects Estedad font in RTL mode when font contains Inter', () => {
  const theme = Theme.fromConfig({
    token: {
      fontFamily: "'Inter', Helvetica, Arial",
    },
  });

  theme.setDirection('rtl');
  expect(theme.theme.fontFamily).toBe(
    "'Estedad', 'Inter', Helvetica, Arial",
  );
});

test('Theme preserves unrelated custom font when switching direction', () => {
  const theme = Theme.fromConfig({
    token: {
      fontFamily: 'CustomFont, sans-serif',
    },
  });

  theme.setDirection('rtl');
  expect(theme.theme.fontFamily).toBe('CustomFont, sans-serif');
});
