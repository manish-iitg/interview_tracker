const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please enter your name'],
    },
    img:{
        type:String,
        required:[true, 'Please enter the image url'],
    },
    college:{
        type: String,
        required: [true, 'Please enter the name of your college'],
    },
    company_placed:{
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'Company',
    },
    intro:{
        type: String,
        required: [true, 'Please enter a few words in intro'],
    },
    readMore_url:{
        type: String,
        required: [true, 'Please provide the url of your complete interview'],
    },
    Approved:{
        type:Boolean,
    },
});

const Experience = mongoose.model('Experience', interviewSchema);

module.exports = Experience;