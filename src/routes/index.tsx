import { createFileRoute, Link } from '@tanstack/react-router';
import * as React from 'react';
import { NeonButton } from '../components/ui/NeonButton';
import { GlassCard } from '../components/ui/GlassCard';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-16 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-fuji-white">
          Reduce el E-Waste. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-spring-green to-dragon-blue">
            Potencia la Educación.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-fuji-white/80 max-w-2xl mx-auto">
          Conectamos equipos tecnológicos en desuso con técnicos voluntarios para reacondicionarlos y donarlos a instituciones educativas que los necesitan.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link to="/auth/register">
            <NeonButton variant="primary" className="w-full sm:w-auto text-lg px-8">
              Quiero Donar
            </NeonButton>
          </Link>
          <Link to="/auth/register">
            <NeonButton variant="secondary" className="w-full sm:w-auto text-lg px-8">
              Soy Técnico
            </NeonButton>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        <GlassCard className="p-8 space-y-4 text-center hover:scale-105 transition-transform duration-300">
          <div className="w-12 h-12 rounded-full bg-spring-green/20 text-spring-green flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          </div>
          <h3 className="text-2xl font-bold text-fuji-white">Economía Circular</h3>
          <p className="text-fuji-white/70">
            Damos una segunda vida útil a las computadoras, evitando que terminen como chatarra electrónica.
          </p>
        </GlassCard>

        <GlassCard className="p-8 space-y-4 text-center hover:scale-105 transition-transform duration-300">
          <div className="w-12 h-12 rounded-full bg-dragon-blue/20 text-dragon-blue flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <h3 className="text-2xl font-bold text-fuji-white">Ruteo Inteligente</h3>
          <p className="text-fuji-white/70">
            Asignamos las donaciones automáticamente al técnico verificado más cercano mediante geolocalización.
          </p>
        </GlassCard>

        <GlassCard className="p-8 space-y-4 text-center hover:scale-105 transition-transform duration-300">
          <div className="w-12 h-12 rounded-full bg-spring-green/20 text-spring-green flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <h3 className="text-2xl font-bold text-fuji-white">Impacto Educativo</h3>
          <p className="text-fuji-white/70">
            Los equipos reacondicionados son entregados directamente a escuelas y organizaciones que los necesitan.
          </p>
        </GlassCard>
      </section>
    </div>
  );
}
