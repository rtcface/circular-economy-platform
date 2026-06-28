import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { GlassCard } from '../components/ui/GlassCard';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-fuji-white">
          Sobre la Plataforma de <span className="text-spring-green">Economía Circular</span>
        </h1>
        <p className="text-lg text-fuji-white/80 max-w-2xl mx-auto">
          Un puente entre el hardware en desuso y las instituciones educativas que necesitan tecnología.
        </p>
      </section>

      <section className="space-y-6">
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold text-spring-green mb-4">Nuestra Misión</h2>
          <p className="text-fuji-white/80 leading-relaxed">
            Cada año, miles de computadoras y dispositivos electrónicos terminan en basurales, generando e-waste (basura electrónica). Al mismo tiempo, muchas escuelas, bibliotecas y organizaciones sociales no tienen acceso a tecnología básica para enseñar. Nuestra plataforma busca cerrar esta brecha permitiendo que donantes entreguen su hardware antiguo a técnicos voluntarios, quienes lo reparan y lo preparan para ser donado.
          </p>
        </GlassCard>

        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold text-dragon-blue mb-4">¿Cómo funciona?</h2>
          <ul className="list-disc list-inside text-fuji-white/80 space-y-2">
            <li><strong>Donación:</strong> Un donante registra el equipo que ya no usa en la plataforma.</li>
            <li><strong>Match Geográfico:</strong> El sistema asigna automáticamente la donación al técnico voluntario más cercano usando algoritmos de geolocalización.</li>
            <li><strong>Reacondicionamiento:</strong> El técnico revisa, repara y certifica que el equipo funciona correctamente.</li>
            <li><strong>Entrega:</strong> El equipo listo se entrega a una institución educativa pre-registrada que lo necesita.</li>
          </ul>
        </GlassCard>

        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold text-spring-green mb-4">Tecnología Open Source</h2>
          <p className="text-fuji-white/80 leading-relaxed">
            Esta plataforma está construida con tecnologías modernas de código abierto: TanStack Start para el renderizado, Tailwind CSS con diseño Kanagawa para la interfaz, y PostgreSQL + PostGIS para todo el cálculo de rutas geográficas. Creemos en el software libre como herramienta de cambio social.
          </p>
        </GlassCard>
      </section>
    </div>
  );
}
