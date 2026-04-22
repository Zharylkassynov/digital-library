import React from 'react';


const InfoPageLayout = ({ title, children }) => (
  <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16 px-4">
    <div className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-bold text-white mb-8 bg-gradient-to-r from-[#6366f1] to-[#22d3ee] bg-clip-text text-transparent">
        {title}
      </h1>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl text-slate-300 leading-relaxed space-y-6">
        {children}
      </div>
    </div>
  </div>
);

export default function AboutPage() {
  return (
    <InfoPageLayout title="About Digital Library">
      <p className="text-lg">
        Welcome to <span className="text-white font-medium">Digital Library</span> — your ultimate hub for curated knowledge and professional resources.
      </p>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Our Mission</h2>
        <p>
          We believe that access to high-quality educational materials should be seamless and organized. 
          Our library is built for developers, researchers, and book enthusiasts who value their time.
        </p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div className="rounded-xl bg-white/5 p-4 border border-white/5">
          <h3 className="text-[#22d3ee] font-medium mb-1">Curated Content</h3>
          <p className="text-sm">Only the best books and articles in tech and science.</p>
        </div>
        <div className="rounded-xl bg-white/5 p-4 border border-white/5">
          <h3 className="text-[#8b5cf6] font-medium mb-1">Modern Stack</h3>
          <p className="text-sm">Fast, responsive, and easy to use on any device.</p>
        </div>
      </div>
    </InfoPageLayout>
  );
}