const mongoose = require('mongoose');


//Schema object defines the structure of the documents in the collection
const quesSchema = new mongoose.Schema({ 
    Name: {
      type : String,
      required : [true, 'Please enter the name of the question'],
      unique : true,
    },
    Link : {
        type : String,
        required : [true, 'Please enter the link'],
        unique : true,
    },
    Topic : {
       type : mongoose.Schema.Types.ObjectId, 
       ref : 'Section',
    },
    Approved: {
      type: Boolean,
    }

  });

const Question = mongoose.model( 'Question' , quesSchema );

module.exports = Question;