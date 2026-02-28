
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Smartphone, Zap, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'inherit', color: '#1B2559' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Zap size={20} fill="#fff" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>TontinePay</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button
            onClick={() => router.push('/admin')}
            style={{ fontWeight: 600, color: '#A3AED0', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            Backoffice
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              backgroundColor: 'var(--primary)',
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0px 10px 20px rgba(5, 150, 105, 0.2)'
            }}
          >
            Lancer l'App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '4rem 2rem 8rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#F4F7FE',
          padding: '0.5rem 1rem',
          borderRadius: '30px',
          color: 'var(--primary)',
          fontWeight: 700,
          fontSize: '0.875rem',
          marginBottom: '2rem'
        }}>
          <Shield size={16} />
          La tontine digitale n°1 au Sénégal
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          letterSpacing: '-2px'
        }}>
          Gérez vos Tontines <br />
          <span style={{ color: 'var(--primary)' }}>en toute confiance.</span>
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: '#A3AED0',
          maxWidth: '700px',
          margin: '0 auto 3rem',
          lineHeight: 1.6
        }}>
          Simplifiez la collecte, automatisez les tirages et suivez vos cotisations en temps réel. La solution moderne pour l'épargne communautaire.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              backgroundColor: '#1B2559',
              color: '#fff',
              padding: '1.25rem 2.5rem',
              borderRadius: '16px',
              border: 'none',
              fontWeight: 700,
              fontSize: '1.125rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            Accéder à mon espace <ArrowRight size={20} />
          </button>
        </div>

        {/* Floating App Preview Mockup (Visual emphasis) */}
        <div style={{ marginTop: '5rem', position: 'relative' }}>
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0px 40px 80px rgba(0,0,0,0.1)',
            border: '8px solid #F4F7FE'
          }}>
            <img
              src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200"
              alt="Dashboard Preview"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{
        backgroundColor: '#F4F7FE',
        padding: '8rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Pourquoi choisir TontinePay ?</h2>
            <p style={{ color: '#A3AED0', fontSize: '1.125rem' }}>Une technologie conçue pour la transparence et la simplicité.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              {
                icon: Shield,
                title: 'Sécurité de Fer',
                desc: 'Toutes vos transactions sont sécurisées et tracées. Finis les oublis et les contestations.'
              },
              {
                icon: Zap,
                title: 'Tirages Instantanés',
                desc: 'Notre algorithme certifié assure des tirages au sort transparents et sans triche.'
              },
              {
                icon: Smartphone,
                title: 'Mobile First',
                desc: 'Gérez tout depuis votre smartphone avec une interface fluide et intuitive.'
              },
              {
                icon: Users,
                title: 'Multi-Rôles',
                desc: 'Admins, Trésoriers ou Membres : chacun a son espace dédié selon ses besoins.'
              }
            ].map((f, i) => (
              <div key={i} style={{
                backgroundColor: '#fff',
                padding: '2.5rem',
                borderRadius: '24px',
                boxShadow: '0px 20px 40px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#F4F7FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  marginBottom: '1.5rem'
                }}>
                  <f.icon size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>{f.title}</h3>
                <p style={{ color: '#A3AED0', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Prêt à moderniser votre épargne ?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginBottom: '3rem' }}>
            {['Aucun frais caché', 'Support 24/7 en Wolof & Français', 'Installation PWA instantanée'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.125rem', fontWeight: 600 }}>
                <CheckCircle2 size={24} color="var(--primary)" /> {t}
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              backgroundColor: 'var(--primary)',
              color: '#fff',
              padding: '1.25rem 3rem',
              borderRadius: '16px',
              border: 'none',
              fontWeight: 800,
              fontSize: '1.25rem',
              cursor: 'pointer',
              boxShadow: '0px 15px 30px rgba(5, 150, 105, 0.3)'
            }}
          >
            Rejoindre maintenant
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #F4F7FE', padding: '4rem 2rem' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Zap size={14} fill="#fff" />
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 800 }}>TontinePay</span>
          </div>
          <p style={{ color: '#A3AED0', fontSize: '0.875rem' }}>© 2024 TontinePay. Développé avec ❤️ pour le Sénégal.</p>
        </div>
      </footer>
    </div>
  );
}
