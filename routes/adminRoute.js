//creating an admin panel in node.js
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
//registering AdminBro’s database adapter for Mongoose:
const AdminBroMongoose = require('@admin-bro/mongoose');
const mongoose = require('mongoose');
AdminBro.registerAdapter(AdminBroMongoose);
const express = require('express');


//importing the models
require('../models/users');
require('../models/programming_Ques');
require('../models/programming_topics');
require('../models/Companies');
require('../models/interview_experiences');


const app = express();


const adminBro = new AdminBro ({
  databases: [mongoose],
  rootPath: '/admin',
})

const adminroutes = AdminBroExpress.buildRouter (adminBro);
module.exports = adminroutes;

