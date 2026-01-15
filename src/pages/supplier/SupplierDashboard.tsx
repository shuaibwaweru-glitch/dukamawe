// src/pages/supplier/SupplierDashboard.tsx
import { UserButton, useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SupplierDashboard() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'completed'>('pending');
  const [initError, setInitError] = useState<string | null>(null);
  
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
    const initSupplier = async () => {
      if (isLoaded && user && supplier === null) {
        try {
          console.log("Creating supplier profile for:", user.id);
          await createOrUpdateSupplier({
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || "",
            displayName: user.fullName || user.firstName || "Supplier",
          });
          console.log("Supplier profile created successfully");
        } catch (error) {
          console.error("Failed to create supplier:", error);
          setInitError(error instanceof Error ? error.message : "Unknown error");
        }
      }
    };
    initSupplier();
  }, [isLoaded, user, supplier, createOrUpdateSupplier]);

  // Show loading while Clerk is authenticating
  if (!isLoaded) {
    return (
      <div style={{ 
        padding: '3rem', 
        textAlign: 'center',
        fontSize: '1.1rem',
        color: '#666'
      }}>
        <div style={{ marginBottom: '1rem' }}>🔐 Authenticating with Clerk...</div>
        <div style={{ fontSize: '0.9rem', color: '#999' }}>Please wait</div>
      </div>
    );
  }

  // Show loading while checking for supplier profile
  if (!user) {
    return (
      <div style={{ 
        padding: '3rem', 
        textAlign: 'center',
        fontSize: '1.1rem',
        color: '#666'
      }}>
        <div>Please log in to continue</div>
        <button 
          onClick={() => window.location.href = '/sign-in'}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Show loading while supplier query is running
  if (supplier === undefined) {
    return (
      <div style={{ 
        padding: '3rem', 
        textAlign: 'center',
        fontSize: '1.1rem',
        color: '#666'
      }}>
        <div style={{ marginBottom: '1rem' }}>📦 Loading supplier profile...</div>
        <div style={{ fontSize: '0.9rem', color: '#999' }}>Almost there</div>
      </div>
    );
  }

  // If supplier is null, show retry option
  if (supplier === null) {
    return (
      <div style={{ 
        padding: '3rem', 
        textAlign: 'center',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>
          {initError ? '❌ Setup Failed' : '⏳ Setting up your supplier account...'}
        </h2>
        {initError && (
          <div style={{ 
            padding: '1rem',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            color: '#c33'
          }}>
            <strong>Error:</strong> {initError}
          </div>
        )}
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          {initError 
            ? 'Please try again or contact support if the problem persists.' 
            : 'Creating your profile... This should only take a moment.'}
        </p>
        <button 
          onClick={() => {
            setInitError(null);
            window.location.reload();
          }}
          style={{
            padding: '0.75rem 2rem',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Retry Setup
        </button>
      </div>
    );
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
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111' }}>
            📦 Supplier Dashboard
          </h1>
          <span style={{ 
            padding: '0.25rem 0.75rem',
            background: '#dbeafe',
            color: '#1e40af',
            borderRadius: '1rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {supplier.businessName}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#666', fontSize: '0.875rem' }}>
            {user.primaryEmailAddress?.emailAddress}
          </span>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </header>

      <main style={{ padding: '2rem' }}>
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Pending Orders - Highlighted */}
          <div style={{
            background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transform: 'scale(1.02)',
          }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              Pending Orders
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              {stats?.pendingOrders || 0}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.5rem' }}>
              ⏰ Awaiting your response
            </div>
          </div>

          {/* Active Orders */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
              Active Orders
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111' }}>
              {stats?.activeOrders || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.5rem' }}>
              🚚 In Progress
            </div>
          </div>

          {/* Today's Orders */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
              Today's Orders
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111' }}>
              {stats?.todayOrders || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#2563eb', marginTop: '0.5rem' }}>
              📅 New Today
            </div>
          </div>

          {/* Total Revenue */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
              Total Revenue
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111' }}>
              KES {(stats?.totalRevenue || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.5rem' }}>
              💰 All Time
            </div>
          </div>

          {/* Completion Rate */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
              Completion Rate
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111' }}>
              {stats?.completionRate?.toFixed(1) || 0}%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#8b5cf6', marginTop: '0.5rem' }}>
              ✅ Performance
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          background: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '1rem',
            borderBottom: '2px solid #f3f4f6',
            marginBottom: '1.5rem',
          }}>
            {(['pending', 'active', 'completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeTab === tab ? '3px solid #2563eb' : '3px solid transparent',
                  color: activeTab === tab ? '#2563eb' : '#666',
                  fontWeight: activeTab === tab ? '600' : '400',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                }}
              >
                {tab}
                {tab === 'pending' && stats?.pendingOrders ? (
                  <span style={{
                    marginLeft: '0.5rem',
                    padding: '0.125rem 0.5rem',
                    background: '#f97316',
                    color: 'white',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    {stats.pendingOrders}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!currentOrders || currentOrders.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem',
                color: '#999'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <div style={{ fontSize: '1.1rem', color: '#666' }}>
                  No {activeTab} orders
                </div>
                <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  {activeTab === 'pending' && 'New orders will appear here'}
                  {activeTab === 'active' && 'Accepted orders will appear here'}
                  {activeTab === 'completed' && 'Delivered orders will appear here'}
                </div>
              </div>
            ) : (
              currentOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => navigate(`/supplier/orders/${order._id}`)}
                  style={{
                    padding: '1.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    ':hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      borderColor: '#2563eb'
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ 
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#111'
                        }}>
                          {order.orderNumber}
                        </span>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: 
                            order.status === 'pending_supplier' ? '#fef3c7' :
                            order.status === 'accepted' ? '#dbeafe' :
                            order.status === 'preparing' ? '#fde68a' :
                            order.status === 'loaded' ? '#a7f3d0' :
                            '#dcfce7',
                          color:
                            order.status === 'pending_supplier' ? '#92400e' :
                            order.status === 'accepted' ? '#1e40af' :
                            order.status === 'preparing' ? '#78350f' :
                            order.status === 'loaded' ? '#065f46' :
                            '#166534',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {order.status.replace('_', ' ')}
                        </span>
                        {order.urgency !== 'normal' && (
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            background: order.urgency === 'priority' ? '#fef3c7' : '#fee2e2',
                            color: order.urgency === 'priority' ? '#92400e' : '#991b1b',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {order.urgency === 'priority' ? '⚡ Priority' : '🚨 Emergency'}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111', marginBottom: '0.5rem' }}>
                        {order.material.name} - {order.material.quantity} {order.material.unit}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                        <div>👤 {order.buyer.name}</div>
                        <div>📍 {order.delivery.siteName}</div>
                        <div>💰 KES {order.pricing.total.toLocaleString()}</div>
                        <div>📏 {order.delivery.distance?.toFixed(1)}km away</div>
                      </div>

                      {order.buyer.phone && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#2563eb' }}>
                          📞 {order.buyer.phone}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/supplier/orders/${order._id}`);
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Inventory Summary (if available) */}
        {inventory && inventory.length > 0 && (
          <div style={{
            marginTop: '2rem',
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111' }}>
              📦 Inventory Summary
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {inventory.slice(0, 6).map((item) => (
                <div key={item._id} style={{ 
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  background: item.available ? '#f0fdf4' : '#fef2f2'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
                    {item.material?.name || 'Unknown Material'}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111' }}>
                    {item.currentStock} {item.material?.unit || 'units'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: item.available ? '#16a34a' : '#dc2626', marginTop: '0.25rem' }}>
                    {item.available ? '✓ Available' : '✗ Low Stock'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}