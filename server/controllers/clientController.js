const Client = require('../models/Client');

// @desc    Get all clients for logged in user
// @route   GET /api/clients
// @access  Private
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ userId: req.user._id });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
exports.createClient = async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;

    const client = await Client.create({
      name,
      email,
      phone,
      company,
      userId: req.user._id,
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Make sure user owns client
    if (client.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Make sure user owns client
    if (client.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await client.deleteOne();

    res.json({ message: 'Client removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
