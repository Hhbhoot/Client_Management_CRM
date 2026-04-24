import StripeContainer from './StripeContainer';

const PaymentModal = ({ isOpen, onClose, invoice, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-gray-900 border border-gray-800 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500">
        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white">Secure Checkout</h2>
            <p className="text-gray-500 font-medium">Invoice: {invoice.invoiceNumber}</p>
          </div>

          <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl text-center">
            <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-1">
              Total Amount Due
            </p>
            <p className="text-4xl font-black text-blue-400">
              ${invoice.totalAmount.toLocaleString()}
            </p>
          </div>

          <StripeContainer
            invoice={invoice}
            onSuccess={() => {
              onSuccess();
              onClose();
            }}
            onCancel={onClose}
          />

          <div className="flex items-center justify-center gap-2 text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest">
              End-to-End Encrypted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
