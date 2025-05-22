require('dotenv').config();
const mongoose = require('mongoose');
const Country = require('./models/countryModel');
const State = require('./models/stateModel');
const City = require('./models/cityModel');

const MONGODB_URI = process.env.MONGODB_URI;

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clean existing data
    await Country.deleteMany();
    await State.deleteMany();
    await City.deleteMany();

    // Countries
    const india = await Country.create({ name: 'India', status: true });
    const pakistan = await Country.create({ name: 'Pakistan', status: true });
    const uk = await Country.create({ name: 'UK', status: true });
    const usa = await Country.create({ name: 'United States', status: true });

    // States & Cities - India
    const bihar = await State.create({ name: 'Bihar', countryId: india._id ,status: true});
    const delhi = await State.create({ name: 'Delhi', countryId: india._id ,status: true});
    const maharashtra = await State.create({ name: 'Maharashtra', countryId: india._id,status: true });

    await City.create({ name: 'Patna', stateId: bihar._id ,status: true});
    await City.create({ name: 'Gaya', stateId: bihar._id,status: true });
    await City.create({ name: 'New Delhi', stateId: delhi._id ,status: true});
    await City.create({ name: 'Mumbai', stateId: maharashtra._id,status: true });
    await City.create({ name: 'Pune', stateId: maharashtra._id,status: true });

    // States & Cities - Pakistan
    const punjabPK = await State.create({ name: 'Punjab', countryId: pakistan._id,status: true });
    const sindh = await State.create({ name: 'Sindh', countryId: pakistan._id,status: true });

    await City.create({ name: 'Lahore', stateId: punjabPK._id,status: true });
    await City.create({ name: 'Rawalpindi', stateId: punjabPK._id,status: true });
    await City.create({ name: 'Karachi', stateId: sindh._id ,status: true});
    await City.create({ name: 'Hyderabad', stateId: sindh._id ,status: true});

    // States & Cities - UK
    const england = await State.create({ name: 'England', countryId: uk._id ,status: true});
    const scotland = await State.create({ name: 'Scotland', countryId: uk._id,status: true });

    await City.create({ name: 'London', stateId: england._id ,status: true});
    await City.create({ name: 'Manchester', stateId: england._id,status: true });
    await City.create({ name: 'Edinburgh', stateId: scotland._id,status: true });
    await City.create({ name: 'Glasgow', stateId: scotland._id ,status: true});

    // States & Cities - USA
    const california = await State.create({ name: 'California', countryId: usa._id,status: true });
    const newYork = await State.create({ name: 'New York', countryId: usa._id });

    await City.create({ name: 'Los Angeles', stateId: california._id,status: true,status: true });
    await City.create({ name: 'San Francisco', stateId: california._id,status: true });
    await City.create({ name: 'New York City', stateId: newYork._id ,status: true});
    await City.create({ name: 'Buffalo', stateId: newYork._id ,status: true});

    console.log('✅ All seed data inserted successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
