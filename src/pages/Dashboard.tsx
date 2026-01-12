import { UserButton, useUser } from "@clerk/clerk-react";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F57C00 0%, #13445C 100%)',
      padding: '0'
    }}>
      {/* Top Navigation Bar */}
      <nav style={{
        background: 'white',
        borderBottom: '2px solid #e0e0e0',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: '#13445C',
            margin: 0
          }}>
            DUKAMAWE
          </h1>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: '#F57C00', fontWeight: '600', textDecoration: 'none' }}>Dashboard</a>
            <a href="#" style={{ color: '#666', fontWeight: '500', textDecoration: 'none' }}>Orders</a>
            <a href="#" style={{ color: '#666', fontWeight: '500', textDecoration: 'none' }}>Sites</a>
            <a href="#" style={{ color: '#666', fontWeight: '500', textDecoration: 'none' }}>History</a>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            {user?.firstName || 'User'}
          </span>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Welcome Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#13445C',
            marginBottom: '0.5rem'
          }}>
            Welcome back, {user?.firstName}! 👋
          </h2>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            Your account is ready. Authentication is working perfectly!
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard title="Active Orders" value="0" icon="📦" color="#F57C00" />
          <StatCard title="Total Spent" value="KES 0" icon="💰" color="#13445C" />
          <StatCard title="Sites" value="0" icon="📍" color="#4CAF50" />
          <StatCard title="Deliveries" value="0" icon="🚚" color="#2196F3" />
        </div>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem'
        }}>
          {/* Left Column - Main Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Quick Actions */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#13445C',
                marginBottom: '1.5rem'
              }}>
                Quick Actions
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <ActionButton icon="➕" text="New Order" primary />
                <ActionButton icon="📍" text="Add Site" />
                <ActionButton icon="📅" text="Schedule Delivery" />
                <ActionButton icon="📊" text="View Reports" />
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#13445C',
                marginBottom: '1.5rem'
              }}>
                Recent Orders
              </h3>
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#999'
              }}>
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</p>
                <p style={{ marginBottom: '1rem' }}>No orders yet</p>
                <button style={{
                  background: '#F57C00',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}>
                  Create Your First Order
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Status Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* System Status */}
            <StatusCard
              title="✅ Authentication Working"
              description="Clerk + Convex integration successful"
              color="#4CAF50"
            />
            <StatusCard
              title="🚀 Next Steps"
              description="Ready to build order creation & tracking"
              color="#2196F3"
            />
            <StatusCard
              title="📦 Database Ready"
              description="Convex schema deployed and ready"
              color="#F57C00"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon, color }: any) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ 
        fontSize: '1.75rem', 
        fontWeight: 'bold', 
        color: color,
        marginBottom: '0.25rem'
      }}>
        {value}
      </div>
      <div style={{ color: '#666', fontSize: '0.875rem' }}>{title}</div>
    </div>
  );
}

function ActionButton({ icon, text, primary = false }: any) {
  return (
    <button style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem',
      borderRadius: '10px',
      border: primary ? 'none' : '2px solid #e0e0e0',
      background: primary ? 'linear-gradient(135deg, #F57C00 0%, #FF9800 100%)' : 'white',
      color: primary ? 'white' : '#333',
      fontWeight: '600',
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      width: '100%'
    }}>
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <span>{text}</span>
    </button>
  );
}

function StatusCard({ title, description, color }: any) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      borderTop: `4px solid ${color}`
    }}>
      <h4 style={{ 
        color: color, 
        fontWeight: 'bold', 
        marginBottom: '0.5rem',
        fontSize: '1.1rem'
      }}>
        {title}
      </h4>
      <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5' }}>
        {description}
      </p>
    </div>
  );
}