const express = require('express');
const router = express.Router();
const adress = require('../controllers/addressController');

router.get('/countries', adress.countriesList);
router.get('/states/:countryId', adress.statesList);
router.get('/cities/:stateId', adress.citiesList);


module.exports = router;