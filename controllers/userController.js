
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var Users = require('../models/userModel');

const getAllUsers = async (req, res)=>{
   try{
        const allUsers = await Users.find();
       return res.status(200).send({ status: 'success', result: allUsers });
   }catch(error){
       return res.status(404).send({ status: 'fail', result: []});
   }
}
const getUsers = async (req, res)=>{
   try{
        const allUsers = await Users.find();
       return res.status(200).send({ status: 'success', result: allUsers });
   }catch(error){
       return res.status(404).send({ status: 'fail', result: []});
   }
}
const createUser = async (req, res)=>{
    try{
        let payload = req.body;//json object coming from API

        const userPayload = new Users(payload)// create mongo schema instance
        const result = await userPayload.save();
        res.status(200).send({ status: 'success', message: "User created", result: result });
    }catch(error){
        console.log(error)
    }
   return res.send({name:"demo",id:123,email:"demo@gmail.com"})
}

const deleteUser = async (req,res)=>{
    try {
        const userId = new ObjectId(req.params.id);
        const removeUser = await Users.findByIdAndDelete(userId);
        if (!removeUser) {
          return res.status(404).send({ status: "fail", message: "User not found" });
        }
        return res.status(200).send({ status: "success", result: removeUser });
      } catch (error) {
        console.log(error)
        return res.status(500).send({ status: "fail", message: error.message });
      }
}

module.exports = {
    getAllUsers,
    createUser,
    deleteUser,
    getUsers
}