// Dependencies
const inquirer = require("inquirer");
const pool = require('./db/connections');
//const table = ("console.table");
//SQL db
const db = require("./db/connections");
//Options prompts
const prompt = require("./util/options");


//Promp start here
const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'prompt',
            message: 'What would you like to do?',
            choices: ['View All Employees','View Departments', 'View Roles', 'View Employees by Department', 'View Employees by Manager', 'View Department Budget', 'Add Employee', 'Add Department', 'Add Role', 'Update Employee Role', 'Update Employee Manager', 'Remove Employee', 'Remove Department', 'Remove Role', 'Quit' ], 
        },
    ]).then((answer) => {
        switch (answer.prompt) {
            //options by View
            case "View All Employees":
                viewEmployee();
                break;
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "View Employees by Department": //Bonus
                viewEmployeeByDepartment();
                break;
            case "View Employees by Manager":   //Bonus
				viewEmployeeByManager();
				break;
            case "View Department Budget": //Bonus
                viewDepartmentBudget();
                break;
            // Add options
            case "Add Employee":
                 addEmployee();
                 break;
            case "Add Department":
                addDepartment();
                break; 
            case "Add Role":
                addRole();
                break;                       
            // Update options
            case "Update Employee Role":
				updateEmployeeRole();
				break; 
			case "Update Employee Manager": //Bonus
				updateEmployeeManager();
				break;
            // Delete options
            case "Remove Employee":  //Bonus
				deleteEmployee();
				break;
            case "Remove Department":   //Bonus
                removeDepartment();
                break;
            case "Remove Role":  //Bonus
                removeRole();
                break;
            case "Quit":
                db.end();
        console.log("Bye")
                break;  
            default:
                console.log('Please choose an option.');
            }
        }).catch((error) => {
          console.error('Error during prompt:', error)
        });
      };           
      



// View Employees
function viewEmployee() {
	console.log("Employees");

	const query = `
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, 
               CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON d.id = r.department_id
        LEFT JOIN employee m ON m.id = e.manager_id`;

    pool.query(query, (err, res) => {
        if (err) throw err;

        console.table(res.rows);

        promptUser();
    });
}

// View Departments
function viewDepartments() {
    const query = "SELECT * FROM department";
    pool.query(query, function (err, res) {
        if (err) throw err;
        console.log(`\nDEPARTMENTS:\n`);
        res.rows.forEach((department) => {
            // console.log(`ID: ${department.id} | ${department.name} Department`);
        });
        console.table(res.rows);

        promptUser();
    });
}

// View Roles
function viewRoles() {
    const query = "SELECT * FROM role";
    pool.query(query, function (err, res) {
        if (err) throw err;
        console.log(`\nROLES:\n`);
        res.rows.forEach((role) => {
            // console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary}`,);
        });
        console.table(res.rows);
        promptUser();
    });
}


// View Employees by Department

function viewEmployeeByDepartment() {
    console.log("View employees by department\n");

    const query = `SELECT d.id, d.name
    FROM employee e
    LEFT JOIN role r
    ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`;

    pool.query(query, function (err, res) {
        if (err) throw err;

    //Select Department
    const departmentOptions = res.rows.map((data) => ({
        value: data.id,
        name: data.name,
    }));    

    inquirer
       .prompt(prompt.departmentPrompt(departmentOptions))
       .then(function (answer) {
        const query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
			FROM employee e
			JOIN role r
				ON e.role_id = r.id
			JOIN department d
			    ON d.id = r.department_id
			WHERE d.id = $1`;

            pool.query(query, [answer.departmentId], function (err,res) {
                if (err) throw err;
                console.table(res.rows);
                promptUser();
            });
       });
    });
}

// View Employee by Manager

function viewEmployeeByManager() {
    console.log("Manager Employees:\n");

    const query = `SELECT e.manager_id, CONCAT(m.first_name, ' ', m.last_name) AS manager 
    FROM employee e 
    LEFT JOIN role r ON e.role_id = r.id
  	LEFT JOIN department d ON d.id = r.department_id
  	LEFT JOIN employee m ON m.id = e.manager_id 
    GROUP BY e.manager_id, m.first_name, m.last_name`;

    pool.query(query,function (err, res) {
        if (err) throw err;

        //Select Manager to see their employees
        const managerOptions = res.rows.map((data) => ({
            value: data.manager_id,
            name: data.manager,
        }));

        inquirer
            .prompt(prompt.viewManagerPrompt(managerOptions))
            .then(function (answer) {
                const query = `SELECT e.id, e.first_name, e.last_name, r.title, CONCAT(m.first_name, ' ', m.last_name) AS manager
			FROM employee e
			JOIN role r ON e.role_id = r.id
			JOIN department d ON d.id = r.department_id
			LEFT JOIN employee m ON m.id = e.manager_id
			WHERE m.id = $1`;

            pool.query(query, [answer.managerId], function (err,res){
                if (err) throw err;
                console.table(res.rows);
                promptUser();
            });
        });
    });

}

//View Department Budget
function viewDepartmentBudget() {
    const query = `SELECT d.name, SUM(r.salary) AS budget
		FROM employee e 
		LEFT JOIN role r ON e.role_id = r.id
		LEFT JOIN department d ON r.department_id = d.id
		GROUP BY d.name`;

        pool.query(query, function (err, res) {
            if (err) throw err;

            console.log(`\nDEPARTMENT BUDGET:\n`);
            res.rows.forEach((department) => {
                // console.log( `Department: ${department.name} Budget: ${department.budget}`,);
            });
            console.table(res.rows);
            promptUser();
        });
}

//Add an Employee
const addEmployee = async () => {
    try {
  
      const rolesQuery = `SELECT r.id, r.title FROM role r`;
      const rolesResult = await pool.query(rolesQuery);
      const roles = rolesResult.rows;
  
      const rolesChoices = roles.map(role => ({
        name: `${role.title}`,
        value: role.id
      }))
  
      const managersQuery = `SELECT e.id, e.first_name, e.last_name FROM employee e`;
      const managersResult = await pool.query(managersQuery);
      const managers = managersResult.rows;
  
      const managersChoices = managers.map(manager => ({
        name: `${manager.first_name} ${manager.last_name}`,
        value: manager.id
      }));
  
      const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        {
          type: 'input',
          name: 'first_name',
          message: `What is the employee's first name?`,
        },
        {
          type: 'input',
          name: 'last_name',
          message: `What is the employee's last name?`,
        },
        {
          type: 'list',
          name: 'role_id',
          message: `What is the employee's role?`,
          choices: rolesChoices,
        },
        {
          type: 'list',
          name: 'manager_id',
          message: `Who is the employee's manager?`,
          choices: managersChoices,
        },
      ]);
  
      const selectedRole = roles.find(role => role.id === role_id);
      const selectedManager = managers.find(manager => manager.id === manager_id);
  
      //find the highest employee id and create the new employee with the the id+1
      const maxIdQuery = 'SELECT MAX(id) as max_id FROM employee';
      const maxIdResult = await pool.query(maxIdQuery);
      const nextId = (maxIdResult.rows[0].max_id || 0) + 1;
  
      const query = 'INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const res = await pool.query(query, [nextId, first_name, last_name, role_id, manager_id]);
      console.table(`Added ${first_name} ${last_name} with the role of ${selectedRole.title} reporting to ${selectedManager.first_name} ${selectedManager.last_name} to the database`)
      promptUser();
    } catch (err) {
      console.error('Error adding Employee', err.message);
    }
  };

  //Add a Department 
const addDepartment = async () => {
    try {
        const { name } = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the name of the department?',
            },
        ]);

const maxIdQuery = 'SELECT MAX(id) AS max_id FROM department';
const maxIdResult = await pool.query(maxIdQuery);
const nextId = (maxIdResult.rows[0].max_id || 0) + 1;


const query = `INSERT INTO department (id, name) VALUES ($1, $2) RETURNING *`;
const res = await pool.query(query, [nextId, name]);
console.log(`Added ${name} to the database`);
promptUser();
  } catch (err) {
    console.error('Error adding Department', err);
  }
};

// Add a Role
const addRole = async () => {
    try {
  
      const departmentsQuery = `SELECT d.id, d.name FROM department d`;
      const departmentsResult = await pool.query(departmentsQuery);
      const departments = departmentsResult.rows;
  
      const departmentChoices = departments.map(department => ({
        name: `${department.name}`,
        value: department.id
      }))
  
      const { title, salary, department_id } = await inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'What is the title of the role?'
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the salary for the role?'
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'What is the name of the department?',
          choices: departmentChoices,
        },
      ]);
  
      const selectedDepartment = departments.find(department => department.id === department_id);
  
      const maxIdQuery = 'SELECT MAX(id) as max_id FROM role';
      const maxIdResult = await pool.query(maxIdQuery);
      const nextId = (maxIdResult.rows[0].max_id || 0) + 1;
  
      const query = 'INSERT INTO role (id, title, salary, department_id) VALUES ($1, $2, $3, $4) RETURNING *';
      const res = await pool.query(query, [nextId, title, salary, department_id]);
      console.log(`Added ${title} to the ${selectedDepartment.name} department in the database`);
      promptUser();
    } catch (err) {
      console.error('Error adding Role', err);
    }
  };

  //Update an Employee's role
  const updateEmployeeRole = async() => {
    try {
        const employeesQuery = `SELECT e.id, e.first_name, e.last_name FROM employee e`;
        const employeesResult =  await pool.query(employeesQuery);
        const employees = employeesResult.rows;

        const employeesChoices = employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }));

        const rolesQuery = `SELECT r.id, r.title FROM role r`;
        const rolesResult = await pool.query(rolesQuery);
        const roles = rolesResult.rows;

        const rolesChoices = roles.map(role => ({
            name: `${role.title}`,
            value: role.id
        }))

        const { employee_id, role_id} = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: `What employee would you like to update?`,
                choices: employeesChoices,
            },
            {
                type: 'list',
                name: 'role_id',
                message: `Select a new role for the update:`,
                choices: rolesChoices,
            },
        ]);
        
        const selectedEmployee = employees.find(employee => employee.id === employee_id);
        const selectedRole = roles.find(role => role.id === role_id);

        const query = `UPDATE employee SET role_id = $2 WHERE id = $1`;
        const res = await pool.query(query, [employee_id, role_id]);
        console.log(`${selectedEmployee.first_name} ${selectedEmployee.last_name} updated to role ${selectedRole.title}`);
        promptUser();
    } catch (err) {
        console.error('Error updating employee', err.message);
    };
  };

  // Remove employee
  function deleteEmployee() {
	console.log("Deleting an employee");

	const query = `SELECT e.id, e.first_name, e.last_name
      FROM employee e`;

	pool.query(query, function (err, res) {
		if (err) throw err;
		// Select Employee to remove
		const deleteEmployeeChoices = res.rows.map(({ id, first_name, last_name }) => ({
			value: id,
			name: `${id} ${first_name} ${last_name}`,
		}));

		inquirer
			.prompt(prompt.deleteEmployee(deleteEmployeeChoices))
			.then(function (answer) {
				const query = `DELETE FROM employee WHERE id = $1`;
				// after prompting, remove item from the db
				pool.query(query, [answer.employeeId], function (err, res) {
					if (err) throw err;

					console.log("\n" + res.rowCount + "  employee deleted");
					
					promptUser();
				});
			});
	});
}

    // Remove Department
function removeDepartment() {
	console.log("\nRemove a Department:\n");

	var query = `SELECT e.id, e.name FROM department e`;

	db.query(query, function (err, res) {
		if (err) throw err;
		// Select Department to Remove
		const removeDepartmentChoices = res.rows.map(({ id, name }) => ({
			value: id,
			name: `${id} ${name}`,
		}));

		inquirer
			.prompt(prompt.removeDepartmentPrompt(removeDepartmentChoices))
			.then(function (answer) {
				var query = `DELETE FROM department WHERE id = $1`;
				// after prompting, remove item from the db
				db.query(query, [answer.departmentId], function (
					err,
					res,
				) {
					if (err) throw err;

					console.log("\n" + res.affectedRows + " department deleted");
					
					viewDepartments();
				});
			});
	});
}

    // Remove role
    function removeRole() {
        console.log("Deleting a role");
    
        var query = `SELECT e.id, e.title, e.salary, e.department_id FROM role e`;
    
        db.query(query, function (err, res) {
            if (err) throw err;
            // Select Role to Remove
            const removeRoleChoices = res.rows.map(({ id, title }) => ({
                value: id,
                name: `${id} ${title}`,
            }));
    
            inquirer
                .prompt(prompt.removeRolePrompt(removeRoleChoices))
                .then(function (answer) {
                    var query = `DELETE FROM role WHERE id = $1`;
                    // after prompting, remove item from the db
                    db.query(query,  [answer.roleId], function (err, res) {
                        if (err) throw err;
    
                        console.log("\n" + res.affectedRows + " role deleted");
                        
                        viewRoles();
                    });
                });
        });
    }


  promptUser();