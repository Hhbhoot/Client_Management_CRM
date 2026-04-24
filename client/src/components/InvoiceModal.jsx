import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BASE_API_URL } from '../api';

function InvoiceModal({ isOpen, onClose, onSubmit }) {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    clientId: '',
    items: [{ description: '', quantity: 1, price: 0, total: 0 }],
    tax: 0,
    dueDate: '',
    status: 'Unpaid',
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_API_URL}/api/clients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(response.data);
      } catch (err) {
        console.error('Failed to fetch clients');
      }
    };
    if (isOpen) fetchClients();
  }, [isOpen]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === 'quantity' || field === 'price') {
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    }

    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, price: 0, total: 0 }],
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((acc, item) => acc + item.total, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-gray-950 border border-gray-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h2 className="text-3xl font-black text-white tracking-tight">Create New Invoice</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="premium-label">Select Client</label>
              <select
                required
                className="premium-input appearance-none"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              >
                <option value="" className="bg-gray-900">
                  Select a client
                </option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id} className="bg-gray-900">
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="premium-label">Due Date</label>
              <DatePicker
                selected={formData.dueDate ? new Date(formData.dueDate) : null}
                onChange={(date) => setFormData({ ...formData, dueDate: date })}
                className="premium-input block w-full !bg-gray-950"
                dateFormat="MMMM d, yyyy"
                placeholderText="Select due date..."
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="premium-label">Line Items</label>
              <button
                type="button"
                onClick={addItem}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 items-end bg-gray-900/30 p-4 rounded-2xl border border-gray-800/50"
                >
                  <div className="col-span-12 md:col-span-6 space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      Description
                    </label>
                    <input
                      required
                      placeholder="Service name..."
                      className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Qty</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, 'quantity', parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Price</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="col-span-3 md:col-span-1 text-right py-3">
                    <p className="text-sm font-bold text-white">${item.total.toLocaleString()}</p>
                  </div>
                  <div className="col-span-1 flex justify-end py-2">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end space-y-4 pt-4 border-t border-gray-800">
            <div className="w-full max-w-xs space-y-4">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-sm uppercase font-bold tracking-wider">Subtotal</span>
                <span className="text-lg font-bold text-white">
                  ${calculateSubtotal().toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-gray-500 uppercase shrink-0">
                  Tax Amount
                </label>
                <input
                  type="number"
                  className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-2 text-sm text-right focus:outline-none"
                  value={formData.tax}
                  onChange={(e) =>
                    setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                <span className="text-lg uppercase font-black text-blue-400 tracking-tighter">
                  Total Amount
                </span>
                <span className="text-3xl font-black text-white">
                  ${(calculateSubtotal() + (parseFloat(formData.tax) || 0)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </form>

        <div className="p-8 border-t border-gray-800 bg-gray-900/50 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 px-6 rounded-2xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceModal;
