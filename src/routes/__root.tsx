import { createRootRoute, Outlet, ScrollRestoration, HeadContent, Scripts } from '@tanstack/react-router';
import * as React from 'react';
import { Layout } from '../components/layout/Layout';
import '../styles/global.css';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Comunidad Hardware Educativo</title>
        <HeadContent />
      </head>
      <body className="bg-sumiInk-900 text-fujiWhite-100 min-h-screen font-sans selection:bg-springGreen-500/30">
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
