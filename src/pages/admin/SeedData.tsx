// src/pages/admin/SeedData.tsx
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useState } from 'react';

export default function SeedData() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const seedMaterials = useMutation(api.seed.default);
  
  const handleSeed = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      const response = await seedMaterials({});
      setResult(JSON.stringify(response, null, 2));
      alert('Materials seeded successfully! Refresh the create order page.');
    } catch (error) {
      setResult(`Error: ${error}`);
      alert('Error seeding materials: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F57C00 0%, #13445C 100%)',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '3rem',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#13445C',
          marginBottom: '1rem'
        }}>
          🗄️ Database Setup
        </h1>
        
        <p style={{
          color: '#666',
          marginBottom: '2rem',
          fontSize: '1rem'
        }}>
          Click the button below to add initial materials to the database.
          This only needs to be done once.
        </p>

        <button
          onClick={handleSeed}
          disabled={isLoading}
          style={{
            padding: '1rem 2rem',
            borderRadius: '8px',
            border: 'none',
            background: isLoading ? '#ccc' : '#F57C00',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginBottom: '2rem',
            width: '100%'
          }}
        >
          {isLoading ? '⏳ Seeding Materials...' : '🚀 Seed Materials'}
        </button>

        {result && (
          <div style={{
            background: '#f5f5f5',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'left',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            marginTop: '1rem'
          }}>
            {result}
          </div>
        )}

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#e3f2fd',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#1976d2'
        }}>
          <strong>ℹ️ Note:</strong> This will add 2 materials:
          <ul style={{ textAlign: 'left', marginTop: '0.5rem' }}>
            <li>Portland Cement (500 bags)</li>
            <li>Crushed Stone Aggregate (200 tons)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}