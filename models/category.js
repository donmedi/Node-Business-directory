var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    name: String
});

const Category = mongoose.model('Category',categorySchema);

// async function createCategory() {
//     const addCategory = new Category({
//         name: 'Utility',
//         description: 'hardware store',
//     }); 
    
//     const result = await addCategory.save();
//         console.log(result);  
// };
// createCategory();

module.exports = Category;
