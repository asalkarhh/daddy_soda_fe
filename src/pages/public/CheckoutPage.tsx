import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, discount, deliveryFee, grandTotal, deliveryType, clearCart } = useCart();
  const [placed, setPlaced] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', notes: '' });

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FFF8ED]">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="font-display text-4xl font-black text-[#171717] mb-2">ORDER RECEIVED!</h2>
        <p className="text-sm text-[#7A6B56] max-w-md mb-6">
          Thank you {customer.name || 'valued customer'}. Your draft soda order is being prepared fresh. We will notify you at {customer.phone || 'your phone number'}.
        </p>
        <Link
          to="/"
          className="px-8 py-3.5 rounded-xl bg-[#701A1A] text-white font-display text-lg tracking-wider hover:bg-[#E6392F] transition-all"
        >
          RETURN TO HOME
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FFF8ED]">
        <ShoppingBag className="w-16 h-16 text-[#A8987E] mb-4" />
        <h2 className="font-display text-3xl font-black text-[#171717] mb-2">YOUR CART IS EMPTY</h2>
        <p className="text-sm text-[#7A6B56] mb-6">Explore our craft menu or build your own custom fountain drink.</p>
        <div className="flex gap-4">
          <Link
            to="/menu"
            className="px-6 py-3 rounded-xl bg-[#701A1A] text-white font-display text-base tracking-wider hover:bg-[#E6392F]"
          >
            VIEW MENU
          </Link>
          <Link
            to="/build"
            className="px-6 py-3 rounded-xl border border-[#E8D9BD] text-[#171717] font-display text-base tracking-wider hover:bg-[#FAF2E2]"
          >
            BUILD SODA
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8ED] pt-8 pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link
          to="/menu"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A6B56] hover:text-[#701A1A] transition-colors mb-6 uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Ordering</span>
        </Link>

        <h1 className="font-display text-4xl sm:text-5xl font-black text-[#171717] tracking-tight mb-8">
          CHECKOUT &amp; CONFIRMATION
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Customer Form */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8D9BD] shadow-sm space-y-4">
            <h3 className="font-display text-2xl font-bold text-[#171717] mb-2">
              DELIVERY &amp; CONTACT INFO
            </h3>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#7A6B56] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF2E2] border border-[#E8D9BD] text-sm text-[#171717] focus:outline-none focus:border-[#701A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#7A6B56] mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF2E2] border border-[#E8D9BD] text-sm text-[#171717] focus:outline-none focus:border-[#701A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#7A6B56] mb-1">
                  {deliveryType === 'delivery' ? 'Delivery Address *' : 'Pickup Store Note'}
                </label>
                <textarea
                  rows={2}
                  required={deliveryType === 'delivery'}
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  placeholder={
                    deliveryType === 'delivery'
                      ? 'House/Flat no., Street, Landmark, Area...'
                      : 'E.g. Picking up in 15 minutes at Kolhapur central outlet'
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF2E2] border border-[#E8D9BD] text-sm text-[#171717] focus:outline-none focus:border-[#701A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#7A6B56] mb-1">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  placeholder="Less sweet, extra ice, separate straw..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF2E2] border border-[#E8D9BD] text-sm text-[#171717] focus:outline-none focus:border-[#701A1A]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#701A1A] hover:bg-[#E6392F] text-white font-display text-xl tracking-wider transition-all shadow-md mt-4 cursor-pointer"
              >
                PLACE ORDER • ₹{grandTotal}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-5 bg-[#FAF2E2] p-6 rounded-3xl border border-[#E8D9BD] space-y-4">
            <h3 className="font-display text-2xl font-bold text-[#171717]">
              ORDER SUMMARY
            </h3>

            <div className="space-y-3 divide-y divide-[#E8D9BD]">
              {items.map((item) => (
                <div key={item.id} className="pt-2 flex justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#171717]">
                      {item.type === 'preset'
                        ? item.presetProduct?.name
                        : item.customSoda?.customName} x {item.quantity}
                    </p>
                    <p className="text-[11px] text-[#7A6B56] capitalize">
                      {item.selectedSize} • {item.selectedIce} ice
                    </p>
                  </div>
                  <span className="font-bold text-[#171717]">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E8D9BD] space-y-1.5 text-xs text-[#7A6B56]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#171717]">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#E6392F]">
                  <span>Discount</span>
                  <span className="font-bold">− ₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-bold text-[#171717]">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-display font-black text-[#171717] pt-2 border-t border-[#E8D9BD]">
                <span>TOTAL PAYABLE</span>
                <span className="text-[#E6392F]">₹{grandTotal}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#7A6B56]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Cash on Delivery &amp; UPI Available at Counter / Delivery.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
