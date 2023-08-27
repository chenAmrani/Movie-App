const { Router } = require("express"); 


const{
    genreChart,
    totalNumberOfPurchasesPerMonth,
} =require("../Controllers/StatisticsController")
const router=Router();



router.get("/genreChart", genreChart);
router.get("/totalNumberOfPurchasesPerMonth", totalNumberOfPurchasesPerMonth);

module.exports = router;