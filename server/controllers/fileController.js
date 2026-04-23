const File = require('../models/File');

// @desc    Upload file
// @route   POST /api/files/upload
// @access  Private
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { projectId, clientId } = req.body;

        const file = await File.create({
            filename: req.file.originalname,
            url: req.file.path,
            format: req.file.format,
            size: req.file.size,
            projectId: projectId || null,
            clientId: clientId || null,
            userId: req.user._id,
        });

        res.status(201).json(file);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get files for project or client
// @route   GET /api/files
// @access  Private
exports.getFiles = async (req, res) => {
    try {
        const { projectId, clientId } = req.query;
        let query = { userId: req.user._id };

        if (projectId) query.projectId = projectId;
        if (clientId) query.clientId = clientId;

        const files = await File.find(query).sort({ createdAt: -1 });
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
exports.deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (file.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // We could also delete from Cloudinary here if needed
        await file.deleteOne();

        res.json({ message: 'File record removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
