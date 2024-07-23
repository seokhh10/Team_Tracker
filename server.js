// Dependencies
const inquirer = require("inquirer");
const pool = require('./db/connections');
//const table = ("console.table");
//SQL db
const db = require("./db/connections");
//Options prompts
const prompt = require("./util/options");

// Call firstPrompt function after the module is loaded
firstPrompt();



function firstPrompt() {
    inquirer.prompt(prompt.firstPrompt).then(function({ task }) {
        switch (task) {
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
        }
    });
}


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

        firstPrompt();
    });
}

// View Departments
function viewDepartments() {
    const query = "SELECT * FROM department";
    pool.query(query, function (err, res) {
        if (err) throw err;
        console.log(`\nDEPARTMENTS:\n`);
        res.rows.forEach((department) => {
            console.log(`ID: ${department.id} | ${department.name} Department`);
        });
        console.table(res.rows);

        firstPrompt();
    });
}

// View Roles
function viewRoles() {
    const query = "SELECT * FROM role";
    pool.query(query, function (err, res) {
        if (err) throw err;
        console.log(`\nROLES:\n`);
        res.rows.forEach((role) => {
            console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary}`,);
        });
        console.table(res.rows);
        firstPrompt();
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
                firstPrompt();
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
                firstPrompt();
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
            firstPrompt();
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

