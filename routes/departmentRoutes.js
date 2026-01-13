const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

router.get('/:id/count', departmentController.getDepartmentCount);

module.exports = router;
