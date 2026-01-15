// src/pages/auth/Login.tsx - Neo-Brutalism Version
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, isLoaded } = useSignIn();
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        identifier: phone,
        password,
      });

      if (result.status === 'complete') {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-brutal" style={{
      minHeight: '100vh',
      background: '#FFD600',
      display: 'flex'
    }}>
      {/* Split Layout Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
        minHeight: '100vh'
      }}>
        
        {/* LEFT SIDE - Bold Branding */}
        <div style={{
          background: '#FF6B00',
          borderRight: '4px solid #0A0A0A',
          padding: '64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(0,0,0,0.1) 35px,
            rgba(0,0,0,0.1) 70px
          )`
        }}>
          {/* Logo & Tagline */}
          <div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(48px, 8vw, 96px)',
              fontWeight: 700,
              lineHeight: 0.9,
              textTransform: 'uppercase',
              color: '#FFFFFF',
              textShadow: '6px 6px 0px #0A0A0A',
              marginBottom: '24px'
            }}>
              DUKA<br/>MAWE
            </h1>
            
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '24px',
              fontWeight: 700,
              color: '#0A0A0A',
              lineHeight: 1.3,
              background: '#FFD600',
              padding: '16px',
              border: '3px solid #0A0A0A',
              display: 'inline-block',
              boxShadow: '6px 6px 0px #0A0A0A'
            }}>
              VERIFIED MATERIALS<br/>
              GUARANTEED DELIVERY
            </div>
          </div>

          {/* Floating Stats Cards */}
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{
              background: '#FFFFFF',
              border: '3px solid #0A0A0A',
              padding: '24px',
              boxShadow: '6px 6px 0px #0A0A0A',
              flex: 1
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '48px',
                fontWeight: 700,
                color: '#0A0A0A',
                lineHeight: 1
              }}>
                2.4K
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#666666',
                marginTop: '8px'
              }}>
                ORDERS
              </div>
            </div>

            <div style={{
              background: '#FFFFFF',
              border: '3px solid #0A0A0A',
              padding: '24px',
              boxShadow: '6px 6px 0px #0A0A0A',
              flex: 1
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '48px',
                fontWeight: 700,
                color: '#0A0A0A',
                lineHeight: 1
              }}>
                150
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#666666',
                marginTop: '8px'
              }}>
                SUPPLIERS
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Login Form */}
        <div style={{
          background: '#FFFFFF',
          padding: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ width: '100%', maxWidth: '500px' }}>
            <h2 className="h2-brutal" style={{ marginBottom: '48px' }}>
              LOGIN
            </h2>

            {error && (
              <div className="alert-brutal alert-error" style={{
                marginBottom: '24px'
              }}>
                <strong>⚠ Error:</strong> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Phone Number Input */}
              <div className="form-group-brutal">
                <label className="label-brutal">
                  PHONE NUMBER *
                </label>
                <input
                  type="tel"
                  className="input-brutal"
                  placeholder="0712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div className="form-group-brutal">
                <label className="label-brutal">
                  PASSWORD *
                </label>
                <input
                  type="password"
                  className="input-brutal"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-brutal btn-brutal-primary btn-brutal-full"
                disabled={isLoading}
                style={{ marginTop: '16px' }}
              >
                {isLoading ? (
                  <>
                    <div className="loading-brutal" style={{
                      width: '20px',
                      height: '20px',
                      borderWidth: '2px'
                    }} />
                    SIGNING IN...
                  </>
                ) : (
                  'SIGN IN →'
                )}
              </button>

              {/* Footer Links */}
              <div style={{
                marginTop: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px'
              }}>
                <a 
                  href="/forgot-password" 
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#0A0A0A',
                    textDecoration: 'none',
                    borderBottom: '2px solid #0A0A0A',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FF6B00';
                    e.currentTarget.style.borderBottomColor = '#FF6B00';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#0A0A0A';
                    e.currentTarget.style.borderBottomColor = '#0A0A0A';
                  }}
                >
                  FORGOT PASSWORD?
                </a>
                
                <span style={{
                  color: '#CCCCCC',
                  fontWeight: 700
                }}>
                  |
                </span>
                
                <a 
                  href="/register" 
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#0A0A0A',
                    textDecoration: 'none',
                    borderBottom: '2px solid #0A0A0A',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FF6B00';
                    e.currentTarget.style.borderBottomColor = '#FF6B00';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#0A0A0A';
                    e.currentTarget.style.borderBottomColor = '#0A0A0A';
                  }}
                >
                  CREATE ACCOUNT
                </a>
              </div>
            </form>

            {/* Trust Badges */}
            <div style={{
              marginTop: '48px',
              padding: '24px',
              background: '#F5F5F5',
              border: '2px solid #0A0A0A'
            }}>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#666666',
                textAlign: 'center',
                lineHeight: 1.6
              }}>
                🔒 Secure Login • 🚚 2400+ Deliveries • ⭐ 4.8 Rating
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .login-brutal > div {
            grid-template-columns: 1fr !important;
          }
          
          .login-brutal > div > div:first-child {
            min-height: 40vh;
            border-right: none !important;
            border-bottom: 4px solid #0A0A0A;
            padding: 32px !important;
          }
          
          .login-brutal > div > div:last-child {
            padding: 32px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;