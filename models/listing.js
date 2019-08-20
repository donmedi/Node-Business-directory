var mongoose = require('mongoose');

var listingSchema = new mongoose.Schema({
    name: String,
    description: String,
    website_url: String,
    contact_email: String,
    phone: String,
    address: String,
    category: Array,
    counter: {type: Number, default:0}
});

const Business = mongoose.model('Listing',listingSchema);

module.exports = Business;