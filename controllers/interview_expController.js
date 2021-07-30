const Company = require('../models/Companies');
const Experience = require('../models/interview_experiences');
const {User} = require('../models/users');
const jwt = require('jsonwebtoken');


const handleErrors = (err) => {
    let errors = { name: '', college: '', intro: '',  readMore_url: ''};

    //console.log(err.errors.proprties);
    if(err.message.includes('Experience validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
          //  console.log(properties);
            errors[properties.path] = properties.message;
        });
            return errors;
    }
    
    
}

module.exports.IVhome = (req,res) => {
    Company.find({}, (err, data) => {
        if(err){
            console.log(err);
        }else{
            res.render('interview_exp', {Company:data});
        }
    });
};

var ID = 0, name = "";
module.exports.exp = (req, res) => {
    name = req.params.recruiter ;
    Company.find({ name }, (err, data) => {
        if(err){
            console.log(err);
        }else{
           // console.log(data);
            ID = data[0].id;
           // console.log(ID);
            Experience.find({ company_placed : ID, Approved: 'true' } , (err, data) => {
                if(err){
                    console.log(err);
                }else{
                    //console.log(data);
                    res.render('experiences', {exp: data, name});
                }
            })
        }
    });
};

module.exports.addexp = async(req, res) => {
    
    const token = req.cookies.jwt;
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
        let user = await User.findById(decodedToken.id);
        const {name, img, college, intro, readMore_url } = req.body;
        //console.log(req.body, ID);

        try {
            const exp = await Experience.create({ name, img, college, company_placed : ID, intro, readMore_url, Approved: user.admin });
            res.status(201).json({exp : exp.name , name});
        }
        catch(err) {
            const errors = handleErrors(err);
           // console.log(errors);
            res.status(400).json({errors});
        }
    })
}