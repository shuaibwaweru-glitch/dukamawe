// src/pages/orders/CreateOrder.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

// Inline OrderForm component to avoid import issues
interface OrderFormData {
  materialId: string;
  quantity: number;
  urgency: 'standard' | 'priority' | 'emergency';
  site: string;
  deliveryDate: string;
  instructions: string;
}

interface MaterialOption {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  basePrice: number;
  available: boolean;
  stock: number;
}

export default function CreateOrder() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'review'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption | null>(null);
  const [formData, setFormData] = useState<OrderFormData>({
    materialId: '',
    quantity: 1,
    urgency: 'standard',
    site: '',
    deliveryDate: '',
    instructions: '',
  });

  // Auto-create buyer profile
  const createOrUpdateBuyer = useMutation(api.buyers.mutations.createOrUpdateBuyer);
  
  useEffect(() => {
    const initBuyer = async () => {
      if (user) {
        try {
          await createOrUpdateBuyer({
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || "",
            displayName: user.fullName || user.firstName || "Buyer",
            phone: user.primaryPhoneNumber?.phoneNumber,
          });
        } catch (error) {
          console.error("Failed to create buyer:", error);
        }
      }
    };
    initBuyer();
  }, [user, createOrUpdateBuyer]);

  // Get materials
  const materials = useQuery(api.orders.create.getMaterialsWithPricing, {
    siteLatitude: -1.286389,
    siteLongitude: 36.817223,
  });

  const createOrder = useMutation(api.orders.create.createOrder);

  const handleMaterialSelect = (material: MaterialOption) => {
    setSelectedMaterial(material);
    setFormData(prev => ({ ...prev, materialId: material.id }));
  };

  const handleConfirmOrder = async () => {
    if (!user || !formData.materialId || !formData.site || !formData.deliveryDate) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createOrder({
        buyerClerkId: user.id,
        materialId: formData.materialId,
        quantity: formData.quantity,
        siteAddress: formData.site,
        siteName: formData.site,
        deliveryDate: formData.deliveryDate,
        urgencyLevel: formData.urgency,
        instructions: formData.instructions || "",
        siteLatitude: -1.286389,
        siteLongitude: 36.817223,
      });

      alert(`✅ Order created successfully! Order #${result.orderNumber}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('❌ Failed to create order: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading user data...</div>;
  }

  if (!materials) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading materials...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F57C00 0%, #13445C 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
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
              Step {step === 'form' ? '1-2' : '3'} of 3
            </p>
          </div>
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
            ← Back to Dashboard
          </button>
        </div>

        {/* Main Content */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem'
        }}>
          {step === 'form' && (
            <>
              {/* Material Selection */}
              {!selectedMaterial && (
                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#13445C',
                    marginBottom: '1rem'
                  }}>
                    Select Material
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1rem'
                  }}>
                    {materials.map((material: MaterialOption) => (
                      <div
                        key={material.id}
                        onClick={() => material.available && handleMaterialSelect(material)}
                        style={{
                          background: '#f8f9fa',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          cursor: material.available ? 'pointer' : 'not-allowed',
                          opacity: material.available ? 1 : 0.5,
                          border: '2px solid transparent',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (material.available) {
                            e.currentTarget.style.borderColor = '#F57C00';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'transparent';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                          🏗️
                        </div>
                        <h4 style={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          color: '#13445C',
                          marginBottom: '0.5rem'
                        }}>
                          {material.name}
                        </h4>
                        <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                          {material.description}
                        </p>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          color: '#F57C00',
                          marginBottom: '0.5rem'
                        }}>
                          KES {material.basePrice.toLocaleString()} / {material.unit}
                        </div>
                        {material.available ? (
                          <div style={{ color: '#4CAF50', fontSize: '0.8rem' }}>
                            ✓ Available • Stock: {material.stock}
                          </div>
                        ) : (
                          <div style={{ color: '#F44336', fontSize: '0.8rem' }}>
                            ✗ Out of stock
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Details Form */}
              {selectedMaterial && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Selected Material */}
                  <div style={{
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{ fontSize: '2.5rem' }}>🏗️</div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#13445C' }}>
                        {selectedMaterial.name}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        {selectedMaterial.description}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedMaterial(null)}
                      style={{
                        marginLeft: 'auto',
                        background: 'none',
                        border: '1px solid #e0e0e0',
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.85rem',
                        color: '#666',
                        cursor: 'pointer'
                      }}
                    >
                      Change Material
                    </button>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#13445C'
                    }}>
                      Quantity ({selectedMaterial.unit})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedMaterial.stock}
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  {/* Site */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#13445C'
                    }}>
                      Delivery Site *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter site name or address"
                      value={formData.site}
                      onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '1rem'
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
                      Delivery Date *
                    </label>
                    <input
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  {/* Urgency */}
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
                      {(['standard', 'priority', 'emergency'] as const).map((level) => (
                        <button
                          type="button"
                          key={level}
                          onClick={() => setFormData({ ...formData, urgency: level })}
                          style={{
                            padding: '1rem',
                            borderRadius: '8px',
                            border: `2px solid ${formData.urgency === level ? '#F57C00' : '#e0e0e0'}`,
                            background: formData.urgency === level ? '#FFF3E0' : 'white',
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          <div style={{
                            fontWeight: '600',
                            color: formData.urgency === level ? '#F57C00' : '#666',
                            textTransform: 'capitalize'
                          }}>
                            {level}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
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
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '1rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={() => setStep('review')}
                    disabled={!formData.site || !formData.deliveryDate}
                    style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: (!formData.site || !formData.deliveryDate) ? '#ccc' : '#F57C00',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1rem',
                      cursor: (!formData.site || !formData.deliveryDate) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Continue to Review →
                  </button>
                </div>
              )}
            </>
          )}

          {step === 'review' && selectedMaterial && (
            <div>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><strong>Material:</strong> {selectedMaterial.name}</div>
                  <div><strong>Quantity:</strong> {formData.quantity} {selectedMaterial.unit}</div>
                  <div><strong>Site:</strong> {formData.site}</div>
                  <div><strong>Date:</strong> {formData.deliveryDate}</div>
                  <div><strong>Urgency:</strong> {formData.urgency}</div>
                  <div><strong>Price:</strong> KES {(selectedMaterial.basePrice * formData.quantity * 1.21).toFixed(0)}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setStep('form')}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    background: 'white',
                    color: '#13445C',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ← Edit Order
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={isSubmitting}
                  style={{
                    flex: 2,
                    padding: '1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: isSubmitting ? '#ccc' : '#F57C00',
                    color: 'white',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? '⏳ Creating Order...' : '✓ Confirm & Create Order'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}