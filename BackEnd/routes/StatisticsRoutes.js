const { Router } = require("express"); 


const{
    mostGenrePerMonth,
    totalNumberOfPurchasesPerMonth,
} =require("../Controllers/StatisticsController")
const router=Router();



router.get("/mostGenrePerMonth", mostGenrePerMonth);
router.get("/totalNumberOfPurchasesPerMonth", totalNumberOfPurchasesPerMonth);

module.exports = router;