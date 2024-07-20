// Dependencies
const inquirer = require("inquirer");
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


function viewEmployee() {
    // Your logic to view employees
    console.log("Viewing all employees...");
}