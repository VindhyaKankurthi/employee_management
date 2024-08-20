const mySql = require('mysql2');

const connection = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abcd1234',
    database: 'employee_management',
});
connection.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
      return;
    }
    console.log('Connected to the MySQL database');
  });


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

// fetching all the employees

const getEmployees = async (req,res,next) => {
    try {
        const data = await connection.promise().query(
          `SELECT *  from employee;`
        );
        res.status(202).json({
          employee: data[0],
        });
      } catch (err) {
        res.status(500).json({
          message: err.message || "An error occurred while fetching the employees",
        });
      }
};

//  creating employee API
const createEmployee = async (req, res, next) => {
    try{
        const { empFirstName, empMiddleName, empLastName, empEmail, empDOB, empJobTitle } = req.body;
        const [result] = await connection.promise().query(
            `INSERT INTO employee (
                empFirstName,
                empMiddleName, 
                empLastName,
                empEmail,
                empDOB, 
                empJobTitle
            ) 
            VALUES (?,?,?,?,?,?)`,
            [empFirstName, empMiddleName, empLastName, empEmail, empDOB, empJobTitle]
          );

          // Check if the employee was created successfully
            if (result.affectedRows === 1) {
                return res.status(201).json({
                message: "Employee created successfully",
                employeeId: result.insertId,
                });
            } else {
                throw new Error("Failed to create employee");
            }
        } catch (err) {
          res.status(500).json({
            message: err.message || "An error occurred while creating the employee",
          });
        }
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

    if(!DUMMY_EMPLOYEES.find(e => e.id === empId)) {
        res.status(404).json({ message: 'Could not find an employee with the provided id'});
    }


    DUMMY_EMPLOYEES = DUMMY_EMPLOYEES.filter(e => e.id !== empId);
    res.status(200).json({message: 'Employee deleted...'});
};

exports.getEmployees = getEmployees;
exports.createEmployee = createEmployee;
exports.updateEmployee = updateEmployee;
exports.deleteEmployee = deleteEmployee;