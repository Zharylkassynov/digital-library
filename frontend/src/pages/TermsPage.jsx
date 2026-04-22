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

export default function TermsPage() {
  return (
    <InfoPageLayout title="Terms of Service">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">1. Use of Service</h2>
        <p>By accessing Digital Library, you agree to use the platform for personal, non-commercial educational purposes only.</p>
        
        <h2 className="text-xl font-semibold text-white">2. Intellectual Property</h2>
        <p>The content provided in this library belongs to its respective authors. We do not claim ownership of the resources indexed here.</p>
        
        <h2 className="text-xl font-semibold text-white">3. Prohibited Conduct</h2>
        <p>Users are prohibited from attempting to breach the security of the platform or scraping data for commercial use.</p>
      </section>
    </InfoPageLayout>
  );
}