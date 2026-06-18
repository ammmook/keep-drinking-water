import { Droplet } from 'lucide-react';

export default function MobileNavbar() {
  return (
    <>
      <div className="mobile-navbar" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid #E2E8F0',
        zIndex: 100,
        display: 'none', // Hidden on desktop, shown on mobile via media query
        alignItems: 'center',
        padding: '0 20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
      }}>
        <Droplet size={24} color="#0EA5E9" strokeWidth={2.5} style={{ marginRight: '8px' }} />
        <div style={{
          fontSize: '18px',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #0F172A, #3B82F6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>AquaFlow</div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-navbar {
            display: flex !important;
          }
          /* Add padding to body or main content to prevent top navbar overlapping */
          body {
            padding-top: 60px;
          }
        }
      `}</style>
    </>
  );
}
