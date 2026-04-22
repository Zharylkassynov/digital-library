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

export default function PrivacyPage() {
  return (
    <InfoPageLayout title="Privacy Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">1. Data Collection</h2>
        <p>We do not sell your personal data. We only collect minimal information required for account functionality and bookmarks.</p>
        
        <h2 className="text-xl font-semibold text-white">2. Cookies</h2>
        <p>We use local storage and essential cookies to keep you logged in and save your theme preferences.</p>
        
        <h2 className="text-xl font-semibold text-white">3. Security</h2>
        <p>All data is stored using industry-standard encryption. Your passwords are never stored in plain text.</p>
      </section>
    </InfoPageLayout>
  );
}