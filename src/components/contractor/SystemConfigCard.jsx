import React from 'react';
import { useCart } from '../../context/CartContext';
import { useContractorContext } from '../../context/ContractorContext';

const TIER_META = {
  fastest: {
    gradient: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
    badge: '⚡ Fastest Completion',
    badgeBg: '#dbeafe',
    badgeColor: '#1e40af',
    icon: '⚡',
  },
  best_value: {
    gradient: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
    badge: '💰 Best Value',
    badgeBg: '#d1fae5',
    badgeColor: '#065f46',
    icon: '💰',
  },
  high_efficiency: {
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    badge: '🌟 High Efficiency',
    badgeBg: '#ede9fe',
    badgeColor: '#7c3aed',
    icon: '🌟',
  },
};

function AvailabilityDot({ inStock, nextDays }) {
  if (inStock) return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: '11px', fontWeight: '600', color: '#059669'
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', background: '#10b981',
        display: 'inline-block', boxShadow: '0 0 0 2px rgba(16,185,129,0.25)'
      }} />
      In Stock
    </span>
  );
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: '11px', fontWeight: '600', color: '#d97706'
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', background: '#f59e0b',
        display: 'inline-block'
      }} />
      {nextDays ? `In ${nextDays} days` : 'Out of stock'}
    </span>
  );
}

export default function SystemConfigCard({ config, isSelected, onSelect }) {
  const meta = TIER_META[config.tier] || TIER_META.fastest;
  const { addToCart } = useCart();
  const { productContext } = useContractorContext();

  const handleAddSystem = (e) => {
    e.stopPropagation();
    config.components.forEach((comp) => {
      addToCart({
        product_id: comp.product_id,
        brand_name: comp.brand,
        model_name: comp.model,
        product_type: comp.role,
        price: { min: comp.price_min, max: comp.price_max },
        system_bundle: config.tier_label,
      });
    });
  };

  return (
    <div
      onClick={onSelect}
      style={{
        borderRadius: '18px',
        overflow: 'hidden',
        border: isSelected
          ? '2px solid rgba(30, 64, 175, 0.6)'
          : '2px solid rgba(0,0,0,0.06)',
        boxShadow: isSelected
          ? '0 8px 32px rgba(30, 64, 175, 0.15)'
          : '0 2px 12px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        background: '#fff',
        marginBottom: '12px',
      }}
    >
      {/* Header */}
      <div style={{
        background: meta.gradient,
        padding: '14px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            System Configuration
          </div>
          <div style={{ color: '#fff', fontSize: '15px', fontWeight: '800', marginTop: 2 }}>
            {config.tier_label}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {config.seer_rating && (
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '20px', fontWeight: '900', lineHeight: 1 }}>
              {config.seer_rating}
            </div>
          )}
          {config.seer_rating && (
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: '600' }}>SEER2</div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 18px' }}>

        {/* Status Row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {config.same_day_possible ? (
            <span style={{
              background: '#d1fae5', color: '#065f46',
              fontSize: '10.5px', fontWeight: '700',
              padding: '3px 10px', borderRadius: '20px'
            }}>
              ⚡ Same-day pickup
            </span>
          ) : (
            <span style={{
              background: '#fef3c7', color: '#92400e',
              fontSize: '10.5px', fontWeight: '700',
              padding: '3px 10px', borderRadius: '20px'
            }}>
              📅 Next shipment in {config.condenser_next_shipment_days || 2} days
            </span>
          )}
          {config.all_same_branch && (
            <span style={{
              background: '#ede9fe', color: '#5b21b6',
              fontSize: '10.5px', fontWeight: '700',
              padding: '3px 10px', borderRadius: '20px'
            }}>
              📍 One branch stop
            </span>
          )}
        </div>

        {/* Branch info */}
        {config.primary_branch && (
          <div style={{
            background: '#f8fafc',
            borderRadius: '10px',
            padding: '10px 12px',
            marginBottom: 12,
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: 2 }}>
              📍 {config.primary_branch}
            </div>
            {config.primary_branch_address && (
              <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                {config.primary_branch_address}
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
              {config.primary_distance_miles != null && (
                <span style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>
                  🚗 {config.primary_distance_miles} mi away
                </span>
              )}
              {config.max_pickup_hours != null && config.all_in_stock && (
                <span style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>
                  ⏱ Ready in ~{config.max_pickup_hours}h
                </span>
              )}
            </div>
          </div>
        )}

        {/* Components List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
          {config.components.map((comp, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '7px 10px', borderRadius: '8px',
              background: 'rgba(248,250,252,0.8)',
              border: '1px solid rgba(0,0,0,0.04)'
            }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#1e293b' }}>
                  {comp.role}
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748b', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {comp.brand} {comp.model}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <AvailabilityDot inStock={comp.in_stock} nextDays={comp.next_shipment_days} />
                {comp.price_min != null && (
                  <div style={{ fontSize: '11px', color: '#334155', fontWeight: '700', marginTop: 2 }}>
                    ${comp.price_min.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Total Price */}
        {config.total_price_min != null && (
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            paddingTop: 10, marginBottom: 12
          }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
              Total (equipment)
            </span>
            <span style={{ fontSize: '15px', fontWeight: '900', color: '#1e293b' }}>
              ${config.total_price_min.toLocaleString()}
              {config.total_price_max && config.total_price_max !== config.total_price_min && (
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>
                  {' '}– ${config.total_price_max.toLocaleString()}
                </span>
              )}
            </span>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleAddSystem}
          style={{
            width: '100%',
            padding: '10px 0',
            borderRadius: '12px',
            border: 'none',
            background: isSelected ? meta.gradient : 'rgba(30, 64, 175, 0.08)',
            color: isSelected ? '#fff' : '#1e40af',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = 'rgba(30, 64, 175, 0.14)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = 'rgba(30, 64, 175, 0.08)';
            }
          }}
        >
          🛒 Add Full System to Cart
        </button>
      </div>
    </div>
  );
}
