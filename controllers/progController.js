const Section = require('../models/programming_topics');
const Question = require('../models/programming_Ques');
const jwt = require('jsonwebtoken');
const {User} = require('../models/users');


const handleErrors = (err) => {
    let errors = { Name: '', Link: '' };
    
    //console.log(err,' yay!',err.errors);
    if(err.message.includes('Question validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            //console.log(properties);
            errors[properties.path] = properties.message;
        });
            return errors;
    }
  
    if(err.code === 11000){
        if(err.keyValue.Link){
        errors.Link = 'A question with this link already exists';
        }else{
            errors.Name = 'A question with this name already exists';
        }
        return errors;
    }
    
    
}

//function for displaying topics page
module.exports.prog =  (req, res) => {
    Section.find({}, (err, data) => {
        if(err){
            console.log(err);
        }else{
            res.render('programming', {topics: data});
        }
    })
    
};

//function for showing questions of a particular topic
var ID = 0, name = "";
module.exports.progSection = (req, res) => {
    name = req.params.topic_name;
    Section.find({name}, (err, data) => {
        if(err){
            console.log(err);
        }else{
            ID = data[0].id;
           //console.log(ID);
            Question.find({ Topic : ID, Approved: 'true' } , (err, data) => {
                if(err){
                    console.log(err);
                }else{
                    //console.log(data);
                    res.render('programming_section', {ques: data, name});
                }
            })
        }
    });
    
};

module.exports.addques = async(req, res) => {
    const token = req.cookies.jwt;
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
        let user = await User.findById(decodedToken.id);
        const {Name, Link} = req.body;
      //  console.log(Name, Link, user.admin);
        try {
            const ques = await Question.create({ Name, Link, Topic: ID, Approved: user.admin });
            res.status(201).json({ques : ques.Name, name, admin:user.admin });
        }
        catch(err) {
            const errors = handleErrors(err);
        // console.log(errors);
            res.status(400).json({errors});
        }
    })
};



