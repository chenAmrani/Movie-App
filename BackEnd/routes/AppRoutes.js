const { Router } = require("express"); // מייבאת את הרוטר עי אקספרס
const {
  getObject,
  addObject,
  updateObject,
  deleteObject,
  validateMovie
} = require("../Controllers/AppController"); // מייבאת את כל המטודות של הקראד

const router = Router(); // לוקחת משתנה שהוא יהיה הרוטר שלי

router.get("/Movies", getObject); // עכשיו ברגע שאני אהיה בדף הראשי יופיעו לי כל המשימות
router.post("/add",validateMovie, addObject); //יוצרת אובייקט
router.post("/update",validateMovie, updateObject); // מעדכנת אובייקט    // שלושתם חייבים להיות פוסט כדי שיתעדכן בהתאמה
router.delete("/delete", validateMovie,deleteObject); //מוחקת אובייקט
module.exports = router;
