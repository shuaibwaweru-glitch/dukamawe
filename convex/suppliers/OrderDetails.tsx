// src/pages/supplier/OrderDetails.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export default function SupplierOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [estimatedHours, setEstimatedHours] = useState(24);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const order = useQuery(
    api.suppliers.queries.getOrderDetails,
    orderId ? { orderId: orderId as Id<"orders"> } : "skip"
  );

  const acceptOrder = useMutation(api.suppliers.mutations.acceptOrder);
  const rejectOrder = useMutation(api.suppliers.mutations.rejectOrder);
  const startPreparing = useMutation(api.suppliers.mutations.startPreparingOrder);
  const markLoaded = useMutation(api.suppliers.mutations.markOrderLoaded);

  if (!order) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading order details...</p>
      </div>
    );
  }

  const handleAccept = async () => {
    if (!orderId) return;
    setIsProcessing(true);
    try {
      await acceptOrder({
        orderId: orderId as Id<"orders">,
        supplierId: order.supplier.supplierId as Id<"suppliers">,
        estimatedDeliveryTime: estimatedHours,
      });
      alert('✅ Order accepted successfully!');
      navigate('/supplier/dashboard');
    } catch (error: any) {
      alert('❌ Error: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!orderId || !rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setIsProcessing(true);
    try {
      await rejectOrder({
        orderId: orderId as Id<"orders">,
        supplierId: order.supplier.supplierId as Id<"suppliers">,
        reason: rejectReason,
      });
      alert('Order rejected. Stock has been restored.');
      navigate('/supplier/dashboard');
    } catch (error: any) {
      alert('❌ Error: ' + error.message);
    } finally {
      setIsProcessing(false);
      setShowRejectModal(false);
    }
  };

  const handleStartPreparing = async () => {
    if (!orderId) return;
    setIsProcessing(true);
    try {
      await startPreparing({ orderId: orderId as Id<"orders"> });
      alert('✅ Order marked as preparing!');
      window.location.reload();
    } catch (error: any) {
      alert('❌ Error: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending_supplier: '#FF9800',
      accepted: '#2196F3',
      preparing: '#9C27B0',
      loaded: '#00BCD4',
      in_transit: '#3F51B5',
      delivered: '#4CAF50',
    };
    return colors[status] || '#999';
  };

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
            <button
              onClick={() => navigate('/supplier/dashboard')}
              style={{
                background: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                color: '#13445C',
                marginBottom: '1rem'
              }}
            >
              ← Back to Dashboard
            </button>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '0.5rem'
            }}>
              Order #{order.orderNumber}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>
              Created {new Date(order.timeline.createdAt).toLocaleString()}
            </p>
          </div>
          <div style={{
            background: getStatusColor(order.status),
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontSize: '1.25rem',
            fontWeight: 'bold'
          }}>
            {order.status.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem'
        }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Material Details */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#13445C',
                marginBottom: '1.5rem'
              }}>
                Material Details
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem'
              }}>
                <DetailItem label="Material" value={order.material.name} />
                <DetailItem label="Category" value={order.materialDetails?.category || 'N/A'} />
                <DetailItem label="Specification" value={order.material.specifications?.grade || 'N/A'} />
                <DetailItem label="Quantity" value={`${order.material.quantity} ${order.material.unit}`} />
                <DetailItem label="Unit Price" value={`KES ${order.material.unitPrice.toLocaleString()}`} />
                <DetailItem label="Total Material Cost" value={`KES ${order.pricing.materialCost.toLocaleString()}`} />
              </div>
            </div>

            {/* Buyer Information */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#13445C',
                marginBottom: '1.5rem'
              }}>
                Buyer Information
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem'
              }}>
                <DetailItem label="Name" value={order.buyer.name} />
                <DetailItem label="Phone" value={order.buyer.phone} />
                <DetailItem label="Email" value={order.buyer.email} />
                <DetailItem label="Site Name" value={order.buyer.site.name} />
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#666',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  Delivery Address
                </div>
                <div style={{
                  padding: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  color: '#13445C'
                }}>
                  📍 {order.buyer.site.address}
                </div>
              </div>
              {order.buyer.site.instructions && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#666',
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                  }}>
                    Special Instructions
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: '#FFF3E0',
                    borderRadius: '8px',
                    color: '#E65100'
                  }}>
                    💬 {order.buyer.site.instructions}
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Details */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#13445C',
                marginBottom: '1.5rem'
              }}>
                Delivery Details
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem'
              }}>
                <DetailItem 
                  label="Distance" 
                  value={order.supplier.distance ? `${order.supplier.distance.toFixed(1)} km` : 'N/A'} 
                />
                <DetailItem 
                  label="Urgency Level" 
                  value={order.urgency.level.toUpperCase()}
                  highlight={order.urgency.level !== 'standard'}
                />
                <DetailItem 
                  label="SLA" 
                  value={`${order.urgency.sla / 3600000} hours`} 
                />
                <DetailItem 
                  label="Deadline" 
                  value={new Date(order.urgency.deadline).toLocaleString()} 
                />
              </div>
              {order.urgency.level !== 'standard' && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: order.urgency.level === 'emergency' ? '#FFEBEE' : '#FFF3E0',
                  borderRadius: '8px',
                  color: order.urgency.level === 'emergency' ? '#C62828' : '#E65100',
                  fontWeight: '600'
                }}>
                  🔥 {order.urgency.level.toUpperCase()} DELIVERY - Extra payment included
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Price Breakdown */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#13445C',
                marginBottom: '1rem'
              }}>
                Price Breakdown
              </h3>
              <PriceRow label="Material Cost" value={order.pricing.materialCost} />
              <PriceRow label="Transport Cost" value={order.pricing.transportCost} />
              {order.pricing.urgencyPremium > 0 && (
                <PriceRow label="Urgency Premium" value={order.pricing.urgencyPremium} />
              )}
              <PriceRow label="Platform Fee (5%)" value={order.pricing.platformFee} />
              <PriceRow label="VAT (16%)" value={order.pricing.vat} />
              <div style={{
                borderTop: '2px solid #13445C',
                marginTop: '1rem',
                paddingTop: '1rem'
              }}>
                <PriceRow label="TOTAL" value={order.pricing.total} bold />
              </div>
              <div style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <PriceRow 
                  label="Deposit (Paid)" 
                  value={order.pricing.depositAmount} 
                  color="#4CAF50" 
                />
                <PriceRow 
                  label="Balance (On Delivery)" 
                  value={order.pricing.balanceAmount} 
                  color="#666" 
                />
              </div>
            </div>

            {/* Actions */}
            {order.status === 'pending_supplier' && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#13445C',
                  marginBottom: '1rem'
                }}>
                  Accept Order
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#13445C'
                  }}>
                    Estimated Delivery Time (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="72"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 1)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <button
                  onClick={handleAccept}
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: isProcessing ? '#ccc' : '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    marginBottom: '0.75rem'
                  }}
                >
                  {isProcessing ? 'Processing...' : '✓ Accept Order'}
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '2px solid #F44336',
                    background: 'white',
                    color: '#F44336',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: isProcessing ? 'not-allowed' : 'pointer'
                  }}
                >
                  ✗ Reject Order
                </button>
              </div>
            )}

            {order.status === 'accepted' && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#13445C',
                  marginBottom: '1rem'
                }}>
                  Next Step
                </h3>
                <button
                  onClick={handleStartPreparing}
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: isProcessing ? '#ccc' : '#9C27B0',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: isProcessing ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isProcessing ? 'Processing...' : '📦 Start Preparing Order'}
                </button>
              </div>
            )}

            {/* Release Code */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#13445C',
                marginBottom: '1rem'
              }}>
                Release Code
              </h3>
              <div style={{
                background: '#FFF3E0',
                padding: '1.5rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#E65100',
                  marginBottom: '0.5rem'
                }}>
                  Buyer must provide this code to driver
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#E65100',
                  letterSpacing: '0.3rem'
                }}>
                  {order.proof.releaseCode}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#13445C',
              marginBottom: '1rem'
            }}>
              Reject Order
            </h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Please provide a reason for rejecting this order:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Out of stock, Cannot meet delivery time..."
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                fontSize: '1rem',
                marginBottom: '1rem',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  background: 'white',
                  color: '#666',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || isProcessing}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: !rejectReason.trim() || isProcessing ? '#ccc' : '#F44336',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: !rejectReason.trim() || isProcessing ? 'not-allowed' : 'pointer'
                }}
              >
                {isProcessing ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function DetailItem({ label, value, highlight }: any) {
  return (
    <div>
      <div style={{
        fontSize: '0.875rem',
        color: '#666',
        marginBottom: '0.5rem',
        fontWeight: '600'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '1rem',
        fontWeight: '600',
        color: highlight ? '#F57C00' : '#13445C'
      }}>
        {value}
      </div>
    </div>
  );
}

function PriceRow({ label, value, bold, color }: any) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem 0',
      fontSize: bold ? '1.1rem' : '0.95rem',
      fontWeight: bold ? 'bold' : 'normal',
      color: color || '#13445C'
    }}>
      <span>{label}</span>
      <span>KES {value.toLocaleString()}</span>
    </div>
  );
}