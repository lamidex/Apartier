const Apartment = require('../models/apartment');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

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
      console.log('Request body:', req.body); 
      const { name, state, rooms, address, pricePerNight } = req.body;
      
      if (!name || !state || !rooms || !address || !pricePerNight) {
        return res.status(400).json({ 
          error: 'All fields are required',
          received: { name, state, rooms, address, pricePerNight }
        });
      }
  
      if (!req.files || !req.files.image1 || !req.files.image2) {
        return res.status(400).json({ error: 'Both images are required' });
      }
  
      const image1Path = req.files.image1[0].path;
      const image2Path = req.files.image2[0].path;
  
      
      const [image1Upload, image2Upload] = await Promise.all([
        cloudinary.uploader.upload(image1Path),
        cloudinary.uploader.upload(image2Path)
      ]);
  
      
      const apartment = await Apartment.create({
        name: name.toString(),
        state: state.toString(),
        rooms: parseInt(rooms),
        address: address.toString(),
        pricePerNight: parseFloat(pricePerNight),
        image1: image1Upload.secure_url,
        image2: image2Upload.secure_url
      });
  
      
      fs.unlinkSync(image1Path);
      fs.unlinkSync(image2Path);
  
      res.status(201).json(apartment);
    } catch (error) {
      console.error('Apartment creation error:', error);
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