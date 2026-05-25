import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Package, ShoppingBag, Ticket, Users, RefreshCw, Plug, Plus, Trash2, CheckCircle, X, Globe } from 'lucide-react';
import { Product, Order, Customer, Coupon } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProductStock: (id: string, newStock: number) => void;
  onUpdateProductPrice: (id: string, newPrice: number) => void;
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  customers: Customer[];
  coupons: Coupon[];
  onAddCoupon: (c: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProductStock,
  onUpdateProductPrice,
  orders,
  onUpdateOrderStatus,
  customers,
  coupons,
  onAddCoupon,
  onDeleteCoupon
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'coupons' | 'customers'>('dashboard');

  // Coupon creator local state
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage');
  const [newValue, setNewValue] = useState(10);
  const [newMinSpend, setNewMinSpend] = useState(0);

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    onAddCoupon({
      code: newCode.trim().toUpperCase(),
      discountType: newType,
      value: Number(newValue),
      minPurchase: Number(newMinSpend)
    });
    setNewCode('');
    setNewMinSpend(0);
  };

  // Math summary statistics
  const totalRevenueINR = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingDeliveries = orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end" id="admin-panel-portal">
        
        {/* Dark backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs"
        />

        {/* Sliding Side sheet panel */}
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="relative bg-[#F5F2ED] border-l border-black/5 w-full max-w-4xl h-full shadow-2xl z-10 flex flex-col overflow-hidden"
          id="admin-sidebar-pane"
        >
          
          {/* Header Panel */}
          <div className="bg-[#1A1A1A] text-white p-6 flex justify-between items-center border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#C5A880] rounded-full animate-ping"></span>
                <span className="text-[10px] tracking-widest text-[#C5A880] uppercase font-mono font-bold">Atelier Core Register</span>
              </div>
              <h2 className="text-xl font-serif text-white tracking-wider font-light mt-0.5">Control & Settlement Board</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 border border-stone-800 rounded-none hover:bg-stone-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick tab controls */}
          <div className="bg-[#FAF6F0] border-b border-black/5 px-4 py-2 flex flex-wrap gap-2 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-none text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'dashboard' ? 'bg-[#C5A880] text-white' : 'text-neutral-500 hover:bg-neutral-50'}`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Metrics</span>
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-none text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'products' ? 'bg-[#C5A880] text-white' : 'text-neutral-500 hover:bg-neutral-50'}`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Catalog & Stocks</span>
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-none text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'orders' ? 'bg-[#C5A880] text-white' : 'text-neutral-500 hover:bg-neutral-50'}`}
            >
              <X className="w-3.5 h-3.5 transform rotate-45" />
              <span>Orders Ledger ({orders.length})</span>
            </button>
            <button 
              onClick={() => setActiveTab('coupons')}
              className={`px-4 py-2 rounded-none text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'coupons' ? 'bg-[#C5A880] text-white' : 'text-neutral-500 hover:bg-neutral-50'}`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Promos ({coupons.length})</span>
            </button>
            <button 
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 rounded-none text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'customers' ? 'bg-[#C5A880] text-white' : 'text-neutral-500 hover:bg-neutral-50'}`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Client Ledger</span>
            </button>
          </div>

          {/* Core Panel Content views */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6">
            
            {/* VIEW 1: Stat Metrics overview */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-black/5 p-5 rounded-none shadow-xs">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase font-bold tracking-widest">Adjusted Settlement Revenue</span>
                    <h3 className="text-2xl font-mono text-[#1A1A1A] font-light mt-1.5 font-bold">₹ {totalRevenueINR.toLocaleString('en-IN')}</h3>
                    <p className="text-[10px] text-neutral-400 mt-1 uppercase font-mono">100% Secure Gateway Settled</p>
                  </div>
                  <div className="bg-white border border-black/5 p-5 rounded-none shadow-xs">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase font-bold tracking-widest">Pending Dispatch Blocks</span>
                    <h3 className="text-2xl font-mono text-[#C5A880] font-light mt-1.5 font-bold">{pendingDeliveries} Consignments</h3>
                    <p className="text-[10px] text-neutral-400 mt-1 uppercase font-mono">Ready for priority DHL boarding</p>
                  </div>
                  <div className="bg-white border border-black/5 p-5 rounded-none shadow-xs">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase font-bold tracking-widest">Registered Clients file</span>
                    <h3 className="text-2xl font-mono text-[#1A1A1A] font-light mt-1.5 font-bold">{customers.length} Guest Profiles</h3>
                    <p className="text-[10px] text-neutral-400 mt-1 uppercase font-mono">Zero COD leakage</p>
                  </div>
                </div>

                <div className="border border-black/5 rounded-none bg-white p-5 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <Plug className="text-[#C5A880] w-5 h-5" />
                    <h4 className="text-sm font-semibold tracking-wider text-[#1A1A1A] uppercase">Operational Reference Overview</h4>
                  </div>
                  <div className="text-xs text-neutral-600 font-light leading-relaxed space-y-2">
                    <p>
                      <strong>The Private Edit</strong> is structurally optimized for direct checkout standards:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-500 font-sans">
                      <li><strong>Pricing Standards:</strong> Local tax fractions are pre-computed and noted directly on display lines.</li>
                      <li><strong>Zero COD:</strong> Avoids cash-settled losses. Payment routing is restricted to online debit/credit card and UPI tunnels.</li>
                      <li><strong>Clear Shipping Logistics & Refund policies:</strong> Standard 7-day pickup guarantee and 5-day bank refund triggers configured clearly on consumer legal pages.</li>
                      <li><strong>Headquarters Proof:</strong> Physical Pune address and support accounts matched perfectly in contact slots.</li>
                    </ul>
                  </div>
                </div>

                {/* DOMAIN MAPPING SUITE */}
                <div className="border border-black/5 rounded-none bg-white p-5 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <Globe className="text-[#C5A880] w-5 h-5 animate-pulse" />
                    <h4 className="text-sm font-semibold tracking-wider text-[#1A1A1A] uppercase">Custom Domain Mapping Status</h4>
                  </div>
                  
                  <div className="text-xs space-y-3 font-sans">
                    <p className="text-neutral-600 font-light leading-relaxed">
                      To direct your luxurious flagship domain names <strong>theprivateedit.store</strong> and <strong>www.theprivateedit.store</strong> directly to this active Cloud Run distribution server, configure your domain registrar DNS zone records with the values outlined below:
                    </p>

                    <div className="bg-[#FAF9F6] border border-black/5 p-4 space-y-3 font-mono text-[11px] text-neutral-700">
                      <div className="border-b border-black/5 pb-2">
                        <span className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider">Root Domain (Apex)</span>
                        <div className="flex flex-wrap justify-between items-center gap-2 mt-1">
                          <span>Domain: <strong className="text-neutral-900">theprivateedit.store</strong></span>
                          <span>Type: <strong className="text-neutral-900">A Record</strong></span>
                          <span>Value/IP: <strong className="text-[#C5A880]">216.58.220.115</strong> (GCP Cloud Ingress)</span>
                        </div>
                      </div>

                      <div className="pt-1">
                        <span className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider">WWW Subdomain</span>
                        <div className="flex flex-wrap justify-between items-center gap-2 mt-1">
                          <span>Domain: <strong className="text-neutral-900">www.theprivateedit.store</strong></span>
                          <span>Type: <strong className="text-neutral-900">CNAME</strong></span>
                          <span>Alias: <strong className="text-[#C5A880]">ghs.googlehosted.com</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-stone-50 border border-black/5 flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                      <p className="text-[10px] text-neutral-500 font-light leading-normal m-0">
                        <strong>SSL Active Encryption:</strong> Once DNS records propagate (typically within 1-2 hours), Let's Encrypt certificates will be auto-generated to authenticate securely with zero manual setup required.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: Product inventory & pricing management */}
            {activeTab === 'products' && (
              <div className="bg-white border border-black/5 rounded-none overflow-hidden animate-fadeIn">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6F0] border-b border-black/5 text-neutral-400 uppercase font-mono tracking-widest text-[9.5px]">
                      <th className="p-4 font-bold">Accessory descriptor</th>
                      <th className="p-4 font-bold">Category</th>
                      <th className="p-4 font-bold">Active Price (INR)</th>
                      <th className="p-4 font-bold">Warehouse Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-black/5 hover:bg-[#FAF9F6] transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-8 h-10 object-cover rounded-none border border-black/5 bg-[#EAE7E2]"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-semibold text-neutral-900 block font-serif tracking-wider">{product.name}</span>
                            <span className="text-[10px] font-mono text-neutral-400">{product.id}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="uppercase text-[9px] font-mono bg-[#F5F2ED] px-2 py-0.5 rounded-none font-bold text-neutral-500 border border-black/5">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 font-mono">
                            <span>₹</span>
                            <input 
                              type="number"
                              value={product.discountPriceINR || product.priceINR}
                              onChange={(e) => onUpdateProductPrice(product.id, Number(e.target.value))}
                              className="w-24 px-2 py-1 bg-[#FAF9F6] border border-black/10 rounded-none text-right focus:border-black focus:outline-none"
                              min={100}
                            />
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              value={product.stock}
                              onChange={(e) => onUpdateProductStock(product.id, Number(e.target.value))}
                              className="w-16 px-2 py-1 bg-[#FAF9F6] border border-black/10 rounded-none text-center focus:border-black focus:outline-none font-mono"
                              min={0}
                            />
                            {product.stock === 0 && <span className="text-[9px] text-red-500 font-bold tracking-widest">OUT</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VIEW 3: Orders ledger list */}
            {activeTab === 'orders' && (
              <div className="space-y-4 animate-fadeIn">
                {orders.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic text-center py-8">Zero orders completed in this session.</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-white border border-black/5 rounded-none overflow-hidden animate-fadeIn">
                      <div className="bg-[#FAF6F0] px-4 py-3 border-b border-black/5 flex justify-between items-center text-xs flex-wrap gap-2 font-mono">
                        <div>
                          Consignment: <strong className="text-neutral-800">{order.id}</strong>
                          <span className="text-neutral-400 ml-2">|</span>
                          <span className="text-neutral-400 ml-2">Date: {order.date}</span>
                        </div>
                        <div>
                          Total value: <strong className="text-neutral-800">₹{order.total.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>

                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light">
                          <div>
                            <span className="block text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Courier Address</span>
                            <strong className="text-neutral-800 block mt-1 font-medium font-serif">{order.shippingAddress.name}</strong>
                            <p className="text-neutral-500 text-[11px] leading-relaxed mt-0.5">
                              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode} ({order.shippingAddress.country})
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="block text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Active Delivery Milestone</span>
                              <div className="mt-1 flex items-center gap-2">
                                <select 
                                  value={order.status}
                                  onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                  className="px-2 py-1 bg-white border border-black/10 text-xs rounded-none font-medium focus:outline-none focus:border-stone-400"
                                >
                                  <option value="Pending">Pending Audit</option>
                                  <option value="Processing">In Processing</option>
                                  <option value="Shipped">Dispatched Courier (DHL)</option>
                                  <option value="Delivered">Hand-Delivered Signed</option>
                                  <option value="Cancelled">Cancelled/Refunded</option>
                                </select>
                              </div>
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono">
                              Airway Code: <strong className="text-neutral-600 font-bold">{order.trackingNumber}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Items listed */}
                        <div className="border-t border-black/5 pt-3 space-y-2">
                          <span className="block text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Allocated Items</span>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-neutral-600">
                              <span>• {item.name} ({item.color}) - <strong className="font-mono">QTY: {item.quantity}</strong></span>
                              <span className="font-mono">₹{item.price.toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* VIEW 4: active coupons */}
            {activeTab === 'coupons' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                
                {/* Creator form */}
                <form onSubmit={handleAddCouponSubmit} className="lg:col-span-12 xl:col-span-5 bg-white border border-black/5 p-5 rounded-none space-y-4 self-start" id="admin-add-coupon-form">
                  <h4 className="text-xs uppercase tracking-widest text-[#C5A880] font-bold font-mono">Issue Custom Code</h4>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400">Coupon Tag Code</label>
                    <input 
                      type="text"
                      required
                      value={newCode}
                      onChange={e => setNewCode(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF9F6] border border-black/10 rounded-none font-mono text-xs text-[#1A1A1A] mt-1 outline-none focus:border-[#C5A880]"
                      placeholder="e.g. VIP25"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400">Deduction Method</label>
                      <select 
                        value={newType}
                        onChange={e => setNewType(e.target.value as 'percentage' | 'fixed')}
                        className="w-full px-2 py-2 bg-[#FAF9F6] border border-black/10 rounded-none text-xs mt-1 focus:outline-none focus:border-black"
                      >
                        <option value="percentage">% percentage</option>
                        <option value="fixed">Flat INR off</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400">Voucher value</label>
                      <input 
                        type="number"
                        min={1}
                        value={newValue}
                        onChange={e => setNewValue(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-black/10 rounded-none font-mono text-xs mt-1 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400">Min Purchase spend (INR)</label>
                    <input 
                      type="number"
                      min={0}
                      value={newMinSpend}
                      onChange={e => setNewMinSpend(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#FAF9F6] border border-black/10 rounded-none font-mono text-xs mt-1 outline-none"
                      placeholder="e.g. 5000"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#1A1A1A] hover:bg-neutral-800 text-white py-3 rounded-none text-[10px] uppercase tracking-widest font-semibold transition-colors cursor-pointer text-center"
                  >
                    Activate Coupon
                  </button>
                </form>

                {/* Listing of coupons active */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-[#1A1A1A] font-bold font-mono">Platform Voucher Registry</h4>
                  
                  {coupons.map((coupon) => (
                    <div key={coupon.code} className="bg-white border border-black/5 rounded-none p-4 flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FAF6F0] rounded-none border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
                          <Ticket className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-mono font-bold text-sm text-[#1A1A1A] block">{coupon.code}</span>
                          <span className="text-[10px] text-neutral-400 block font-light">
                            {coupon.discountType === 'percentage' ? `${coupon.value}% off` : `₹${coupon.value.toLocaleString()} off`} 
                            {coupon.minPurchase ? ` • Spend Min ₹${coupon.minPurchase.toLocaleString()}` : ' • No Limit'}
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => onDeleteCoupon(coupon.code)}
                        className="p-1.5 border border-red-100 rounded-none hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                        title="Delete code"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* VIEW 5: Customer list directory */}
            {activeTab === 'customers' && (
              <div className="bg-white border border-black/5 rounded-none overflow-hidden animate-fadeIn">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6F0] border-b border-black/5 text-neutral-400 uppercase font-mono tracking-widest text-[9.5px]">
                      <th className="p-4 font-bold">Client descriptor</th>
                      <th className="p-4 font-bold">Contact Coordinates</th>
                      <th className="p-4 font-bold text-center">Fulfill Orders</th>
                      <th className="p-4 font-bold text-right">Unified Spent amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} className="border-b border-black/5 hover:bg-[#FAF9F6] transition-colors">
                        <td className="p-4">
                          <span className="font-serif text-sm font-light text-neutral-900 block tracking-wide">{c.name}</span>
                          <span className="text-[9.5px] uppercase font-mono text-neutral-400">Account: {c.id}</span>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-neutral-600">
                          <p>{c.email}</p>
                          <p>{c.phone}</p>
                        </td>
                        <td className="p-4 text-center">
                          <span className="px-2.5 py-1 bg-stone-100 rounded-none font-mono text-xs font-bold text-neutral-600 border border-black/5">
                            {c.ordersCount} Checked
                          </span>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-neutral-900">
                          ₹ {c.totalSpent.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

          {/* Quick status footer */}
          <div className="p-4 bg-[#FAF6F0] border-t border-black/10 flex justify-between items-center text-[9px] uppercase font-mono text-[#C5A880]">
            <span>The Private Edit Admin Node v1.0</span>
            <span>Secure System Access</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
