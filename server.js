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
            case "View All Employees":
                viewEmployee();
                break;
            // Add other cases as needed
            default:
                console.log('Invalid selection');
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