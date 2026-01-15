// src/components/orders/OrderForm.tsx
import { useState } from 'react';

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
  specifications: string[];
  available: boolean;
  stock: number;
}

interface OrderFormProps {
  materials: MaterialOption[];
  onSubmit: (data: OrderFormData) => Promise<void>;
  isSubmitting: boolean;
  initialData?: Partial<OrderFormData>;
}

export default function OrderForm({
  materials,
  onSubmit,
  isSubmitting,
  initialData = {}
}: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    materialId: initialData.materialId || '',
    quantity: initialData.quantity || 1,
    urgency: initialData.urgency || 'standard',
    site: initialData.site || '',
    deliveryDate: initialData.deliveryDate || '',
    instructions: initialData.instructions || '',
  });

  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption | null>(
    materials.find(m => m.id === initialData.materialId) || null
  );

  const handleMaterialSelect = (material: MaterialOption) => {
    setSelectedMaterial(material);
    setFormData(prev => ({ ...prev, materialId: material.id }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.materialId) {
      alert('Please select a material');
      return;
    }
    if (!formData.site || !formData.deliveryDate) {
      alert('Please fill all required fields');
      return;
    }
    onSubmit(formData);
  };

  // Helper function to get material icon
  const getMaterialIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'cement': '🏗️',
      'aggregates': '⛰️',
      'steel': '🔩',
      'timber': '🪵',
      'paint': '🎨',
      'roofing': '🏠',
      'plumbing': '🚰',
      'electrical': '⚡',
      'tiles': '◻️',
      'hardware': '🔧'
    };
    return icons[category.toLowerCase()] || '📦';
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Material Selection */}
      {!selectedMaterial && (
        <div style={{ marginBottom: '2rem' }}>
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
            {materials.map((material) => (
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
                  {getMaterialIcon(material.category)}
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
          {/* Selected Material Summary */}
          <div style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ fontSize: '2.5rem' }}>
              {getMaterialIcon(selectedMaterial.category)}
            </div>
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
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
              Maximum available: {selectedMaterial.stock} {selectedMaterial.unit}
            </div>
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
                    marginBottom: '0.25rem'
                  }}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#999' }}>
                    {level === 'standard' ? '2-3 days' : level === 'priority' ? '24 hours' : 'Same day'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Site */}
          <div>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#13445C'
            }}>
              Delivery Site <span style={{ color: '#F44336' }}>*</span>
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
              Delivery Date <span style={{ color: '#F44336' }}>*</span>
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
                fontSize: '1rem',
                outline: 'none'
              }}
            />
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
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !formData.site || !formData.deliveryDate}
            style={{
              padding: '1rem',
              borderRadius: '8px',
              border: 'none',
              background: isSubmitting ? '#ccc' : '#F57C00',
              color: 'white',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              marginTop: '1rem'
            }}
          >
            {isSubmitting ? 'Processing...' : 'Continue to Review'}
          </button>
        </div>
      )}
    </form>
  );
}