const mongoose = require('mongoose');
const Tour = require('./tourModel');
const { findByIdAndUpdate } = require('./userModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      // required: [true, 'Review must be from 1 to 5'],
      min: [1, 'Review must be above 1'],
      max: [5, 'Review must be below 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// make 1 user review on 1 tour
reviewSchema.index(
  {
    tour: 1,
    user: 1,
  },
  {
    unique: true,
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  //   console.log(stats);

  // update to the db
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour); // this.constructor = Review model

  // this middleware doesn't have next() because it is document middleware
});

// findByIdAndUpdate
// findByIdAndDelete
// Because we use two methods, so the document middleware can not be used in this case. We have to use query middleware
// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   console.log('run to pre');

//   this.r = await this.findOne();
//   // this is the document before updated
//   console.log(this.r);
//   next();
// });

reviewSchema.post(/^findOneAnd/, async function (reviewDoc, next) {
  //   console.log('run to post');
  //   console.log(doc);
  await reviewDoc.constructor.calcAverageRatings(reviewDoc.tour);
  next();
  // await this.findOne() does not work here because the query has already executed
  // it's query middleware so we have to use next()
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
