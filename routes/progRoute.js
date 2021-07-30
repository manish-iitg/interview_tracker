const { Router } = require ('express');
const progController = require ('../controllers/progController');
const Section = require('../models/programming_topics');

//creating an instance of the Router
const progroutes = Router();

progroutes.get('/programming', progController.prog);

progroutes.get('/programming/:topic_name', progController.progSection);
progroutes.post('/addquestion', progController.addques);

module.exports = progroutes;
