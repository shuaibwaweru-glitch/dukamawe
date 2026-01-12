import { UserButton, useUser } from "@clerk/clerk-react";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F57C00 0%, #13445C 100%)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #f0f0f0'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#13445C',
              marginBottom: '0.5rem'
            }}>
              DUKAMAWE Dashboard
            </h1>
            <p style={{ color: '#666' }}>
              Construction Materials Logistics Platform
            </p>
          </div>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #F57C00 0%, #13445C 100%)',
          padding: '2rem',
          borderRadius: '12px',
          color: 'white',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Welcome back, {user?.firstName || 'User'}! 👋
          </h2>
          <p>Your account is ready. Authentication is working perfectly!</p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '2px solid #e9ecef'
          }}>
            <h3 style={{ color: '#F57C00', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              ✅ Authentication Working
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Clerk + Convex integration successful
            </p>
          </div>
          
          <div style={{
            padding: '1.5rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '2px solid #e9ecef'
          }}>
            <h3 style={{ color: '#13445C', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              🚀 Next Steps
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Ready to build order creation & tracking
            </p>
          </div>
          
          <div style={{
            padding: '1.5rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '2px solid #e9ecef'
          }}>
            <h3 style={{ color: '#F57C00', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              📦 Database Ready
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Convex schema deployed and ready
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}