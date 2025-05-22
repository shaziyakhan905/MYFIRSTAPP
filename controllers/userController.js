const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Users = require('../models/userModel');       // ✅ declared once only


// GET all users
const getAllUsers = async (req, res) => {
    try {
        const allUsers = await Users.find().populate('address');
        return res.status(200).send({ status: 'success', result: allUsers });
    } catch (error) {
        return res.status(404).send({ status: 'fail', result: [] });
    }
};

// GET users (duplicate function — you can remove it or rename it)
const getUsers = async (req, res) => {
    try {
        const allUsers = await Users.find().populate('address');
        return res.status(200).send({ status: 'success', result: allUsers });
    } catch (error) {
        return res.status(404).send({ status: 'fail', result: [] });
    }
};

// CREATE a new user


// DELETE a user
const deleteUser = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        const removeUser = await Users.findByIdAndDelete(userId);
        if (!removeUser) {
            return res.status(404).send({ status: "fail", message: "User not found" });
        }
        return res.status(200).send({ status: "success", result: removeUser });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: "fail", message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        let { firstName, lastName, emailId, mobileNo, countryId, stateId, cityId } = req.body;
        emailId = emailId.toLowerCase();
        const existingUser = await Users.findOne({ emailId });
        if (existingUser) {
            return res.status(400).send(
                { status: 'fail', message: 'Email already registered' }
            );
        }
        const user = await Users.create({
            firstName,
            lastName,
            emailId,
            mobileNo,
            countryId,
            stateId,
            cityId
        });

        return res.status(201).send({ status: 'success', user });
    } catch (error) {
        return res.status(500).send({ status: 'error', message: error.message });
    }
};


// const getUsersWithAddress = async (req, res) => {
//   try {
//     const users = await Users.aggregate([
//       {
//         $lookup: {
//           from: 'countries',
//           localField: 'countryId',
//           foreignField: '_id',
//           as: 'country'
//         }
//       },
//       //{ $unwind: '$country' }, // this will fail if no country found

//       {
//         $lookup: {
//           from: 'states',
//           localField: 'stateId',
//           foreignField: '_id',
//           as: 'state'
//         }
//       },
//       //{ $unwind: '$state' },

//       {
//         $lookup: {
//           from: 'cities',
//           localField: 'cityId',
//           foreignField: '_id',
//           as: 'city'
//         }
//       },
// //{ $unwind: '$city' },

//       // Optional: Format fields
//       {
//         $project: {
//           firstName: 1,
//           lastName: 1,
//           mobileNo: 1,
//           emailId: 1,
//           country: '$country.name',
//           state: '$state.name',
//           city: '$city.name'
//         }
//       }
//     ]);

//     res.status(200).json({ status: 'success', users });
//   } catch (error) {
//     console.error('Aggregation error:', error);
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// };





module.exports = {
    getAllUsers,
    getUsers,
    deleteUser,
    // getUsersWithAddress,
    createUser
};
