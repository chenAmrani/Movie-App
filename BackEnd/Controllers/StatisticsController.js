const Order = require("../modules/OrderModules");
//ממוצע הזמנות לחודש
module.exports.mostGenrePerMonth = async (req, res) => {
  try {
    const statistics = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$purchaseDate" },
            month: { $month: "$purchaseDate" },
            genre: {$genre: "$genre"}, // Group by genre as well
          },
          count: { $sum: 1 }, // Count the number of movies with the same genre in each month
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          count: -1, // Sort by count in descending order (most bought genre first)
        },
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
          },
          mostBoughtGenre: { $first: "$_id.genre" }, // Get the most bought genre for each month
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const months = [];
    const mostBoughtGenres = [];

    statistics.forEach((statistic) => {
      const month = `${statistic._id.year}-${statistic._id.month}`;
      months.push(month);
      mostBoughtGenres.push(statistic.mostBoughtGenre);
    });

    const data = {
      months: months,
      mostBoughtGenres: mostBoughtGenres,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(400).send("Something went wrong -> mostGenrePerMonth");
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

//סך כל הרכישות לחודש
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

