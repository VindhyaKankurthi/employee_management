// routing and mapping and http path methods

const express = require('express');

const employeeController = require('../controllers/employee-controller');

const router = express.Router();


router.get('/', employeeController.getEmployees);

router.post('/', employeeController.createEmployee);

router.patch('/:empID', employeeController.updateEmployee);

router.delete('/:eid', employeeController.deleteEmployee);

module.exports = router;