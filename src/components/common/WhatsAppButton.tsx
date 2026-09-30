import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '918237522072';
  const defaultMessage = encodeURIComponent(
    'Hello Himmat Beverages! I am interested in exploring the Daddy Soda House Franchise opportunity. Please share the details.'
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-5 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-xs sm:text-sm shadow-xl hover:bg-[#1EBE5D] hover:scale-105 transition-all duration-300 border-2 border-white/40"
      aria-label="Chat on WhatsApp with Himmat Beverages"
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="font-semibold tracking-wide">Chat on WhatsApp</span>
    </a>
  );
}
