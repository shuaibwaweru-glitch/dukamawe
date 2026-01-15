// src/pages/supplier/SupplierDashboard.tsx
import { UserButton, useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SupplierDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'completed'>('pending');
  
  const createOrUpdateSupplier = useMutation(api.suppliers.mutations.createOrUpdateSupplier);
  
  // Get supplier data
  const supplier = useQuery(
    api.suppliers.queries.getSupplierByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const stats = useQuery(
    api.suppliers.queries.getSupplierStats,
    supplier?._id ? { supplierId: supplier._id } : "skip"
  );

  const pendingOrders = useQuery(
    api.suppliers.queries.getSupplierOrders,
    supplier?._id ? { supplierId: supplier._id, status: "pending_supplier" } : "skip"
  );

  const activeOrders = useQuery(
    api.suppliers.queries.getSupplierOrders,
    supplier?._id ? { 
      supplierId: supplier._id, 
      status: undefined 
    } : "skip"
  );

  const inventory = useQuery(
    api.suppliers.queries.getSupplierInventory,
    supplier?._id ? { supplierId: supplier._id } : "skip"
  );

  // Create supplier profile on first login
  useEffect(() => {
    if (user && !supplier) {
      createOrUpdateSupplier({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        displayName: user.fullName || user.firstName || "Supplier",
      });
    }
  }, [user, supplier, createOrUpdateSupplier]);

  if (!user || !supplier) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  const filteredActiveOrders = activeOrders?.filter(order => 
    ['accepted', 'preparing', 'loaded', 'in_transit'].includes(order.status)
  );

  const completedOrders = activeOrders?.filter(order => 
    order.status === 'delivered'
  );

  const currentOrders = activeTab === 'pending' 
    ? pendingOrders 
    : activeTab === 'active' 
    ? filteredActiveOrders 
    : completedOrders;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F57C00 0%, #13445C 100%)',
      padding: '0'
    }}>
      {/* Top Navigation */}
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
            DUKAMAWE Supplier
          </h1>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: '#F57C00', fontWeight: '600', textDecoration: 'none' }}>Dashboard</a>
            <a href="#" style={{ color: '#666', fontWeight: '500', textDecoration: 'none' }}>Inventory</a>
            <a href="#" style={{ color: '#666', fontWeight: '500', textDecoration: 'none' }}>Drivers</a>
            <a href="#" style={{ color: '#666', fontWeight: '500', textDecoration: 'none' }}>Reports</a>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            {supplier.businessName}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#13445C',
                marginBottom: '0.5rem'
              }}>
                Welcome back, {supplier.businessName}! 👋
              </h2>
              <p style={{ color: '#666', fontSize: '1rem' }}>
                Status: <span style={{
                  background: supplier.verified ? '#4CAF50' : '#FF9800',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  {supplier.verified ? '✓ VERIFIED' : 'PENDING VERIFICATION'}
                </span>
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>⭐</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F57C00' }}>
                {supplier.rating.toFixed(1)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>
                {supplier.totalRatings} reviews
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard 
            title="Pending Orders"
            value={stats?.pendingOrders || 0}
            icon="⏳"
            color="#FF9800"
            highlight={true}
          />
          <StatCard 
            title="Active Orders"
            value={stats?.activeOrders || 0}
            icon="🚚"
            color="#2196F3"
          />
          <StatCard 
            title="Today's Orders"
            value={stats?.todayOrders || 0}
            icon="📅"
            color="#9C27B0"
          />
          <StatCard 
            title="Total Revenue"
            value={`KES ${(stats?.totalRevenue || 0).toLocaleString()}`}
            icon="💰"
            color="#4CAF50"
          />
          <StatCard 
            title="Completion Rate"
            value={`${(stats?.completionRate || 0).toFixed(0)}%`}
            icon="✅"
            color="#13445C"
          />
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem'
        }}>
          {/* Orders Section */}
          <div>
            {/* Tab Navigation */}
            <div style={{
              background: 'white',
              borderRadius: '16px 16px 0 0',
              padding: '1rem 2rem 0',
              display: 'flex',
              gap: '2rem',
              borderBottom: '2px solid #e0e0e0'
            }}>
              <TabButton
                label="Pending"
                count={pendingOrders?.length || 0}
                active={activeTab === 'pending'}
                onClick={() => setActiveTab('pending')}
                color="#FF9800"
              />
              <TabButton
                label="Active"
                count={filteredActiveOrders?.length || 0}
                active={activeTab === 'active'}
                onClick={() => setActiveTab('active')}
                color="#2196F3"
              />
              <TabButton
                label="Completed"
                count={completedOrders?.length || 0}
                active={activeTab === 'completed'}
                onClick={() => setActiveTab('completed')}
                color="#4CAF50"
              />
            </div>

            {/* Orders List */}
            <div style={{
              background: 'white',
              borderRadius: '0 0 16px 16px',
              padding: '2rem',
              minHeight: '500px'
            }}>
              {currentOrders && currentOrders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {currentOrders.map(order => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      onViewDetails={() => navigate(`/supplier/orders/${order._id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '4rem',
                  color: '#999'
                }}>
                  <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</p>
                  <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    No {activeTab} orders
                  </p>
                  <p style={{ fontSize: '0.9rem' }}>
                    {activeTab === 'pending' 
                      ? 'New orders will appear here for you to accept or reject'
                      : `You don't have any ${activeTab} orders right now`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Quick Actions */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#13445C',
                marginBottom: '1rem'
              }}>
                Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <ActionButton icon="📦" text="Manage Inventory" onClick={() => alert('Coming soon!')} />
                <ActionButton icon="👷" text="Manage Drivers" onClick={() => alert('Coming soon!')} />
                <ActionButton icon="📊" text="View Reports" onClick={() => alert('Coming soon!')} />
              </div>
            </div>

            {/* Inventory Summary */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#13445C',
                marginBottom: '1rem'
              }}>
                Inventory
              </h3>
              {inventory && inventory.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {inventory.slice(0, 5).map(item => (
                    <InventoryItem
                      key={item._id}
                      name={item.material?.name || 'Unknown'}
                      stock={item.currentStock}
                      unit={item.material?.unit || 'units'}
                      lowStock={item.currentStock < item.minimumStock}
                    />
                  ))}
                </div>
              ) : (
                <p style={{ color: '#999', fontSize: '0.9rem' }}>
                  No inventory items yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon, color, highlight }: any) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: highlight ? '0 4px 20px rgba(255,152,0,0.3)' : '0 2px 10px rgba(0,0,0,0.08)',
      borderLeft: `4px solid ${color}`,
      border: highlight ? `2px solid ${color}` : undefined
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

function TabButton({ label, count, active, onClick, color }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '1rem 0',
        border: 'none',
        background: 'transparent',
        borderBottom: active ? `3px solid ${color}` : '3px solid transparent',
        color: active ? color : '#666',
        fontWeight: active ? '600' : '500',
        fontSize: '1rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.2s'
      }}
    >
      {label}
      {count > 0 && (
        <span style={{
          background: active ? color : '#e0e0e0',
          color: active ? 'white' : '#666',
          padding: '0.25rem 0.5rem',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          {count}
        </span>
      )}
    </button>
  );
}

function OrderCard({ order, onViewDetails }: any) {
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
      padding: '1.5rem',
      border: '2px solid #f0f0f0',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
    onClick={onViewDetails}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = '#F57C00';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(245,124,0,0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#f0f0f0';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#13445C', marginBottom: '0.25rem' }}>
            #{order.orderNumber}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            {new Date(order.timeline.createdAt).toLocaleString()}
          </div>
        </div>
        <span style={{
          background: getStatusColor(order.status),
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '12px',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          height: 'fit-content'
        }}>
          {order.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.25rem' }}>MATERIAL</div>
          <div style={{ fontWeight: '600', color: '#13445C' }}>
            {order.material.name}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            {order.material.quantity} {order.material.unit}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.25rem' }}>BUYER</div>
          <div style={{ fontWeight: '600', color: '#13445C' }}>
            {order.buyer.name}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            {order.buyer.site.name}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.25rem' }}>AMOUNT</div>
          <div style={{ fontWeight: '600', color: '#F57C00', fontSize: '1.25rem' }}>
            KES {order.pricing.total.toLocaleString()}
          </div>
        </div>
      </div>

      {order.urgency.level !== 'standard' && (
        <div style={{
          background: order.urgency.level === 'emergency' ? '#FFEBEE' : '#FFF3E0',
          color: order.urgency.level === 'emergency' ? '#C62828' : '#E65100',
          padding: '0.5rem',
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          🔥 {order.urgency.level.toUpperCase()} DELIVERY
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
        <span>📍 Distance: {order.supplier?.distance ? `${order.supplier.distance.toFixed(1)} km` : 'N/A'}</span>
        <span>•</span>
        <span>📞 {order.buyer.phone}</span>
      </div>
    </div>
  );
}

function ActionButton({ icon, text, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem',
        borderRadius: '8px',
        border: '2px solid #e0e0e0',
        background: 'white',
        color: '#333',
        fontWeight: '600',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        width: '100%'
      }}
    >
      <span style={{ fontSize: '1.25rem' }}>{icon}</span>
      <span>{text}</span>
    </button>
  );
}

function InventoryItem({ name, stock, unit, lowStock }: any) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.75rem',
      background: lowStock ? '#FFEBEE' : '#f8f9fa',
      borderRadius: '8px',
      fontSize: '0.875rem'
    }}>
      <span style={{ fontWeight: '600', color: '#13445C' }}>{name}</span>
      <span style={{ color: lowStock ? '#C62828' : '#666' }}>
        {stock} {unit} {lowStock && '⚠️'}
      </span>
    </div>
  );
}