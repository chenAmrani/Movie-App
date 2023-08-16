const { Router } = require("express");
const {
  getObject,
  addObject,
  updateObject,
  deleteObject,
  validateMovie
} = require("../Controllers/AppController");

const router = Router(); 

router.get("/Movies", getObject); 
router.post("/add",validateMovie, addObject); 
router.post("/update",validateMovie, updateObject); 
router.delete("/delete", validateMovie,deleteObject); 
module.exports = router;
