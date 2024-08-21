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
          `SELECT e.empID, e.empFirstName, e.empMiddleName, e.empLastName, e.empEmail, e.empDOB, e.empJobTitle,
              d.deptName,
              a.addressLine1, a.addressLine2, a.city, a.state, a.zip, a.emContact, a.emPhone, a.homePhone
                FROM employee e
                JOIN department d ON e.deptID = d.deptID
                JOIN employee_address a ON e.empID = a.empID;`
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
        const { deptName, empFirstName, empMiddleName, empLastName, empEmail, empDOB, empJobTitle,
                addressLine1, addressLine2, city, state, zip, emContact, emPhone, homePhone
         } = req.body;

        connection.beginTransaction((err) => {
            if (err) throw err;
    
            const insertDepartment = `INSERT INTO department (deptName) VALUES (?)`;
            connection.query(insertDepartment, [deptName], (err, result) => {
                if(err) {
                    return connection.rollback(() => {
                        throw err;
                    });
                }

                const deptID = result.insertId;
                console.log("departmentId.."+deptID);
            
            
            const insertEmployee = `INSERT INTO employee (
                                        empFirstName, empMiddleName, empLastName, empEmail, empDOB, empJobTitle, deptID) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?)`;
                connection.query(
                    insertEmployee, [empFirstName, empMiddleName, empLastName, empEmail, empDOB, empJobTitle, deptID], 
                        (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            throw err;
                        });
                    }
    
                const empID = result.insertId;
                console.log("employeeId.."+empID);
    
                const insertAddress = `INSERT INTO employee_address (
                                        addressLine1, addressLine2, city, state, 
                                        zip, emContact, emPhone, homePhone, empID) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                connection.query(insertAddress, [addressLine1, addressLine2, city, state, 
                    zip, emContact, emPhone, homePhone, empID], (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            throw err;
                        });
                    }
    
                    connection.commit((err) => {
                        if (err) {
                            return connection.rollback(() => {
                                throw err;
                            });
                        }
                        res.send('Employee created');
                    });
                });
            });

        })

        });

        } catch (err) {
            await connection.promise().rollback();
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