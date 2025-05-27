const mongoose = require('mongoose');
const Users = require('../models/userModel');      // ✅ declared once only

// DELETE a user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid user ID' });
    }

    // Delete user
    const deletedUser = await Users.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    return res.status(200).json({ status: 'success', message: 'User deleted successfully', user: deletedUser });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

const getUsersWithAddress = async (req, res) => {
  try {
    const users = await Users.aggregate([
      {
        $lookup: {
          from: 'countries',
          localField: 'countryId',
          foreignField: '_id',
          as: 'country'
        }
      },
      { $unwind: { path: '$country', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'states',
          localField: 'stateId',
          foreignField: '_id',
          as: 'state'
        }
      },
      { $unwind: { path: '$state', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'cities',
          localField: 'cityId',
          foreignField: '_id',
          as: 'city'
        }
      },
      { $unwind: { path: '$city', preserveNullAndEmptyArrays: true } },
      {
        $project:
        {
          firstName: 1,
          lastName: 1,
          emailId: 1,
          mobileNo: 1,
          country: {
            _id: "$country._id",
            name: "$country.name"
          },
          state: {
            _id: "$state._id",
            name: "$state.name"
          },
          city: {
            _id: "$city._id",
            name: "$city.name"
          },
          createdAt: 1,
          updatedAt: 1
        }

      }
    ]);

    return res.status(200).json({ status: 'success', users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid user ID' });
    }

    const users = await Users.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) }
      },
      {
        $lookup: {
          from: 'countries',
          localField: 'countryId',
          foreignField: '_id',
          as: 'country'
        }
      },
      { $unwind: { path: '$country', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'states',
          localField: 'stateId',
          foreignField: '_id',
          as: 'state'
        }
      },
      { $unwind: { path: '$state', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'cities',
          localField: 'cityId',
          foreignField: '_id',
          as: 'city'
        }
      },
      { $unwind: { path: '$city', preserveNullAndEmptyArrays: true } },

      {
        $project: {
          firstName: 1,
          lastName: 1,
          emailId: 1,
          mobileNo: 1,
          createdAt: 1,
          updatedAt: 1,
          country: {
            _id: "$country._id",
            name: "$country.name"
          },
          state: {
            _id: "$state._id",
            name: "$state.name"
          },
          city: {
            _id: "$city._id",
            name: "$city.name"
          }
        }
      }
    ]);

    if (!users || users.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    return res.status(200).json({ status: 'success', user: users[0] });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid user ID' });
    }

    const { firstName, lastName, emailId, mobileNo, countryId, stateId, cityId } = req.body;

    // Prepare update object (only include provided fields)
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (emailId !== undefined) updateData.emailId = emailId.toLowerCase();
    if (mobileNo !== undefined) updateData.mobileNo = mobileNo;
    if (countryId !== undefined) updateData.countryId = new mongoose.Types.ObjectId(countryId);
    if (stateId !== undefined) updateData.stateId = new mongoose.Types.ObjectId(stateId);
    if (cityId !== undefined) updateData.cityId = new mongoose.Types.ObjectId(cityId);

    const updatedUser = await Users.findByIdAndUpdate(userId, updateData, {
      new: true, // Return updated document
      runValidators: true
    });

    if (!updatedUser) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    return res.status(200).json({ status: 'success', user: updatedUser });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};



module.exports = {
  deleteUser,
  getUsersWithAddress,
  getUserById,
  updateUserById
};
