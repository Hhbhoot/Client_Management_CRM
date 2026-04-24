const Invoice = require('../models/Invoice');

// @desc    Get all invoices for user
// @route   GET /api/invoices
// @access  Private
exports.getInvoices = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const invoices = await Invoice.find(query).populate('clientId', 'name email');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
exports.createInvoice = async (req, res) => {
  try {
    const { clientId, items, tax, dueDate, status } = req.body;

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const totalAmount = subtotal + (tax || 0);

    // Simple invoice number generation
    const count = await Invoice.countDocuments({ userId: req.user._id });
    const invoiceNumber = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    const invoice = await Invoice.create({
      invoiceNumber,
      clientId,
      items,
      subtotal,
      tax: tax || 0,
      totalAmount,
      dueDate,
      status: status || 'Unpaid',
      userId: req.user._id,
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update invoice status
// @route   PUT /api/invoices/:id
// @access  Private
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
 
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Make sure user owns invoice or is admin
    if (invoice.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
 
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Make sure user owns invoice or is admin
    if (invoice.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await invoice.deleteOne();
    res.json({ message: 'Invoice removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
