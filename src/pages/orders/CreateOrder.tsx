// src/pages/orders/CreateOrder.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import MaterialCatalog, { Material } from '../../components/MaterialCatalog';

type OrderStep = 'material' | 'details' | 'review';
type UrgencyLevel = 'standard' | 'priority' | 'emergency';

interface OrderData {
  material: Material | null;
  specification: string;
  quantity: number;
  urgency: UrgencyLevel;
  site: string;
  deliveryDate: string;
  instructions: string;
}

export default function CreateOrder() {
  const navigate = useNavigate();
  const { user } = useUser();
  const createOrderMutation = useMutation(api.orders_create.createOrder);
  
  const [step, setStep] = useState<OrderStep>('material');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({
    material: null,
    specification: '',
    quantity: 1,
    urgency: 'standard',
    site: '',
    deliveryDate: '',
    instructions: ''
  });

  const handleMaterialSelect = (material: Material) => {
    setOrderData({ ...orderData, material, specification: material.specifications[0] });
    setStep('details');
  };

  const calculatePricing = () => {
    if (!orderData.material) return null;

    const materialCost = orderData.material.basePrice * orderData.quantity;
    const transportCost = Math.ceil(orderData.quantity * 500);
    
    const urgencyMultiplier = {
      standard: 1,
      priority: 1.15,
      emergency: 1.3
    };
    const urgencyPremium = materialCost * (urgencyMultiplier[orderData.urgency] - 1);
    
    const subtotal = materialCost + transportCost + urgencyPremium;
    const platformFee = subtotal * 0.05;
    const subtotalWithFee = subtotal + platformFee;
    const vat = subtotalWithFee * 0.16;
    const total = subtotalWithFee + vat;
    
    const deposit = total * 0.4;
    const balance = total * 0.6;

    return {
      materialCost,
      transportCost,
      urgencyPremium,
      subtotal,
      platformFee,
      vat,
      total,
      deposit,
      balance
    };
  };

  const handleCreateOrder = async () => {
    if (!orderData.material || !pricing || !user) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await createOrderMutation({
        buyerClerkId: user.id,
        buyerName: user.fullName || user.firstName || "User",
        buyerEmail: user.primaryEmailAddress?.emailAddress || "",
        buyerPhone: user.phoneNumbers?.[0]?.phoneNumber,
        
        materialId: orderData.material.id,
        materialName: orderData.material.name,
        materialCategory: orderData.material.category,
        specification: orderData.specification,
        quantity: orderData.quantity,
        unit: orderData.material.unit,
        
        siteName: orderData.site,
        siteAddress: orderData.site,
        deliveryDate: orderData.deliveryDate,
        urgencyLevel: orderData.urgency,
        instructions: orderData.instructions,
        
        materialCost: pricing.materialCost,
        transportCost: pricing.transportCost,
        urgencyPremium: pricing.urgencyPremium,
        platformFee: pricing.platformFee,
        vat: pricing.vat,
        total: pricing.total,
        depositAmount: pricing.deposit,
        balanceAmount: pricing.balance,
      });
      
      alert(`✅ Order Created Successfully!\n\nOrder Number: ${result.orderNumber}\nDeposit: KES ${result.depositAmount.toLocaleString()}\nRelease Code: ${result.releaseCode}\n\n🚀 Next: M-Pesa payment integration!`);
      
      // Navigate back to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Error creating order:", error);
      alert("❌ Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pricing = calculatePricing();

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
              Create New Order
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>
              Step {step === 'material' ? '1' : step === 'details' ? '2' : '3'} of 3
            </p>
          </div>
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
            ← Back to Dashboard
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <StepIndicator
              number={1}
              title="Select Material"
              active={step === 'material'}
              completed={step !== 'material'}
            />
            <StepIndicator
              number={2}
              title="Order Details"
              active={step === 'details'}
              completed={step === 'review'}
            />
            <StepIndicator
              number={3}
              title="Review & Pay"
              active={step === 'review'}
              completed={false}
            />
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: orderData.material ? '1fr 400px' : '1fr', gap: '2rem' }}>
          {/* Left Column - Form */}
          <div>
            {step === 'material' && (
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
                  Choose Your Material
                </h2>
                <MaterialCatalog onSelect={handleMaterialSelect} />
              </div>
            )}

            {step === 'details' && orderData.material && (
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
                  Order Details
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Specification */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#13445C'
                    }}>
                      Specification
                    </label>
                    <select
                      value={orderData.specification}
                      onChange={(e) => setOrderData({ ...orderData, specification: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    >
                      {orderData.material.specifications.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#13445C'
                    }}>
                      Quantity ({orderData.material.unit})
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={orderData.quantity}
                      onChange={(e) => setOrderData({ ...orderData, quantity: parseInt(e.target.value) || 1 })}
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

                  {/* Urgency Level */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#13445C'
                    }}>
                      Delivery Urgency
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                      <UrgencyButton
                        level="standard"
                        label="Standard"
                        subtitle="2-3 days"
                        selected={orderData.urgency === 'standard'}
                        onClick={() => setOrderData({ ...orderData, urgency: 'standard' })}
                      />
                      <UrgencyButton
                        level="priority"
                        label="Priority"
                        subtitle="24 hours"
                        selected={orderData.urgency === 'priority'}
                        onClick={() => setOrderData({ ...orderData, urgency: 'priority' })}
                      />
                      <UrgencyButton
                        level="emergency"
                        label="Emergency"
                        subtitle="Same day"
                        selected={orderData.urgency === 'emergency'}
                        onClick={() => setOrderData({ ...orderData, urgency: 'emergency' })}
                      />
                    </div>
                  </div>

                  {/* Delivery Site */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#13445C'
                    }}>
                      Delivery Site
                    </label>
                    <input
                      type="text"
                      placeholder="Enter site name or address"
                      value={orderData.site}
                      onChange={(e) => setOrderData({ ...orderData, site: e.target.value })}
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

                  {/* Delivery Date */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#13445C'
                    }}>
                      Preferred Delivery Date
                    </label>
                    <input
                      type="date"
                      value={orderData.deliveryDate}
                      onChange={(e) => setOrderData({ ...orderData, deliveryDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
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

                  {/* Special Instructions */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#13445C'
                    }}>
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      placeholder="Any specific delivery instructions..."
                      value={orderData.instructions}
                      onChange={(e) => setOrderData({ ...orderData, instructions: e.target.value })}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '1rem',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                      onClick={() => {
                        setOrderData({ ...orderData, material: null });
                        setStep('material');
                      }}
                      style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        background: 'white',
                        color: '#666',
                        fontWeight: '600',
                        fontSize: '1rem',
                        cursor: 'pointer'
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setStep('review')}
                      disabled={!orderData.site || !orderData.deliveryDate}
                      style={{
                        flex: 2,
                        padding: '1rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: orderData.site && orderData.deliveryDate ? '#F57C00' : '#ccc',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1rem',
                        cursor: orderData.site && orderData.deliveryDate ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Continue to Review →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 'review' && orderData.material && pricing && (
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
                  Review Your Order
                </h2>

                {/* Order Summary */}
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '3rem' }}>{orderData.material.icon}</div>
                    <div>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        color: '#13445C'
                      }}>
                        {orderData.material.name}
                      </h3>
                      <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        {orderData.specification} • {orderData.quantity} {orderData.material.unit}
                      </p>
                    </div>
                  </div>

                  <div style={{ paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
                    <InfoRow label="Delivery Site" value={orderData.site} />
                    <InfoRow label="Delivery Date" value={orderData.deliveryDate} />
                    <InfoRow
                      label="Urgency"
                      value={orderData.urgency.charAt(0).toUpperCase() + orderData.urgency.slice(1)}
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                <div style={{
                  background: '#fff',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#13445C',
                    marginBottom: '1rem'
                  }}>
                    Price Breakdown
                  </h3>
                  <PriceRow label="Material Cost" value={pricing.materialCost} />
                  <PriceRow label="Transport Cost" value={pricing.transportCost} />
                  {pricing.urgencyPremium > 0 && (
                    <PriceRow label="Urgency Premium" value={pricing.urgencyPremium} />
                  )}
                  <PriceRow label="Platform Fee (5%)" value={pricing.platformFee} />
                  <PriceRow label="VAT (16%)" value={pricing.vat} />
                  <div style={{
                    borderTop: '2px solid #13445C',
                    marginTop: '1rem',
                    paddingTop: '1rem'
                  }}>
                    <PriceRow label="TOTAL" value={pricing.total} bold />
                  </div>
                  <div style={{
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginTop: '1rem'
                  }}>
                    <PriceRow label="Deposit (40%)" value={pricing.deposit} color="#F57C00" />
                    <PriceRow label="Balance on Delivery (60%)" value={pricing.balance} color="#666" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => setStep('details')}
                    disabled={isSubmitting}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0',
                      background: 'white',
                      color: '#666',
                      fontWeight: '600',
                      fontSize: '1rem',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ← Edit Order
                  </button>
                  <button
                    onClick={handleCreateOrder}
                    disabled={isSubmitting}
                    style={{
                      flex: 2,
                      padding: '1rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: isSubmitting ? '#ccc' : 'linear-gradient(135deg, #F57C00 0%, #FF9800 100%)',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1rem',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSubmitting ? '⏳ Creating Order...' : `💳 Create Order (KES ${pricing.deposit.toLocaleString()} deposit)`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary (Sticky) */}
          {orderData.material && pricing && (
            <div style={{
              position: 'sticky',
              top: '2rem',
              height: 'fit-content'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: '#13445C',
                  marginBottom: '1rem'
                }}>
                  Order Summary
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontSize: '2rem' }}>{orderData.material.icon}</div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#13445C' }}>
                      {orderData.material.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      {orderData.quantity} {orderData.material.unit}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  color: '#F57C00',
                  textAlign: 'center',
                  padding: '1rem 0',
                  borderTop: '1px solid #e0e0e0'
                }}>
                  KES {pricing.total.toLocaleString()}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: '#666',
                  textAlign: 'center'
                }}>
                  Pay KES {pricing.deposit.toLocaleString()} deposit now
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StepIndicator({ number, title, active, completed }: any) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: completed ? '#4CAF50' : active ? '#F57C00' : '#e0e0e0',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold'
      }}>
        {completed ? '✓' : number}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontWeight: '600',
          color: active ? '#13445C' : '#999',
          fontSize: '0.9rem'
        }}>
          {title}
        </div>
      </div>
    </div>
  );
}

function UrgencyButton({ level, label, subtitle, selected, onClick }: any) {
  const colors: any = {
    standard: '#4CAF50',
    priority: '#FF9800',
    emergency: '#F44336'
  };

  return (
    <button
      onClick={onClick}
      style={{
        padding: '1rem',
        borderRadius: '8px',
        border: `2px solid ${selected ? colors[level] : '#e0e0e0'}`,
        background: selected ? `${colors[level]}15` : 'white',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s'
      }}
    >
      <div style={{
        fontWeight: '600',
        color: selected ? colors[level] : '#666',
        marginBottom: '0.25rem'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '0.75rem',
        color: '#999'
      }}>
        {subtitle}
      </div>
    </button>
  );
}

function InfoRow({ label, value }: any) {
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