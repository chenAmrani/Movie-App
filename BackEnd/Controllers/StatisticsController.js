const Order = require("../Models/orderModel");
//ממוצע הזמנות לחודש

module.exports.genreChart = async (req, res) => {
  try {
    const statistics = await Order.aggregate([
      {
        $unwind: "$movies", // Flatten the 'movies' array
      },
      {
        $lookup: {
          from: "movies", // Collection name of movies
          localField: "movies",
          foreignField: "_id",
          as: "movieDetails",
        },
      },
      {
        $unwind: "$movieDetails",
      },
      {
        $group: {
          _id: "$movieDetails.genre", // Group by genre
          totalPurchases: { $sum: 1 }, // Count the number of orders per genre
        },
      },
    ]);

    const genreData = statistics.map((statistic) => ({
      genre: statistic._id,
      totalPurchases: statistic.totalPurchases,
    }));

    res.status(200).json(genreData);
  } catch (error) {
    res.status(400).send("Something went wrong -> genreStatistics");
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

