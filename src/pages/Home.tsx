// src/pages/Home.tsx - Neo-Brutalism Version
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrutalButton } from '../components/brutal/BrutalButton';
import { BrutalCard } from '../components/brutal/BrutalCard';
import { BrutalInput, BrutalSelect } from '../components/brutal/BrutalInput';

const Home = () => {
  const navigate = useNavigate();
  const [material, setMaterial] = useState('');
  const [quantity, setQuantity] = useState('');
  const [distance, setDistance] = useState('');

  const materials = [
    { value: 'cement', label: 'Portland Cement' },
    { value: 'ballast', label: 'Ballast 20mm' },
    { value: 'sand', label: 'Building Sand' },
    { value: 'stones', label: 'Machine Cut Stones' },
  ];

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/orders/create', { 
      state: { material, quantity, distance } 
    });
  };

  return (
    <div className="home-brutal">
      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #FF6B00 0%, #E65100 100%)',
        minHeight: '600px',
        padding: '80px 32px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '8px solid #0A0A0A'
      }}>
        {/* Diagonal Pattern Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(0,0,0,0.1) 35px,
            rgba(0,0,0,0.1) 70px
          )`,
          pointerEvents: 'none'
        }} />

        <div className="container-brutal" style={{ 
          position: 'relative',
          zIndex: 1 
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            alignItems: 'center'
          }}>
            {/* LEFT: Hero Content */}
            <div>
              {/* Accent Bars */}
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                marginBottom: '32px' 
              }}>
                <div style={{ 
                  width: '48px', 
                  height: '6px', 
                  background: '#FFD600',
                  border: '2px solid #0A0A0A'
                }} />
                <div style={{ 
                  width: '48px', 
                  height: '6px', 
                  background: '#FFFFFF',
                  border: '2px solid #0A0A0A'
                }} />
                <div style={{ 
                  width: '48px', 
                  height: '6px', 
                  background: '#0A0A0A'
                }} />
              </div>

              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(48px, 6vw, 72px)',
                fontWeight: 700,
                lineHeight: 1.1,
                textTransform: 'uppercase',
                color: '#FFFFFF',
                marginBottom: '24px',
                textShadow: '6px 6px 0px #0A0A0A'
              }}>
                Building Materials,<br/>
                <span style={{ color: '#FFD600' }}>Delivered Safely</span><br/>
                Across Kenya
              </h1>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '20px',
                fontWeight: 500,
                lineHeight: 1.6,
                color: '#FFFFFF',
                marginBottom: '40px',
                maxWidth: '500px'
              }}>
                Connect directly with verified quarries and trusted transporters.
                Secure escrow payments, real-time tracking, and guaranteed delivery.
              </p>

              <div style={{ display: 'flex', gap: '16px' }}>
                <BrutalButton
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/orders/create')}
                  style={{
                    background: '#FFD600',
                    color: '#0A0A0A',
                    boxShadow: '6px 6px 0px #0A0A0A'
                  }}
                >
                  GET STARTED →
                </BrutalButton>

                <BrutalButton
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = 'tel:+254700000000'}
                  style={{
                    background: 'transparent',
                    color: '#FFFFFF',
                    borderColor: '#FFFFFF',
                    boxShadow: '6px 6px 0px rgba(0,0,0,0.3)'
                  }}
                >
                  📞 +254 700 000 000
                </BrutalButton>
              </div>
            </div>

            {/* RIGHT: Image Card with Trust Badge */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: '#FFFFFF',
                border: '6px solid #0A0A0A',
                boxShadow: '12px 12px 0px #0A0A0A',
                overflow: 'hidden',
                transform: 'rotate(-2deg)'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop"
                  alt="Building materials delivery"
                  style={{ 
                    width: '100%', 
                    height: '400px', 
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>

              {/* Trust Badge */}
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#FFFFFF',
                border: '4px solid #0A0A0A',
                padding: '16px 32px',
                boxShadow: '8px 8px 0px #0A0A0A',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '32px' }}>🔒</span>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#0A0A0A'
                  }}>
                    100% SECURE
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#666666'
                  }}>
                    Escrow Protection
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section style={{
        background: '#FFFFFF',
        padding: '80px 32px',
        borderBottom: '4px solid #0A0A0A'
      }}>
        <div className="container-brutal">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '32px'
          }}>
            {/* Stat 1 */}
            <div style={{
              background: '#F5F5F5',
              border: '4px solid #0A0A0A',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '8px 8px 0px #0A0A0A',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-3px, -3px)';
              e.currentTarget.style.boxShadow = '11px 11px 0px #0A0A0A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '8px 8px 0px #0A0A0A';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>📍</div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '48px',
                fontWeight: 700,
                color: '#FF6B00',
                lineHeight: 1
              }}>47</div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: '#666666',
                marginTop: '8px'
              }}>Active Counties</div>
            </div>

            {/* Stat 2 */}
            <div style={{
              background: '#F5F5F5',
              border: '4px solid #0A0A0A',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '8px 8px 0px #0A0A0A',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-3px, -3px)';
              e.currentTarget.style.boxShadow = '11px 11px 0px #0A0A0A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '8px 8px 0px #0A0A0A';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>✅</div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '48px',
                fontWeight: 700,
                color: '#FF6B00',
                lineHeight: 1
              }}>150+</div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: '#666666',
                marginTop: '8px'
              }}>Verified Suppliers</div>
            </div>

            {/* Stat 3 */}
            <div style={{
              background: '#F5F5F5',
              border: '4px solid #0A0A0A',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '8px 8px 0px #0A0A0A',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-3px, -3px)';
              e.currentTarget.style.boxShadow = '11px 11px 0px #0A0A0A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '8px 8px 0px #0A0A0A';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>🚚</div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '48px',
                fontWeight: 700,
                color: '#FF6B00',
                lineHeight: 1
              }}>2,000+</div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: '#666666',
                marginTop: '8px'
              }}>Deliveries Completed</div>
            </div>

            {/* Stat 4 */}
            <div style={{
              background: '#F5F5F5',
              border: '4px solid #0A0A0A',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '8px 8px 0px #0A0A0A',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-3px, -3px)';
              e.currentTarget.style.boxShadow = '11px 11px 0px #0A0A0A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '8px 8px 0px #0A0A0A';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>⭐</div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '48px',
                fontWeight: 700,
                color: '#FF6B00',
                lineHeight: 1
              }}>98%</div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: '#666666',
                marginTop: '8px'
              }}>Satisfied Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY DUKAMAWE SECTION */}
      <section style={{
        background: '#F5F5F5',
        padding: '80px 32px',
        borderBottom: '4px solid #0A0A0A'
      }}>
        <div className="container-brutal">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="h2-brutal" style={{ marginBottom: '16px' }}>
              WHY DUKAMAWE IS TRUSTED
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '18px',
              fontWeight: 500,
              color: '#666666'
            }}>
              Built for diaspora buyers who need reliability, transparency, and security
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '32px'
          }}>
            {/* Feature 1 */}
            <BrutalCard accent="orange">
              <div style={{
                width: '64px',
                height: '64px',
                background: '#FFD600',
                border: '3px solid #0A0A0A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '24px'
              }}>🔒</div>
              <h3 className="h4-brutal" style={{ marginBottom: '12px' }}>
                SECURE ESCROW
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: 1.6,
                color: '#666666'
              }}>
                Your money is protected until delivery is confirmed. Pay with M-Pesa.
              </p>
            </BrutalCard>

            {/* Feature 2 */}
            <BrutalCard accent="blue">
              <div style={{
                width: '64px',
                height: '64px',
                background: '#00BFFF',
                border: '3px solid #0A0A0A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '24px'
              }}>📍</div>
              <h3 className="h4-brutal" style={{ marginBottom: '12px' }}>
                REAL-TIME GPS
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: 1.6,
                color: '#666666'
              }}>
                Track your delivery live from quarry to construction site.
              </p>
            </BrutalCard>

            {/* Feature 3 */}
            <BrutalCard accent="green">
              <div style={{
                width: '64px',
                height: '64px',
                background: '#00FF00',
                border: '3px solid #0A0A0A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '24px'
              }}>✅</div>
              <h3 className="h4-brutal" style={{ marginBottom: '12px' }}>
                VERIFIED SUPPLIERS
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: 1.6,
                color: '#666666'
              }}>
                All quarries and truck owners are verified and licensed.
              </p>
            </BrutalCard>

            {/* Feature 4 */}
            <BrutalCard accent="yellow">
              <div style={{
                width: '64px',
                height: '64px',
                background: '#FFD600',
                border: '3px solid #0A0A0A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '24px'
              }}>⚡</div>
              <h3 className="h4-brutal" style={{ marginBottom: '12px' }}>
                FAST DELIVERY
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: 1.6,
                color: '#666666'
              }}>
                Get quotes within minutes and deliveries same-day across Kenya.
              </p>
            </BrutalCard>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section style={{
        background: '#FFFFFF',
        padding: '80px 32px',
        borderBottom: '4px solid #0A0A0A'
      }}>
        <div className="container-brutal">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            {/* Accent Bars */}
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              marginBottom: '24px',
              justifyContent: 'center'
            }}>
              <div style={{ width: '48px', height: '6px', background: '#FFD600', border: '2px solid #0A0A0A' }} />
              <div style={{ width: '48px', height: '6px', background: '#FF6B00', border: '2px solid #0A0A0A' }} />
              <div style={{ width: '48px', height: '6px', background: '#0A0A0A' }} />
            </div>

            <h2 className="h2-brutal" style={{ marginBottom: '16px' }}>
              HOW DUKAMAWE WORKS
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '18px',
              fontWeight: 500,
              color: '#666666'
            }}>
              Simple, secure, and transparent from quote to delivery
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '24px'
          }}>
            {[
              { step: 1, icon: '🔍', title: 'BROWSE VERIFIED SUPPLIERS', desc: 'Search 150+ verified suppliers across all 47 counties in Kenya' },
              { step: 2, icon: '💬', title: 'GET INSTANT QUOTE', desc: 'Receive instant pricing with materials, transport and service fees' },
              { step: 3, icon: '💰', title: 'PAY SECURELY (30% DEPOSIT)', desc: 'Your M-Pesa payment is held in escrow until delivery is confirmed' },
              { step: 4, icon: '📍', title: 'TRACK IN REAL-TIME', desc: 'Watch your delivery with live GPS tracking from quarry to site' },
              { step: 5, icon: '✅', title: 'CONFIRM & RELEASE', desc: 'Verify delivery with your code, then the balance (70%) is released' },
            ].map(item => (
              <div key={item.step} style={{
                background: '#F5F5F5',
                border: '4px solid #0A0A0A',
                padding: '24px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '6px 6px 0px #0A0A0A'
              }}>
                {/* Step Number Badge */}
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '-12px',
                  width: '40px',
                  height: '40px',
                  background: '#FF6B00',
                  border: '3px solid #0A0A0A',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#FFFFFF'
                }}>
                  {item.step}
                </div>

                <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                  {item.icon}
                </div>
                <h4 style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#0A0A0A',
                  marginBottom: '12px',
                  lineHeight: 1.3
                }}>
                  {item.title}
                </h4>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 500,
                  lineHeight: 1.5,
                  color: '#666666'
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Escrow Protection Banner */}
          <div style={{
            marginTop: '48px',
            background: '#FFF8E1',
            border: '4px solid #0A0A0A',
            padding: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '8px 8px 0px #0A0A0A'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '48px' }}>🔒</div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#0A0A0A'
                }}>
                  100% ESCROW PROTECTION
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#666666'
                }}>
                  Your payment is safe. Money released only after delivery confirmation.
                </div>
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '32px',
              fontWeight: 700,
              color: '#FF6B00'
            }}>
              KSHS 50M+
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE FORM SECTION */}
      <section style={{
        background: '#FFD600',
        padding: '80px 32px',
        borderBottom: '8px solid #0A0A0A'
      }}>
        <div className="container-brutal">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            alignItems: 'center'
          }}>
            {/* LEFT: Form */}
            <div style={{
              background: '#FFFFFF',
              border: '6px solid #0A0A0A',
              padding: '48px',
              boxShadow: '12px 12px 0px #0A0A0A'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '24px', textAlign: 'center' }}>📋</div>
              <h2 className="h2-brutal" style={{ marginBottom: '16px', textAlign: 'center' }}>
                GET AN INSTANT QUOTE
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 500,
                color: '#666666',
                textAlign: 'center',
                marginBottom: '32px'
              }}>
                Transparent pricing - see material, transport, and service costs upfront
              </p>

              <form onSubmit={handleQuoteSubmit}>
                <BrutalSelect
                  label="BUILDING MATERIAL"
                  value={material}
                  onChange={setMaterial}
                  options={materials}
                  placeholder="Select material..."
                  required
                />

                <BrutalInput
                  label="QUANTITY (TONNES)"
                  type="number"
                  value={quantity}
                  onChange={setQuantity}
                  placeholder="e.g. 15"
                  required
                />

                <BrutalInput
                  label="DISTANCE (KM)"
                  type="number"
                  value={distance}
                  onChange={setDistance}
                  placeholder="e.g. 50"
                  required
                />

                <BrutalButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  style={{
                    background: '#FF6B00',
                    marginTop: '8px'
                  }}
                >
                  CALCULATE QUOTE →
                </BrutalButton>
              </form>
            </div>

            {/* RIGHT: Info Box */}
            <div>
              <div style={{
                background: '#FFFFFF',
                border: '4px solid #0A0A0A',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '6px 6px 0px #0A0A0A'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
                <h4 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#0A0A0A',
                  marginBottom: '8px'
                }}>
                  INSTANT PRICING
                </h4>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.6,
                  color: '#666666'
                }}>
                  Get transparent quotes in seconds. No hidden fees or surprises.
                </p>
              </div>

              <div style={{
                background: '#0A0A0A',
                border: '4px solid #0A0A0A',
                padding: '24px',
                boxShadow: '6px 6px 0px rgba(0,0,0,0.3)'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚚</div>
                <h4 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#FFD600',
                  marginBottom: '8px'
                }}>
                  SAME-DAY DELIVERY
                </h4>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.6,
                  color: '#FFFFFF'
                }}>
                  Most orders delivered within 24 hours across major Kenyan cities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GPS TRACKING SECTION */}
      <section style={{
        background: '#FFFFFF',
        padding: '80px 32px',
        borderBottom: '4px solid #0A0A0A'
      }}>
        <div className="container-brutal">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            alignItems: 'center'
          }}>
            {/* LEFT: Map Mockup */}
            <div style={{
              background: '#F5F5F5',
              border: '6px solid #0A0A0A',
              padding: '32px',
              boxShadow: '12px 12px 0px #0A0A0A',
              position: 'relative',
              minHeight: '500px'
            }}>
              {/* Map Placeholder */}
              <div style={{
                background: '#E0E0E0',
                border: '3px solid #0A0A0A',
                height: '400px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop"
                  alt="GPS tracking map"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.5
                  }}
                />

                {/* Tracking Points */}
                <div style={{
                  position: 'absolute',
                  top: '60px',
                  left: '60px',
                  background: '#FFD600',
                  border: '3px solid #0A0A0A',
                  padding: '12px 20px',
                  boxShadow: '4px 4px 0px #0A0A0A',
                  animation: 'pulse 2s infinite'
                }}>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#0A0A0A'
                  }}>
                    📍 KASARANI QUARRY
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: '#666666'
                  }}>
                    Picked up at 9:30 AM
                  </div>
                </div>

                <div style={{
                  position: 'absolute',
                  top: '180px',
                  left: '180px',
                  background: '#00BFFF',
                  border: '3px solid #0A0A0A',
                  padding: '12px 20px',
                  boxShadow: '4px 4px 0px #0A0A0A'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#FFFFFF'
                  }}>
                    <div className="loading-brutal" style={{
                      width: '16px',
                      height: '16px',
                      borderWidth: '2px',
                      borderTopColor: '#FFFFFF'
                    }} />
                    ON THIKA ROAD
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: '#FFFFFF'
                  }}>
                    15 min away
                  </div>
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: '60px',
                  right: '60px',
                  background: '#FFFFFF',
                  border: '3px solid #0A0A0A',
                  padding: '12px 20px',
                  boxShadow: '4px 4px 0px #0A0A0A'
                }}>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#0A0A0A'
                  }}>
                    🏠 WESTSIDE SITE
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: '#666666'
                  }}>
                    Awaiting delivery
                  </div>
                </div>

                {/* LIVE badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#FF0000',
                  border: '2px solid #0A0A0A',
                  padding: '8px 16px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  animation: 'blink 1s infinite'
                }}>
                  🔴 LIVE
                </div>
              </div>
            </div>

            {/* RIGHT: Info */}
            <div>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>📍</div>
              <h2 className="h2-brutal" style={{ marginBottom: '24px' }}>
                TRACK EVERY DELIVERY IN REAL-TIME
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '18px',
                fontWeight: 500,
                lineHeight: 1.6,
                color: '#666666',
                marginBottom: '32px'
              }}>
                Live GPS tracking from quarry pickup to your construction site
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { icon: '📍', title: 'GPS TRACKING EVERY MINUTE', desc: 'See exactly where your delivery is at all times. Truck updates location automatically.' },
                  { icon: '⏰', title: 'REAL-TIME ETA UPDATES', desc: 'Get accurate arrival times and instant notifications when status changes.' },
                  { icon: '🔒', title: 'DELIVERY CONFIRMATION CODE', desc: 'Secure code system ensures your materials are delivered to the right site.' },
                  { icon: '📸', title: 'PHOTO PROOF OF DELIVERY', desc: 'Drivers upload photos at pickup and delivery for your peace of mind.' }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '20px',
                    background: idx % 2 === 0 ? '#FFD600' : '#FFFFFF',
                    border: '3px solid #0A0A0A',
                    boxShadow: '4px 4px 0px #0A0A0A'
                  }}>
                    <div style={{ fontSize: '32px', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: '#0A0A0A',
                        marginBottom: '6px'
                      }}>
                        {item.title}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: 1.5,
                        color: '#666666'
                      }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{
        background: '#0A0A0A',
        padding: '80px 32px',
        borderBottom: '8px solid #FFD600'
      }}>
        <div className="container-brutal" style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#FFFFFF',
            marginBottom: '16px'
          }}>
            READY TO BUILD WITH CONFIDENCE?
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '20px',
            fontWeight: 500,
            color: '#CCCCCC',
            marginBottom: '40px'
          }}>
            Join thousands of builders across Kenya using Dukamawe for secure, trackable deliveries
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <BrutalButton
              variant="primary"
              size="lg"
              onClick={() => navigate('/orders/create')}
              style={{
                background: '#FFD600',
                color: '#0A0A0A',
                boxShadow: '6px 6px 0px #FFD600'
              }}
            >
              START YOUR ORDER →
            </BrutalButton>
            <BrutalButton
              variant="outline"
              size="lg"
              onClick={() => navigate('/register')}
              style={{
                background: 'transparent',
                color: '#FFFFFF',
                borderColor: '#FFFFFF',
                boxShadow: '6px 6px 0px rgba(255,255,255,0.2)'
              }}
            >
              CREATE FREE ACCOUNT
            </BrutalButton>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: '#FFD600',
        padding: '64px 32px 32px',
        borderTop: '8px solid #0A0A0A'
      }}>
        <div className="container-brutal">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '64px',
            marginBottom: '48px'
          }}>
            {/* Column 1: Brand */}
            <div>
              <h3 className="h3-brutal" style={{ marginBottom: '16px' }}>
                DUKAMAWE
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: 1.6,
                color: '#0A0A0A',
                marginBottom: '24px'
              }}>
                Building Kenya, One Delivery at a Time
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: 1.6,
                color: '#666666'
              }}>
                Connecting verified quarries, trusted transporters, and diaspora buyers across Kenya. Secure escrow payments, real-time tracking, and guaranteed delivery.
              </p>
              <div style={{ marginTop: '24px' }}>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0A0A0A',
                  marginBottom: '8px'
                }}>
                  📞 +254 700 000 000
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0A0A0A',
                  marginBottom: '8px'
                }}>
                  ✉️ support@dukamawe.co.ke
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0A0A0A'
                }}>
                  📍 Nairobi, Kenya
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '20px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#0A0A0A',
                marginBottom: '24px'
              }}>
                QUICK LINKS
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Browse Suppliers', href: '/suppliers' },
                  { label: 'Available Jobs', href: '/jobs' },
                  { label: 'Track Orders', href: '/track' },
                  { label: 'Dashboard', href: '/dashboard' }
                ].map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#0A0A0A',
                      textDecoration: 'none',
                      borderBottom: '2px solid transparent',
                      display: 'inline-block',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderBottomColor = '#0A0A0A';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderBottomColor = 'transparent';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    → {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 3: For Businesses */}
            <div>
              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '20px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#0A0A0A',
                marginBottom: '24px'
              }}>
                FOR BUSINESSES
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Register as Quarry', href: '/register/supplier' },
                  { label: 'Register as Transporter', href: '/register/driver' },
                  { label: 'Verification Process', href: '/verification' },
                  { label: 'Pricing & Fees', href: '/pricing' }
                ].map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#0A0A0A',
                      textDecoration: 'none',
                      borderBottom: '2px solid transparent',
                      display: 'inline-block',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderBottomColor = '#0A0A0A';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderBottomColor = 'transparent';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    → {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            paddingTop: '32px',
            borderTop: '3px solid #0A0A0A',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 600,
              color: '#0A0A0A'
            }}>
              © 2026 Dukamawe. All rights reserved. Built for Kenya.
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(item => (
                <a
                  key={item}
                  href="#"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0A0A0A',
                    textDecoration: 'none',
                    borderBottom: '2px solid transparent',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderBottomColor = '#0A0A0A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderBottomColor = 'transparent';
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.5; }
        }

        @media (max-width: 1024px) {
          .home-brutal section > div > div {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;