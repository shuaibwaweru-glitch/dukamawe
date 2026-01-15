// src/pages/profile/SetupBuyer.tsx
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SetupBuyer() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const createBuyer = useMutation(api.buyers.mutations.createOrUpdateBuyer);
  
  const handleSetup = async () => {
    if (!user) {
      alert('Please log in first!');
      return;
    }

    setIsLoading(true);
    setResult('');
    
    try {
      const response = await createBuyer({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        displayName: user.fullName || user.firstName || "Buyer",
        phone: user.primaryPhoneNumber?.phoneNumber,
      });
      
      setResult(JSON.stringify(response, null, 2));
      alert('✅ Buyer profile created successfully! You can now create orders.');
      
      // Redirect to create order page
      setTimeout(() => {
        navigate('/orders/create');
      }, 1000);
    } catch (error) {
      setResult(`Error: ${error}`);
      alert('❌ Error creating buyer profile: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
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
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', color: '#13445C', marginBottom: '1rem' }}>
            Please Log In
          </h1>
          <p style={{ color: '#666' }}>You need to be logged in to set up your buyer profile.</p>
        </div>
      </div>
    );
  }

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
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem'
        }}>
          👤
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#13445C',
          marginBottom: '1rem'
        }}>
          Create Buyer Profile
        </h1>
        
        <p style={{
          color: '#666',
          marginBottom: '2rem',
          fontSize: '1rem'
        }}>
          Click below to create your buyer profile so you can start placing orders.
        </p>

        {/* User Info Display */}
        <div style={{
          background: '#f5f5f5',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#13445C' }}>
            Your Information:
          </h3>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Name:</strong> {user.fullName || user.firstName || 'Not provided'}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Email:</strong> {user.primaryEmailAddress?.emailAddress || 'Not provided'}
            </div>
            <div>
              <strong>Phone:</strong> {user.primaryPhoneNumber?.phoneNumber || 'Not provided'}
            </div>
          </div>
        </div>

        <button
          onClick={handleSetup}
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
            marginBottom: '1rem',
            width: '100%'
          }}
        >
          {isLoading ? '⏳ Creating Profile...' : '✓ Create Buyer Profile'}
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            background: 'white',
            color: '#666',
            fontSize: '0.9rem',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          ← Back to Dashboard
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
            marginTop: '1.5rem',
            maxHeight: '200px',
            overflow: 'auto'
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
          color: '#1976d2',
          textAlign: 'left'
        }}>
          <strong>ℹ️ What this does:</strong>
          <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
            <li>Creates your buyer account in the database</li>
            <li>Links it to your Clerk login</li>
            <li>Enables you to place orders</li>
            <li>Only needs to be done once!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}