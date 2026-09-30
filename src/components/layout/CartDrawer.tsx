import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, Tag, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    removeItem,
    updateQuantity,
    subtotal,
    deliveryFee,
    grandTotal,
    discount,
    promoCode,
    applyPromo,
    removePromo,
    deliveryType,
    setDeliveryType,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isDrawerOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const res = applyPromo(inputCode);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) setInputCode('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF8ED] text-[#171717] shadow-2xl flex flex-col border-l border-[#E8D9BD]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8D9BD] flex items-center justify-between bg-[#F5E9D0]/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E6392F]" />
              <h2 className="font-display text-2xl font-bold tracking-wide">YOUR DADDY CART</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#E6392F] text-white">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-full text-[#171717] hover:bg-[#E8D9BD] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery / Pickup Switch */}
          <div className="p-3 bg-[#FAF2E2] border-b border-[#E8D9BD] flex gap-2">
            <button
              type="button"
              onClick={() => setDeliveryType('delivery')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                deliveryType === 'delivery'
                  ? 'bg-[#171717] text-white shadow-sm'
                  : 'bg-transparent text-[#7A6B56] hover:text-[#171717]'
              }`}
            >
              🚀 Delivery (35 mins)
            </button>
            <button
              type="button"
              onClick={() => setDeliveryType('pickup')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                deliveryType === 'pickup'
                  ? 'bg-[#171717] text-white shadow-sm'
                  : 'bg-transparent text-[#7A6B56] hover:text-[#171717]'
              }`}
            >
              🚗 Store Drive-Thru Pickup
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#7A6B56]">
                <div className="w-16 h-16 rounded-full bg-[#F5E9D0] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-[#A8987E]" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[#171717] mb-1">YOUR CART IS THIRSTY</h3>
                <p className="text-sm max-w-xs mb-6">
                  You haven&apos;t added any custom fountain creations or Daddy picks yet.
                </p>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      navigate('/build');
                    }}
                    className="w-full py-3 rounded-xl bg-[#E6392F] text-white font-display text-lg tracking-wider hover:bg-[#171717] transition-all"
                  >
                    BUILD YOUR SODA
                  </button>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      navigate('/menu');
                    }}
                    className="w-full py-2.5 rounded-xl border border-[#E8D9BD] text-[#171717] font-display text-base tracking-wider hover:bg-[#F5E9D0] transition-all"
                  >
                    EXPLORE MENU
                  </button>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border border-[#E8D9BD] shadow-xs flex gap-3.5 items-start"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-[#FFF8ED] border border-[#E8D9BD] overflow-hidden shrink-0 relative flex items-center justify-center">
                    {item.type === 'preset' && item.presetProduct ? (
                      <img
                        src={item.presetProduct.image}
                        alt={item.presetProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center p-1 text-center"
                        style={{
                          background: item.customSoda?.base.liquidGradient || '#E6392F',
                        }}
                      >
                        <span className="text-xs font-black text-white drop-shadow-md">
                          🥤 CUSTOM
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="font-display text-lg font-bold text-[#171717] leading-tight truncate">
                        {item.type === 'preset'
                          ? item.presetProduct?.name
                          : item.customSoda?.customName || 'Custom Daddy Mix'}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#A8987E] hover:text-[#E6392F] p-0.5 ml-2"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Custom details / ingredients */}
                    <div className="text-xs text-[#7A6B56] mt-1 space-y-0.5">
                      <p className="font-semibold capitalize text-[#171717]">
                        Size: {item.selectedSize} • Ice: {item.selectedIce}
                      </p>
                      {item.type === 'custom' && item.customSoda && (
                        <p className="line-clamp-2 text-[11px] text-[#A8987E]">
                          {item.customSoda.base.name} + {item.customSoda.flavors.map((f) => f.name).join(', ')}
                          {item.customSoda.cream && ` + ${item.customSoda.cream.name}`}
                          {item.customSoda.toppings.length > 0 &&
                            ` + ${item.customSoda.toppings.map((t) => t.name).join(', ')}`}
                        </p>
                      )}
                    </div>

                    {/* Price and Counter */}
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-display text-lg font-bold text-[#E6392F]">
                        ₹{item.unitPrice * item.quantity}
                      </span>
                      <div className="flex items-center gap-2 border border-[#E8D9BD] rounded-lg px-2 py-1 bg-[#FFF8ED]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-[#171717] hover:text-[#E6392F] disabled:opacity-30"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-[#171717] hover:text-[#E6392F]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Calculation */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E8D9BD] bg-[#FAF2E2] space-y-3">
              {/* Promo input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-[#A8987E] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. DADDY50)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-bold uppercase rounded-xl border border-[#E8D9BD] bg-white focus:outline-none focus:border-[#E6392F]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#171717] text-white rounded-xl text-xs font-display tracking-wider hover:bg-[#E6392F] transition-colors"
                >
                  APPLY
                </button>
              </form>

              {promoMessage && (
                <p
                  className={`text-[11px] font-semibold ${
                    promoMessage.isError ? 'text-[#E6392F]' : 'text-emerald-600'
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}

              {promoCode && (
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Code &quot;{promoCode}&quot; Active
                  </span>
                  <button onClick={removePromo} className="text-emerald-800 hover:text-red-600">
                    Remove
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#7A6B56] pt-1">
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
                  <span>
                    Delivery Fee{' '}
                    {deliveryType === 'pickup'
                      ? '(Store Pickup)'
                      : subtotal >= 399
                      ? '(Free over ₹399)'
                      : ''}
                  </span>
                  <span className="font-bold text-[#171717]">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-display font-black text-[#171717] pt-2 border-t border-[#E8D9BD]">
                  <span>TOTAL AMOUNT</span>
                  <span className="text-[#E6392F]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout Link */}
              <Link
                to="/checkout"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-3.5 rounded-xl bg-[#E6392F] text-white font-display text-xl tracking-wider hover:bg-[#171717] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
