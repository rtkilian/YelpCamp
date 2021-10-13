const Campground = require('../models/campground');
const Review = require('../models/review');
const axios = require('axios').default; // axios.<method> will now provide autocomplete and parameter typings

module.exports.createReview = async (req, res) => {

    // Retrieve the review and add the user ID
    const review = new Review(req.body.review);
    review.author = req.user._id; // store the user id from req which is provided by Passport

    // Call sentiment API
    const sentimentRequest = { 'review': review.body };
    const sendReviewForSentiment = async (sentimentRequest) => {
        try {
            const resp = axios.post('https://sentiment-analyser-yelpcamp.herokuapp.com/predict', sentimentRequest);
            return resp
        } catch (err) {
            console.log(err);
        }
    }
    const resp = await sendReviewForSentiment(sentimentRequest);
    review.sentiment = resp.data.score; // add sentiment to review object 

    // Add to campground object
    const campground = await Campground.findById(req.params.id);
    campground.reviews.push(review);

    // Save
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully created a new review');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash('success', 'Successfully deleted the review');
    res.redirect(`/campgrounds/${id}`);
}