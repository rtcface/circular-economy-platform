import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Circular Economy Platform</h1>
      <p>Matching hardware donations with volunteer technicians for educational use.</p>
    </main>
  );
}
