/* eslint no-unused-expressions: ["error", { "allowShortCircuit": true, "allowTernary": true }] */
import DB from '../models/index';
import Logger from '../loaders/logger';

const getInitalRadtingObject = () => ({
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  RatingPercentages: {
    negative: 0,
    positive: 0,
    intermediate: 0,
  },
});

const rating = async (placeId) => {
  const ratings = {
    WifiRate: getInitalRadtingObject(),
    Rating: getInitalRadtingObject(),
    GoodService: getInitalRadtingObject(),
    QuitePlace: getInitalRadtingObject(),
  };
  const place = await DB.Place.findById(placeId).lean();
  const rattingKey = ['WifiRate', 'GoodService', 'Rating', 'QuitePlace'];
  if (place.Reviews.length) {
    place.Reviews.forEach((rev) => {
      rattingKey.forEach((ratingValue) => {
        const index = rev[ratingValue];
        if (index > 0) {
          ratings[ratingValue][index] += 1;
          switch (index) {
            case 4:
            case 5:
              ratings[ratingValue].RatingPercentages.positive += 1;

              break;
            case 1:
            case 2:
              ratings[ratingValue].RatingPercentages.negative += 1;

              break;
            case 3:
              ratings[ratingValue].RatingPercentages.intermediate += 1;

              break;
            default:
              Logger.info('default case executed');
              break;
          }
        }
      });
    });
    const totalReviews = place.Reviews.length;
    rattingKey.forEach((key) => {
      const rate = ratings[key].RatingPercentages;
      if (rate.negative !== 0) {
        const negative = (rate.negative / totalReviews) * 100;
        rate.negative = Math.round(negative);
      }
      if (rate.positive !== 0) {
        const positive = (rate.positive / totalReviews) * 100;
        rate.positive = Math.round(positive);
      }
      if (rate.intermediate !== 0) {
        const intermediate = (rate.intermediate / totalReviews) * 100;
        rate.intermediate = Math.round(intermediate);
      }
    });
  }

  return ratings;
};

export default { rating };
