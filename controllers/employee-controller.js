const { v4: uuidv4 } = require('uuid');

// different middleware functions.

let DUMMY_EMPLOYEES = [
    {
        id: 'e1',
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        department: "Software Engineer",
        address: "dehfvidfjvdfmv"
    },
    {
        id: 'e2',
        firstname: "Jane",
        lastname: "Smith",
        email: "jane@example.com",
        department: "Product Manager",
        address: "dehvvomdescodme"
    }
];


const getEmployeeById = (req,res,next) => {
    const empId = req.params.eid; // to get the value of the specific eid {eid: e1}
    const employee = DUMMY_EMPLOYEES.find(e => {
       return e.id === empId;
    });

    //error handling
    if(!employee) {
        return res.status(404).json({message: 'Could not find an employee for the provided employee id'});
    }
    res.json({ employee }); // return the response
};

const createEmployee = (req, res, next) => {
    const { firstname, lastname, email, department, address } = req.body;
    // const firstname = req.body.firstname;

    const createdEmployee = {
        id: uuidv4(),
        firstname,
        lastname,
        email,
        department,
        address
    };

    DUMMY_EMPLOYEES.push(createdEmployee);

    res.status(201).json({employee: createdEmployee});
};


const updateEmployee = (req, res, next) => {
    const { firstname, lastname, email, department, address } = req.body;
    const empId = req.params.eid;

    const updatedEmployee = {...DUMMY_EMPLOYEES.find(e => e.id === empId) };
    const employeeIndex = DUMMY_EMPLOYEES.findIndex(e => e.id === empId);

    updatedEmployee.firstname = firstname;
    updatedEmployee.lastname = lastname;
    updatedEmployee.email = email;
    updatedEmployee.department = department;
    updatedEmployee.address = address;

    DUMMY_EMPLOYEES[employeeIndex] = updatedEmployee;

    res.status(200).json({employee: updatedEmployee});
};

const deleteEmployee = (req, res, next) => {
    const empId = req.params.eid;

    DUMMY_EMPLOYEES = DUMMY_EMPLOYEES.filter(e => e.id !== empId);

    res.status(200).json({message: 'Employee deleted...'});
};

exports.getEmployeeById = getEmployeeById;
exports.createEmployee = createEmployee;
exports.updateEmployee = updateEmployee;
exports.deleteEmployee = deleteEmployee;