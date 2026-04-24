import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import InvoiceModal from '../components/InvoiceModal';
import { BASE_API_URL } from '../api';
import { useAuth } from '../context/AuthContext';

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAdmin } = useAuth();

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_API_URL}/api/invoices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch invoices');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreateInvoice = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_API_URL}/api/invoices`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsModalOpen(false);
      fetchInvoices();
    } catch (err) {
      alert('Failed to create invoice');
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (window.confirm('Delete this invoice?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${BASE_API_URL}/api/invoices/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchInvoices();
      } catch (err) {
        alert('Failed to delete invoice');
      }
    }
  };

  const generatePDF = (invoice) => {
    const doc = new jsPDF();
    const user = JSON.parse(localStorage.getItem('user'));

    // Header
    doc.setFontSize(22);
    doc.text('INVOICE', 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 14, 30);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 14, 35);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 14, 40);

    // From / To
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('FROM:', 14, 55);
    doc.setFontSize(10);
    doc.text(user.name, 14, 62);
    doc.text(user.email, 14, 67);

    doc.setFontSize(12);
    doc.text('BILL TO:', 120, 55);
    doc.setFontSize(10);
    doc.text(invoice.clientId.name, 120, 62);
    doc.text(invoice.clientId.email, 120, 67);

    // Items Table
    const tableColumn = ['Description', 'Quantity', 'Price', 'Total'];
    const tableRows = [];

    invoice.items.forEach((item) => {
      const rowData = [
        item.description,
        item.quantity,
        `$${item.price.toLocaleString()}`,
        `$${item.total.toLocaleString()}`,
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 80,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });

    // Totals
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 150;
    doc.text(`Subtotal: $${invoice.subtotal.toLocaleString()}`, 140, finalY);
    doc.text(`Tax: $${invoice.tax.toLocaleString()}`, 140, finalY + 7);
    doc.setFontSize(14);
    doc.text(`Total: $${invoice.totalAmount.toLocaleString()}`, 140, finalY + 16);

    doc.save(`${invoice.invoiceNumber}.pdf`);
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading billing data...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter">Billing & Invoices</h1>
          <p className="text-gray-400 mt-2 text-lg">
            Manage your client payments and professional documentation.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-2xl shadow-blue-600/30 active:scale-95 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Create Invoice
        </button>
      </div>

      <div className="bg-gray-900/50 rounded-[40px] border border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-8 py-6 text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Invoice #
                </th>
                <th className="px-8 py-6 text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Client
                </th>
                <th className="px-8 py-6 text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-8 py-6 text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-8 py-6 text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Total
                </th>
                <th className="px-8 py-6 text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-gray-500 italic text-lg">
                    No invoices generated yet. Start by creating one!
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-800/20 transition-colors group">
                    <td className="px-8 py-6 font-bold text-white">{invoice.invoiceNumber}</td>
                    <td className="px-8 py-6">
                      <p className="text-gray-100 font-medium">{invoice.clientId?.name}</p>
                      <p className="text-xs text-gray-500">{invoice.clientId?.email}</p>
                    </td>
                    <td className="px-8 py-6 text-gray-400">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                          invoice.status === 'Paid'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : invoice.status === 'Overdue'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xl font-black text-white">
                      ${invoice.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => generatePDF(invoice)}
                          className="p-2.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"
                          title="Download PDF"
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
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12"
                            />
                          </svg>
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteInvoice(invoice._id)}
                            className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                            title="Delete"
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
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateInvoice}
      />
    </div>
  );
}

export default Invoices;
