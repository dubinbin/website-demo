/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ParticleCanvas from './components/ParticleCanvas';

export default function App() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#f8fbff] font-sans text-slate-900">
      {/* Background Particle Animation */}
      <ParticleCanvas />

      {/* Decorative Corners */}
      <div className="pointer-events-none absolute left-6 top-6 z-10 h-12 w-12 border-l border-t border-blue-500/35"></div>
      <div className="pointer-events-none absolute right-6 top-6 z-10 h-12 w-12 border-r border-t border-sky-500/35"></div>
      <div className="pointer-events-none absolute bottom-6 left-6 z-10 h-12 w-12 border-b border-l border-sky-500/35"></div>
      <div className="pointer-events-none absolute bottom-6 right-6 z-10 h-12 w-12 border-b border-r border-blue-500/35"></div>

      {/* Hero Content Overlay */}
      <div className="pointer-events-none relative z-10 flex min-h-screen w-full items-center px-7 py-16 sm:px-12 lg:px-20">
        <div className="max-w-[620px] text-left">
          <div className="mb-5 inline-flex border border-blue-300/70 bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-blue-700">
            Real-time identity signal
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.94] tracking-normal text-slate-950 sm:text-6xl md:text-7xl">
            Know who is really on the other side.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-slate-700 sm:text-lg">
            Deepfakes and voice clones now appear inside video calls, private messages, and every screen you trust. Detect them live, before the imitation can pass as a person.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.22em] text-slate-600">
            <span className="border border-blue-200/80 bg-white/50 px-3 py-2">Face trace</span>
            <span className="border border-blue-200/80 bg-white/50 px-3 py-2">Voice clone scan</span>
            <span className="border border-blue-300/80 bg-blue-50/70 px-3 py-2 text-blue-700">Live verification</span>
          </div>
        </div>
      </div>
    </main>
  );
}
