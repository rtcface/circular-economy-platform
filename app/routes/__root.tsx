import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';
import * as React from 'react';
import { Layout } from '../components/layout/Layout';

import appCss from '../styles/global.css?url';

export const Route = createRootRoute({
  links: () => [
    { rel: 'stylesheet', href: appCss },
  ],
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Circular Economy Platform</title>
        <Meta />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
