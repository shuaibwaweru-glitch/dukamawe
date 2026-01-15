// src/pages/orders/TrackOrder.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TrackOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState(orderId || '');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      handleTrack(orderId);
    }
  }, [orderId]);

  const handleTrack = async (trackingNumber?: string) => {
    const numberToTrack = trackingNumber || orderNumber;
    
    if (!numberToTrack.trim()) {
      alert('Please enter an order number');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTrackingData({
        orderNumber: numberToTrack,
        status: 'in_transit',
        estimatedDelivery: '2024-01-20 14:00',
        driver: {
          name: 'John Doe',
          phone: '+254 712 345 678',
          rating: 4.8,
          vehicle: 'Toyota Hilux KDA 123A'
        },
        currentLocation: {
          lat: -1.3000,
          lng: 36.8000,
          address: 'Mombasa Road, Nairobi'
        },
        progress: 65,
        timeline: [
          {
            time: '09:00',
            date: '2024-01-18',
            status: 'Order Placed',
            description: 'Order confirmed and payment received'
          },
          {
            time: '11:30',
            date: '2024-01-18',
            status: 'Processing',
            description: 'Supplier preparing order for dispatch'
          },
          {
            time: '14:00',
            date: '2024-01-18',
            status: 'Dispatched',
            description: 'Order left supplier warehouse'
          },
          {
            time: '09:00',
            date: '2024-01-19',
            status: 'In Transit',
            description: 'Currently en route to delivery site',
            active: true
          }
        ]
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F57C00 0%, #13445C 100%)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '0.5rem'
            }}>
              Track Your Order
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>
              {orderId ? `Tracking Order #${orderId}` : 'Enter your order number to track delivery'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {orderId && (
              <button
                onClick={() => navigate(`/orders/${orderId}`)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ← Order Details
              </button>
            )}
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'white',
                color: '#13445C',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Search Box - Only show if no orderId in URL */}
        {!orderId && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#13445C'
                }}>
                  Order Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., ORD-123456"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>
              <button
                onClick={() => handleTrack()}
                disabled={isLoading}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#F57C00',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  height: 'fit-content'
                }}
              >
                {isLoading ? 'Tracking...' : 'Track Order'}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !trackingData && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '4rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#13445C' }}>
              Tracking your order...
            </div>
          </div>
        )}

        {/* Tracking Results */}
        {trackingData && !isLoading && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#13445C',
              marginBottom: '1.5rem'
            }}>
              Order #{trackingData.orderNumber}
            </h2>

            {/* Status Card */}
            <div style={{
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                    CURRENT STATUS
                  </div>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#F57C00',
                    textTransform: 'uppercase'
                  }}>
                    {trackingData.status.replace('_', ' ')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                    ESTIMATED DELIVERY
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#13445C' }}>
                    {trackingData.estimatedDelivery}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>Progress</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#13445C' }}>
                    {trackingData.progress}%
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  background: '#e0e0e0',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${trackingData.progress}%`,
                    background: '#F57C00',
                    borderRadius: '4px'
                  }}></div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#13445C',
              marginBottom: '1rem'
            }}>
              Order Timeline
            </h3>
            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
              {/* Vertical Line */}
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '0',
                bottom: '0',
                width: '2px',
                background: '#e0e0e0'
              }}></div>

              {trackingData.timeline.map((event: any, index: number) => (
                <div key={index} style={{
                  position: 'relative',
                  marginBottom: '2rem',
                  paddingLeft: '1rem'
                }}>
                  {/* Dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-0.5rem',
                    top: '0',
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '50%',
                    background: event.active ? '#F57C00' : '#4CAF50',
                    border: '2px solid white',
                    boxShadow: '0 0 0 2px #e0e0e0'
                  }}></div>

                  <div style={{
                    background: event.active ? '#FFF3E0' : '#f8f9fa',
                    borderRadius: '8px',
                    padding: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: '600', color: '#13445C' }}>
                        {event.status}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        {event.date} • {event.time}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {event.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Driver Info */}
            <div style={{
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '1.5rem',
              marginTop: '2rem'
            }}>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#13445C',
                marginBottom: '1rem'
              }}>
                Delivery Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>
                    Driver
                  </div>
                  <div style={{ fontWeight: '600', color: '#13445C' }}>
                    {trackingData.driver.name}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>
                    Phone
                  </div>
                  <div style={{ fontWeight: '600', color: '#13445C' }}>
                    {trackingData.driver.phone}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>
                    Vehicle
                  </div>
                  <div style={{ fontWeight: '600', color: '#13445C' }}>
                    {trackingData.driver.vehicle}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>
                    Rating
                  </div>
                  <div style={{ fontWeight: '600', color: '#13445C' }}>
                    ⭐ {trackingData.driver.rating}/5.0
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div style={{
              marginTop: '2rem',
              background: '#e0e0e0',
              borderRadius: '12px',
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontSize: '1rem'
            }}>
              🗺️ Live Tracking Map (Integration Required)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}