
const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");



exports.createCategory = asyncHandler(async(req,res)=> {
    try{
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    }
    catch(error){
        throw new Error(error);
    }
});

exports.updateCategory = asyncHandler(async(req,res)=> {
    const {id} = req.params;
    try{
        const updatedCategory = await Category.findByIdAndUpdate(id,req.body,{
            new:true,
        });
        res.json(updatedCategory);
    }
    catch(error){
        throw new Error(error);
    }
});

exports.deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const deletedCategory = await Category.findByIdAndDelete(id);
      res.json(deletedCategory);
    } catch (error) {
      throw new Error(error);
    }
  });

  exports.getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const getaCategory = await Category.findById(id);
      res.json(getaCategory);
    } catch (error) {
      throw new Error(error);
    }
  });


  exports.getallCategory = asyncHandler(async (req, res) => {
    try {
      const getallCategory = await Category.find();
      res.json(getallCategory);
    } catch (error) {
      throw new Error(error);
    }
  });