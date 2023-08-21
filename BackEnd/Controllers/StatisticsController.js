const Order = require("../modules/OrderModules");
module.exports.cumlatioveAmountPerMounth = async (req, res) => {
  try {
    
    // The result of the $group stage will include the grouped _id field with the year and month,
    // as well as the averageAmount field with the calculated average order number for each group.
    const statistics = await Order.aggregate([
      {
        //The $group stage groups the documents based on the values of the _id field.
        $group: {
          //The _id field is an object with two fields: year and month.
          _id: {
            //The year field is calculated using the $year operator, which extracts the year from the purchaseDate field.
            year: { $year: "$purchaseDate" },
            //The month field is calculated using the $month operator, which extracts the month from the purchaseDate field.
            month: { $month: "$purchaseDate" },
          },
          //Within each group, the $avg operator calculates the average value of the orderNumber field.
          averageAmount: { $avg: "$orderNumber" }, // Calculate average order number
        },
      },
      {
        $sort: {
          "_id.year": 1, // Sort by year in ascending order (1..2..)
          "_id.month": 1, // Sort by month in ascending order
        },
      },
    ]);
    res.send(year);
    const months = [];
    const averages = [];

    statistics.forEach((statistic) => {
      const month = `${statistic._id.year}-${statistic._id.month}`;
      months.push(month);
      averages.push(statistic.averageAmount);
    });

    const data = {
      months: months,
      averages: averages,
    };

    // res.status(200).json(data);
  } catch (error) {
     res.status(400).send("Something went wrong -> cumlatioveAmountPerMounth");
  }
};

/** total of the number of purchases per month
 *
 * @description Calculates the total number of purchases per month.
 * Retrieves the count of orders grouped by year and month.
 * Sorts the results in ascending order by year and month.
 * Constructs an array of months and an array of totals.
 * Sends a response with the constructed data.
 */
module.exports.totalNumberOfPurchasesPerMonth = async (req, res) => {
  try {
    const statistics = await Order.aggregate([
      {
        //The $group stage groups the documents based on the values of the _id field.
        $group: {
          _id: {
            year: { $year: "$purchaseDate" }, // Group by year
            month: { $month: "$purchaseDate" }, // Group by month
          },
          totalPurchases: { $sum: 1 }, // Count the number of orders
        },
      },
      {
        $sort: {
          "_id.year": 1, // Sort by year in ascending order (1..2..)
          "_id.month": 1, // Sort by month in ascending order
        },
      },
    ]);

    const months = [];
    const totals = [];

    statistics.forEach((statistic) => {
      const month = `${statistic._id.year}-${statistic._id.month}`;
      months.push(month);
      totals.push(statistic.totalPurchases);
    });

    const data = {
      months: months,
      totals: totals,
    };

    res.status(200).json(data);
  } catch (error) {
    res
      .status(400)
      .send("Something went wrong -> totalNumberOfPurchasesPerMonth");
  }
};

