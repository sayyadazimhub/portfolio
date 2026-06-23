import Certificate from '../models/Certificate.js';
import cloudinary from '../config/cloudinary.js';

const parseBoolean = (value) => value === true || value === 'true' || value === '1' || value === 1;

export const getCertificates = async (req, res) => {
  try {
    const { admin } = req.query;
    const query = admin === 'true' || admin === '1' ? {} : { status: true };
    const certificates = await Certificate.find(query).sort({ order: 1, issueDate: -1 });
    res.status(200).json(certificates);
  } catch (error) {
    console.error('getCertificates error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.status(200).json(certificate);
  } catch (error) {
    console.error('getCertificateById error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createCertificate = async (req, res) => {
  try {
    const { title, issuer, issueDate, credentialId, credentialUrl, status, order } = req.body;

    let certificateImage = '';
    let certificatePublicId = '';

    if (req.file) {
      certificateImage = req.file.path;
      certificatePublicId = req.file.filename || req.file.public_id;
    }

    if (!title?.trim() || !issuer?.trim() || !issueDate) {
      return res.status(400).json({ message: 'Title, Issuer, and Issue Date are required' });
    }

    const certificate = await Certificate.create({
      title: title.trim(),
      issuer: issuer.trim(),
      issueDate,
      credentialId: credentialId?.trim() || '',
      credentialUrl: credentialUrl?.trim() || '',
      certificateImage,
      certificatePublicId,
      status: status !== undefined ? parseBoolean(status) : true,
      order: order ? parseInt(order, 10) : 0,
    });

    res.status(201).json(certificate);
  } catch (error) {
    console.error('createCertificate error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    const { title, issuer, issueDate, credentialId, credentialUrl, status, order, removeImage } = req.body;

    certificate.title = title !== undefined ? title.trim() : certificate.title;
    certificate.issuer = issuer !== undefined ? issuer.trim() : certificate.issuer;
    certificate.issueDate = issueDate !== undefined ? issueDate : certificate.issueDate;
    certificate.credentialId = credentialId !== undefined ? credentialId.trim() : certificate.credentialId;
    certificate.credentialUrl = credentialUrl !== undefined ? credentialUrl.trim() : certificate.credentialUrl;
    certificate.status = status !== undefined ? parseBoolean(status) : certificate.status;
    certificate.order = order !== undefined ? parseInt(order, 10) : certificate.order;

    if (req.file) {
      if (certificate.certificatePublicId) {
        try {
          await cloudinary.uploader.destroy(certificate.certificatePublicId);
        } catch (err) {
          console.error('Failed to destroy old certificate image:', err);
        }
      }
      certificate.certificateImage = req.file.path;
      certificate.certificatePublicId = req.file.filename || req.file.public_id;
    } else if (removeImage === 'true' || removeImage === true) {
      if (certificate.certificatePublicId) {
        try {
          await cloudinary.uploader.destroy(certificate.certificatePublicId);
        } catch (err) {
          console.error('Failed to destroy old certificate image:', err);
        }
      }
      certificate.certificateImage = '';
      certificate.certificatePublicId = '';
    }

    const updatedCertificate = await certificate.save();
    res.status(200).json(updatedCertificate);
  } catch (error) {
    console.error('updateCertificate error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    if (certificate.certificatePublicId) {
      try {
        await cloudinary.uploader.destroy(certificate.certificatePublicId);
      } catch (err) {
        console.error('Failed to destroy certificate image from cloudinary:', err);
      }
    }

    await Certificate.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('deleteCertificate error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
