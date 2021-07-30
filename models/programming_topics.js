const mongoose = require('mongoose');


//userSchema object defines the structure of the user documents
const topicSchema = new mongoose.Schema({ 
    name : {
      type : String,
      required : true, 
    },

  });

const Section = mongoose.model('Section', topicSchema);
//The first argument is the singular name of the collection your model is for. 
//Mongoose automatically looks for the plural, lowercased version of your model name. 
//Thus, for the example above, the model Section is for the sections collection in the database.
module.exports = Section;