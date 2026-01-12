// src/components/MaterialCatalog.tsx
import { useState } from 'react';

interface Material {
  id: string;
  name: string;
  category: string;
  icon: string;
  basePrice: number;
  unit: string;
  description: string;
  specifications: string[];
}

const MATERIALS: Material[] = [
  {
    id: 'cement',
    name: 'Cement',
    category: 'Binding Materials',
    icon: '🏗️',
    basePrice: 850,
    unit: 'bag (50kg)',
    description: 'High-quality Portland cement',
    specifications: ['Grade 32.5', 'Grade 42.5', 'Grade 52.5']
  },
  {
    id: 'sand',
    name: 'Building Sand',
    category: 'Aggregates',
    icon: '🏖️',
    basePrice: 3500,
    unit: 'tonne',
    description: 'Fine construction sand',
    specifications: ['Coarse', 'Medium', 'Fine']
  },
  {
    id: 'ballast',
    name: 'Ballast',
    category: 'Aggregates',
    icon: '🪨',
    basePrice: 3000,
    unit: 'tonne',
    description: 'Mixed aggregate for concrete',
    specifications: ['20mm', '40mm', 'Mixed']
  },
  {
    id: 'hardcore',
    name: 'Hardcore',
    category: 'Aggregates',
    icon: '⛰️',
    basePrice: 2500,
    unit: 'tonne',
    description: 'Crushed stone for foundations',
    specifications: ['Type 1', 'Type 2']
  },
  {
    id: 'bricks',
    name: 'Bricks',
    category: 'Masonry',
    icon: '🧱',
    basePrice: 25,
    unit: 'piece',
    description: 'Standard construction bricks',
    specifications: ['Red clay', 'Concrete', 'Engineering']
  },
  {
    id: 'blocks',
    name: 'Concrete Blocks',
    category: 'Masonry',
    icon: '⬜',
    basePrice: 95,
    unit: 'piece',
    description: 'Hollow concrete blocks',
    specifications: ['4 inch', '6 inch', '9 inch']
  },
  {
    id: 'timber',
    name: 'Timber',
    category: 'Wood Products',
    icon: '🌲',
    basePrice: 850,
    unit: 'piece',
    description: 'Construction grade timber',
    specifications: ['2x4', '2x6', '4x4', '6x6']
  },
  {
    id: 'iron-sheets',
    name: 'Iron Sheets',
    category: 'Roofing',
    icon: '🏠',
    basePrice: 950,
    unit: 'sheet',
    description: 'Corrugated roofing sheets',
    specifications: ['Gauge 28', 'Gauge 30', 'Gauge 32']
  },
  {
    id: 'steel-bars',
    name: 'Steel Bars (Rebar)',
    category: 'Reinforcement',
    icon: '🔩',
    basePrice: 120000,
    unit: 'tonne',
    description: 'Reinforcement steel bars',
    specifications: ['Y8', 'Y10', 'Y12', 'Y16', 'Y20']
  },
  {
    id: 'mesh-wire',
    name: 'Mesh Wire',
    category: 'Reinforcement',
    icon: '🕸️',
    basePrice: 3500,
    unit: 'roll',
    description: 'Welded wire mesh',
    specifications: ['BRC A142', 'BRC A193', 'BRC A252']
  },
  {
    id: 'paint',
    name: 'Paint',
    category: 'Finishing',
    icon: '🎨',
    basePrice: 2500,
    unit: '20L tin',
    description: 'Interior/exterior paint',
    specifications: ['Emulsion', 'Gloss', 'Primer']
  },
  {
    id: 'tiles',
    name: 'Floor Tiles',
    category: 'Finishing',
    icon: '⬛',
    basePrice: 1800,
    unit: 'sqm',
    description: 'Ceramic floor tiles',
    specifications: ['30x30cm', '40x40cm', '60x60cm']
  }
];

interface MaterialCatalogProps {
  onSelect: (material: Material) => void;
}

export default function MaterialCatalog({ onSelect }: MaterialCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...new Set(MATERIALS.map(m => m.category))];

  const filteredMaterials = MATERIALS.filter(material => {
    const matchesCategory = selectedCategory === 'All' || material.category === selectedCategory;
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="🔍 Search materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '2px solid #e0e0e0',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem'
      }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '2px solid',
              borderColor: selectedCategory === category ? '#F57C00' : '#e0e0e0',
              background: selectedCategory === category ? '#F57C00' : 'white',
              color: selectedCategory === category ? 'white' : '#666',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Materials Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredMaterials.map(material => (
          <MaterialCard
            key={material.id}
            material={material}
            onSelect={() => onSelect(material)}
          />
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#999'
        }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
          <p>No materials found matching your search</p>
        </div>
      )}
    </div>
  );
}

function MaterialCard({ material, onSelect }: { material: Material; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: '2px solid transparent'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#F57C00';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(245,124,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
      }}
    >
      {/* Icon & Category */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div style={{ fontSize: '2.5rem' }}>{material.icon}</div>
        <span style={{
          fontSize: '0.75rem',
          color: '#666',
          background: '#f5f5f5',
          padding: '0.25rem 0.75rem',
          borderRadius: '12px'
        }}>
          {material.category}
        </span>
      </div>

      {/* Material Name */}
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#13445C',
        marginBottom: '0.5rem'
      }}>
        {material.name}
      </h3>

      {/* Description */}
      <p style={{
        color: '#666',
        fontSize: '0.875rem',
        marginBottom: '1rem',
        lineHeight: '1.4'
      }}>
        {material.description}
      </p>

      {/* Price */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid #f0f0f0'
      }}>
        <div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#F57C00'
          }}>
            KES {material.basePrice.toLocaleString()}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#999'
          }}>
            per {material.unit}
          </div>
        </div>
        <button style={{
          background: '#F57C00',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          fontWeight: '600',
          fontSize: '0.875rem',
          cursor: 'pointer'
        }}>
          Select
        </button>
      </div>

      {/* Specifications Preview */}
      {material.specifications.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#999',
            marginBottom: '0.25rem'
          }}>
            Available:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {material.specifications.slice(0, 3).map((spec, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.7rem',
                  background: '#f5f5f5',
                  color: '#666',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '8px'
                }}
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { MATERIALS };
export type { Material };