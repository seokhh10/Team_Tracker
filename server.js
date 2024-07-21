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
            case " View Roles":
                viewRoles();
                break;
            case "View Employees by Department": //Bonus
                viewEmployeeByDepartment();
                break;
            case "View Employees by Manager":   //Bonus
				viewEmployeeByManager();
				break;
            case "View Department by Budget": //Bonus
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
        firstPrompt();
    });
}