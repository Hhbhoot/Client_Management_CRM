const express = require('express');
const router = express.Router();
const {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getInvoices).post(protect, createInvoice);

router.route('/:id').put(protect, updateInvoice).delete(protect, deleteInvoice);

module.exports = router;
