import React, { useRef, useEffect, useState } from 'react';
import { X, HardHat, RefreshCw, Send, Loader2 } from 'lucide-react';
import { useContractorContext } from '../../context/ContractorContext';
import { useContractorAgent } from '../../hooks/useContractorAgent';
import QuickReplyChips from './QuickReplyChips';
import SystemConfigCard from './SystemConfigCard';

// ─── Render a single AI message based on action type ───────────────────────
function ActionMessage({ msg }) {
  const ad = msg.actionData;
  const isUser = msg.role === 'user';

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <div style={{
          maxWidth: '80%', padding: '10px 14px',
          background: 'linear-gradient(135deg, #1e40af, #2563eb)',
          color: '#fff', borderRadius: '16px 16px 4px 16px',
          fontSize: '13.5px', lineHeight: 1.5, fontWeight: '500'
        }}>
          {msg.content}
        </div>
      </div>
    );
  }

  // Assistant message
  const action = ad?.action;

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
      <div style={{ maxWidth: '95%', width: '100%' }}>
        {/* Action badge */}
        {action && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'rgba(30,64,175,0.08)', color: '#1e40af',
            fontSize: '10px', fontWeight: '800', letterSpacing: '0.08em',
            textTransform: 'uppercase', padding: '2px 8px', borderRadius: '6px',
            marginBottom: 6
          }}>
            {action.replace(/_/g, ' ')}
          </div>
        )}

        {/* Main message bubble */}
        <div style={{
          padding: '12px 16px',
          background: '#f8fafc',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: '4px 16px 16px 16px',
          fontSize: '13.5px', lineHeight: 1.55, color: '#1e293b',
          marginBottom: 8
        }}>
          {msg.content}
        </div>

        {/* system_check details */}
        {action === 'system_check' && ad?.details && (
          <div style={{
            background: '#f0fdf4', border: '1px solid rgba(5,150,105,0.15)',
            borderRadius: '12px', padding: '12px 14px', marginTop: 4
          }}>
            {Object.entries(ad.details).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#065f46', minWidth: 130, textTransform: 'capitalize' }}>
                  {k.replace(/_/g, ' ')}
                </span>
                <span style={{ fontSize: '11.5px', color: '#334155' }}>
                  {Array.isArray(v) ? v.join(', ') : String(v)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* compatible_units condenser list */}
        {action === 'compatible_units' && ad?.condensers && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {ad.condensers.map((c, i) => (
              <div key={i} style={{
                background: '#fff', border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: '12px', padding: '10px 14px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#1e293b' }}>
                    {c.tier_label && <span style={{
                      background: 'rgba(30,64,175,0.08)', color: '#1e40af',
                      fontSize: '9.5px', fontWeight: '700', padding: '1px 7px',
                      borderRadius: '5px', marginRight: 6
                    }}>{c.tier_label}</span>}
                    {c.brand} {c.model}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: 2 }}>
                    SEER2: {c.seer} &nbsp;·&nbsp;
                    {c.in_stock
                      ? <span style={{ color: '#059669' }}>✓ In Stock — {c.branch}</span>
                      : <span style={{ color: '#d97706' }}>⏳ Out of stock</span>
                    }
                  </div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>
                  ${c.price_min?.toLocaleString()}+
                </div>
              </div>
            ))}
          </div>
        )}

        {/* bom_preview items */}
        {action === 'bom_preview' && ad?.items && (
          <div style={{
            background: '#fff', border: '1px solid rgba(0,0,0,0.07)',
            borderRadius: '12px', overflow: 'hidden', marginTop: 4
          }}>
            {ad.items.map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px',
                borderBottom: i < ad.items.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                background: i % 2 === 0 ? '#fff' : '#fafafa'
              }}>
                <div>
                  <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#1e293b' }}>
                    {item.required ? '✅' : '➕'} {item.type}
                  </span>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{item.description}</div>
                </div>
                {item.in_stock != null && (
                  <span style={{ fontSize: '10.5px', fontWeight: '700',
                    color: item.in_stock ? '#059669' : '#d97706' }}>
                    {item.in_stock ? 'In Stock' : 'Order'}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* availability_check */}
        {action === 'availability_check' && ad?.fastest_option && (
          <div style={{
            background: '#f0fdf4', border: '1px solid rgba(5,150,105,0.2)',
            borderRadius: '12px', padding: '12px 14px', marginTop: 4
          }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#065f46', marginBottom: 6 }}>
              ⚡ Best Same-Day Option
            </div>
            {[
              ['Branch', ad.fastest_option.branch],
              ['Distance', ad.fastest_option.distance_miles ? `${ad.fastest_option.distance_miles} miles` : null],
              ['Pickup ready', ad.fastest_option.pickup_ready_hours ? `~${ad.fastest_option.pickup_ready_hours} hours` : null],
              ['All components', ad.fastest_option.all_components_same_branch ? 'Same branch ✓' : 'Multiple branches'],
            ].filter(([, v]) => v).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#065f46', minWidth: 100 }}>{k}</span>
                <span style={{ fontSize: '11.5px', color: '#1e293b' }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* alternative_check */}
        {action === 'alternative_check' && ad?.alternatives && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {ad.alternatives.map((alt, i) => (
              <div key={i} style={{
                background: '#fff7ed', border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '12px', padding: '10px 14px'
              }}>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#92400e', marginBottom: 3 }}>
                  {alt.type === 'nearest_alternative' ? '🔄 Closest Alternative' : '📦 Wait for Restock'}
                </div>
                <div style={{ fontSize: '11px', color: '#78350f' }}>{alt.description}</div>
                {alt.note && (
                  <div style={{ fontSize: '10.5px', color: '#b45309', marginTop: 3, fontStyle: 'italic' }}>
                    ⚠ {alt.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* recommendation */}
        {action === 'recommendation' && ad?.recommended_product && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(30,64,175,0.06), rgba(37,99,235,0.06))',
            border: '1px solid rgba(30,64,175,0.15)',
            borderRadius: '12px', padding: '12px 14px', marginTop: 4
          }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#1e40af', marginBottom: 4 }}>
              🎯 Recommended: {ad.recommended_product.brand} {ad.recommended_product.model}
            </div>
            {ad.rationale && (
              <div style={{ fontSize: '11.5px', color: '#334155', lineHeight: 1.5 }}>{ad.rationale}</div>
            )}
            {ad.tradeoffs && (
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: 6, fontStyle: 'italic' }}>
                💡 {ad.tradeoffs}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Typing indicator ───────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 0' }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%', background: '#94a3b8',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
          }} />
        ))}
      </div>
      <span style={{ fontSize: '11px', color: '#94a3b8' }}>AI Advisor thinking...</span>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Main Panel ─────────────────────────────────────────────────────────────
export default function ContractorAdvisorPanel() {
  const {
    isPanelOpen, setIsPanelOpen,
    conversation, productContext,
    systemConfigs, selectedConfig, setSelectedConfig,
    resetContractor
  } = useContractorContext();

  const { sendMessage, isLoading } = useContractorAgent();
  const [input, setInput] = useState('');
  const [showChips, setShowChips] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isLoading]);

  if (!isPanelOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setShowChips(false);
    sendMessage(input);
    setInput('');
  };

  const handleChipSelect = (query) => {
    setShowChips(false);
    sendMessage(query);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsPanelOpen(false)}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)',
          zIndex: 998, backdropFilter: 'blur(2px)'
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        width: '420px',
        maxWidth: '100vw',
        background: '#fff',
        boxShadow: '-8px 0 48px rgba(0,0,0,0.12)',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
        animation: 'slideInRight 0.28s cubic-bezier(0.25,1,0.5,1)',
      }}>
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>

        {/* ── Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          padding: '16px 20px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '10px',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18
              }}>
                🦺
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: '800', fontSize: '15px', letterSpacing: '-0.01em' }}>
                  Contractor Advisor
                </div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontWeight: '500' }}>
                  Gemaire AI · Job Completion Mode
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={resetContractor} title="Reset" style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.7)',
                width: 30, height: 30, borderRadius: '8px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13
              }}>
                <RefreshCw size={13} />
              </button>
              <button onClick={() => setIsPanelOpen(false)} title="Close" style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.7)',
                width: 30, height: 30, borderRadius: '8px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13
              }}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Product context pill */}
          {productContext && (
            <div style={{
              marginTop: 12,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '8px 12px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
                Currently Viewing
              </div>
              <div style={{ color: '#fff', fontSize: '12.5px', fontWeight: '700' }}>
                {productContext.brand_name} · {productContext.model_name}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', marginTop: 1 }}>
                {productContext.product_type} · {productContext.specifications?.capacity_tons || productContext.specifications?.cooling_capacity_btu
                  ? `${productContext.specifications?.capacity_tons || Math.round((productContext.specifications?.cooling_capacity_btu || 0) / 12000)} ton`
                  : ''
                }
                {productContext.specifications?.refrigerant_type ? ` · ${productContext.specifications.refrigerant_type}` : ''}
              </div>
            </div>
          )}
        </div>

        {/* ── Scrollable Content ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>

          {/* Empty state */}
          {conversation.length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 8 }}>
              <div style={{ fontSize: '28px', marginBottom: 8 }}>🦺</div>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>
                Ready to complete your job
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
                Ask about compatibility, build a complete system, or check what's available today.
              </div>
            </div>
          )}

          {/* Quick reply chips — shown on empty state OR when user taps Show quick actions */}
          {showChips && (
            <div style={{ marginTop: conversation.length === 0 ? 12 : 0 }}>
              <QuickReplyChips onSelect={handleChipSelect} disabled={isLoading} />
            </div>
          )}

          {/* Conversation */}
          {conversation.map((msg, i) => (
            <ActionMessage key={i} msg={msg} />
          ))}

          {isLoading && <TypingIndicator />}

          {/* System config cards */}
          {systemConfigs && systemConfigs.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                System Configurations
              </div>
              {systemConfigs.map((cfg, i) => (
                <SystemConfigCard
                  key={cfg.tier}
                  config={cfg}
                  isSelected={selectedConfig?.tier === cfg.tier}
                  onSelect={() => setSelectedConfig(cfg)}
                />
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Input ── */}
        <div style={{
          padding: '12px 16px 16px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          background: '#fff',
          flexShrink: 0,
        }}>
          {!showChips && conversation.length > 0 && (
            <button
              onClick={() => setShowChips(true)}
              style={{
                width: '100%', marginBottom: 8,
                padding: '7px', borderRadius: '10px',
                border: '1px solid rgba(30,64,175,0.15)',
                background: 'rgba(239,246,255,0.8)', color: '#1e40af',
                fontSize: '11.5px', fontWeight: '600', cursor: 'pointer'
              }}
            >
              Show quick actions
            </button>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this unit..."
              disabled={isLoading}
              style={{
                flex: 1, padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid rgba(0,0,0,0.1)',
                fontSize: '13.5px', outline: 'none',
                background: isLoading ? '#f8fafc' : '#fff',
                color: '#1e293b',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(30,64,175,0.4)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              style={{
                width: 40, height: 40, borderRadius: '12px', border: 'none',
                background: input.trim() && !isLoading
                  ? 'linear-gradient(135deg, #1e40af, #2563eb)'
                  : '#e2e8f0',
                color: input.trim() && !isLoading ? '#fff' : '#94a3b8',
                cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.15s'
              }}
            >
              {isLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} />}
            </button>
          </form>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </>
  );
}
