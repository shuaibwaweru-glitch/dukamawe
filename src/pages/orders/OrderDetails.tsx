// src/pages/orders/OrderDetails.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Try to fetch from Convex (once you have the query set up)
  // const orderData = useQuery(api.orders.getOrderById, { orderId: orderId! });

  useEffect(() => {
    // Simulate fetching order details
    const fetchOrderDetails = async () => {
      setLoading(true);
      // In real app, this would be an API call to Convex
      setTimeout(() => {
        setOrder({
          id: orderId,
          orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
          status: 'processing',
          createdAt: new Date().toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          material: {
            name: 'Portland Cement',
            category: 'cement',
            quantity: 20,
            unit: 'bags',
            unitPrice: 850,
            totalPrice: 17000
          },
          pricing: {
            materialCost: 17000,
            transportCost: 10000,
            urgencyPremium: 0,
            platformFee: 1350,
            vat: 2976,
            total: 31326,
            depositPaid: 12530,
            balanceDue: 18796
          },
          delivery: {
            site: 'Westlands Construction Site',
            address: 'Westlands Road, Nairobi',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '14:00 - 16:00',
            contact: {
              name: 'John Site Manager',
              phone: '+254 712 345 678'
            }
          },
          supplier: {
            name: 'Demo Supplier Ltd',
            phone: '+254 700 000 000',
            rating: 4.8,
            address: 'Industrial Area, Nairobi'
          },
          payment: {
            deposit: {
              status: 'paid',
              amount: 12530,
              paidAt: new Date().toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              method: 'M-Pesa'
            },
            balance: {
              status: 'pending',
              amount: 18796,
              dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
          },
          timeline: [
            {
              time: '09:00',
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
              status: 'Order Placed',
              description: 'Order confirmed'
            },
            {
              time: '09:05',
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
              status: 'Payment Received',
              description: 'Deposit paid via M-Pesa'
            },
            {
              time: '09:30',
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
              status: 'Processing',
              description: 'Supplier preparing order',
              active: true
            }
          ]
        });
        setLoading(false);
      }, 1000);
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F57C00 0%, #13445C 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        ⏳ Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F57C00 0%, #13445C 100%)',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#13445C', marginBottom: '1rem' }}>
              Order Not Found
            </h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              The order you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: '#F57C00',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F57C00 0%, #13445C 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
              Order Details
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>
              #{order.orderNumber}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => navigate('/dashboard')}
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
              ← Dashboard
            </button>
            <button
              onClick={() => navigate('/orders/create')}
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
              New Order
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Left Column - Details */}
          <div>
            {/* Order Summary Card */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                    ORDER STATUS
                  </div>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    background: '#FFF3E0',
                    color: '#F57C00',
                    borderRadius: '20px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase'
                  }}>
                    {order.status}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                    ORDER DATE
                  </div>
                  <div style={{ fontWeight: '600', color: '#13445C' }}>
                    {order.createdAt}
                  </div>
                </div>
              </div>

              {/* Material Info */}
              <div style={{
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '3rem' }}>🏗️</div>
                  <div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: '#13445C',
                      marginBottom: '0.25rem'
                    }}>
                      {order.material.name}
                    </h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                      {order.material.quantity} {order.material.unit}
                    </p>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '1rem' }}>
                  <InfoRow label="Unit Price" value={`KES ${order.material.unitPrice.toLocaleString()}`} />
                  <InfoRow label="Total Material Cost" value={`KES ${order.material.totalPrice.toLocaleString()}`} />
                </div>
              </div>

              {/* Delivery Info */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#13445C',
                  marginBottom: '1rem'
                }}>
                  Delivery Information
                </h3>
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <InfoRow label="Site" value={order.delivery.site} />
                  <InfoRow label="Address" value={order.delivery.address} />
                  <InfoRow label="Date" value={order.delivery.date} />
                  <InfoRow label="Time Slot" value={order.delivery.time} />
                  <InfoRow label="Contact Person" value={order.delivery.contact.name} />
                  <InfoRow label="Contact Phone" value={order.delivery.contact.phone} />
                </div>
              </div>

              {/* Supplier Info */}
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#13445C',
                  marginBottom: '1rem'
                }}>
                  Supplier Information
                </h3>
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ fontSize: '2.5rem' }}>🏢</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#13445C', marginBottom: '0.25rem' }}>
                      {order.supplier.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>
                      {order.supplier.address}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      ⭐ {order.supplier.rating}/5.0 • 📞 {order.supplier.phone}
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Contact supplier: ' + order.supplier.phone)}
                    style={{
                      background: '#F57C00',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#13445C',
                marginBottom: '1.5rem'
              }}>
                Order Timeline
              </h3>
              <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                <div style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '0',
                  bottom: '0',
                  width: '2px',
                  background: '#e0e0e0'
                }}></div>

                {order.timeline.map((event: any, index: number) => (
                  <div key={index} style={{ position: 'relative', marginBottom: '1.5rem', paddingLeft: '1rem' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-0.5rem',
                      top: '0',
                      width: '1rem',
                      height: '1rem',
                      borderRadius: '50%',
                      background: event.active ? '#F57C00' : '#4CAF50',
                      border: '2px solid white'
                    }}></div>
                    
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
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
            </div>
          </div>

          {/* Right Column - Payment & Actions */}
          <div>
            {/* Payment Summary */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              position: 'sticky',
              top: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#13445C',
                marginBottom: '1.5rem'
              }}>
                Payment Summary
              </h3>
              
              <PriceRow label="Material Cost" value={order.pricing.materialCost} />
              <PriceRow label="Transport Cost" value={order.pricing.transportCost} />
              <PriceRow label="Platform Fee" value={order.pricing.platformFee} />
              <PriceRow label="VAT (16%)" value={order.pricing.vat} />
              
              <div style={{ borderTop: '2px solid #13445C', marginTop: '1rem', paddingTop: '1rem' }}>
                <PriceRow label="TOTAL" value={order.pricing.total} bold />
              </div>

              {/* Payment Status */}
              <div style={{ marginTop: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>
                    DEPOSIT STATUS
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      background: order.payment.deposit.status === 'paid' ? '#E8F5E9' : '#FFEBEE',
                      color: order.payment.deposit.status === 'paid' ? '#4CAF50' : '#F44336',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {order.payment.deposit.status}
                    </div>
                    <div style={{ fontWeight: '600', color: '#13445C' }}>
                      KES {order.payment.deposit.amount.toLocaleString()}
                    </div>
                  </div>
                  {order.payment.deposit.paidAt && (
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                      Paid on {order.payment.deposit.paidAt} via {order.payment.deposit.method}
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>
                    BALANCE DUE
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      background: '#FFF3E0',
                      color: '#F57C00',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {order.payment.balance.status}
                    </div>
                    <div style={{ fontWeight: '600', color: '#13445C' }}>
                      KES {order.payment.balance.amount.toLocaleString()}
                    </div>
                  </div>
                  {order.payment.balance.dueDate && (
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                      Due on {order.payment.balance.dueDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => navigate(`/track/${orderId}`)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#13445C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🚚 Track Delivery
                </button>
                <button
                  onClick={() => alert('Downloading invoice...')}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'white',
                    color: '#13445C',
                    border: '2px solid #13445C',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  📄 Download Invoice
                </button>
                <button
                  onClick={() => alert('Payment method selection')}
                  disabled={order.payment.balance.status !== 'pending'}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: order.payment.balance.status === 'pending' ? '#F57C00' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: order.payment.balance.status === 'pending' ? 'pointer' : 'not-allowed'
                  }}
                >
                  💳 Pay Balance
                </button>
                {order.status !== 'cancelled' && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this order?')) {
                        alert('Order cancellation requested. Our team will contact you shortly.');
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'white',
                      color: '#F44336',
                      border: '2px solid #F44336',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ❌ Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem 0',
      fontSize: '0.9rem'
    }}>
      <span style={{ color: '#666' }}>{label}:</span>
      <span style={{ fontWeight: '600', color: '#13445C' }}>{value}</span>
    </div>
  );
}

function PriceRow({ label, value, bold = false }: { label: string; value: number; bold?: boolean }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem 0',
      fontSize: bold ? '1.1rem' : '0.95rem',
      fontWeight: bold ? 'bold' : 'normal'
    }}>
      <span style={{ color: bold ? '#13445C' : '#666' }}>{label}</span>
      <span style={{ color: bold ? '#13445C' : '#13445C' }}>
        KES {value.toLocaleString()}
      </span>
    </div>
  );
}