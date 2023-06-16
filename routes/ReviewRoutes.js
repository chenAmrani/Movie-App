const { Router } = require("express"); 
const {
  getObject,
  addObject,
  updateObject,
  deleteObject,
} = require("../Controllers/ReviewController");
const router1 = Router(); 

router1.get("/review", getObject); 
router1.post("/addReview", addObject); 
router1.post("/updateReview", updateObject); 
router1.post("/deleteReview", deleteObject);
module.exports = router1;
