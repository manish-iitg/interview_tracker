const { Router } = require('express');
const interview_expController = require('../controllers/interview_expController');

const router = Router();

router.get('/interview_exp', interview_expController.IVhome);
router.get('/interview_exp/:recruiter', interview_expController.exp);

router.post('/addexp',  interview_expController.addexp);


module.exports = router;