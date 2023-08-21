const { Router } = require("express"); 


const{
    cumlatioveAmountPerMounth,
    totalNumberOfPurchasesPerMonth,
} =require("../Controllers/StatisticsController")
const router=Router();



router.get("/cumlatioveAmountPerMounth", cumlatioveAmountPerMounth);
router.get("/totalNumberOfPurchasesPerMonth", totalNumberOfPurchasesPerMonth);

module.exports = router;