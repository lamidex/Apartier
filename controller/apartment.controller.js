const Apartment = require('../models/apartment');
const cloudinary = require('../config/cloudinary');

const apartmentController = {
  getAllApartments: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const apartments = await Apartment.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        apartments: apartments.rows,
        totalPages: Math.ceil(apartments.count / limit),
        currentPage: page
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  
  createApartment: async (req, res) => {
    try {
      const { name, state, rooms, address, pricePerNight } = req.body;
      const { image1, image2 } = req.files;

      
      const [image1Upload, image2Upload] = await Promise.all([
        cloudinary.uploader.upload(image1.path),
        cloudinary.uploader.upload(image2.path)
      ]);

      const apartment = await Apartment.create({
        name,
        state,
        rooms,
        address,
        pricePerNight,
        image1: image1Upload.secure_url,
        image2: image2Upload.secure_url
      });

      res.status(201).json(apartment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  
  getByState: async (req, res) => {
    try {     
      const { state } = req.params;
      const apartments = await Apartment.findAll({
        where: { state }
      });
      res.json(apartments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  
  getTotalAvailable: async (req, res) => {
    try {
      const count = await Apartment.count({
        where: { available: true }
      });
      res.json({ totalAvailable: count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = apartmentController;