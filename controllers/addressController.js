const express = require('express');
const Country = require('../models/countryModel');
const State = require('../models/stateModel');
const City = require('../models/cityModel');
const router = express.Router();

// Get all countries
const countriesList = async (req, res) => {
const countries = await Country.find({ status: true });
 // console.log('Countries fetched:', countries);
  res.json(countries);
};

// Get states by country

const statesList = async (req, res) => {
 const states = await State.find({ countryId: req.params.countryId, status: true });
  res.json(states);
};

// Get cities by state

const citiesList = async (req, res) => {
  const cities = await City.find({ stateId: req.params.stateId, status: true });
  res.json(cities);
};

module.exports = {
countriesList,
statesList,
citiesList
};
