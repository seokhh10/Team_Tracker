const inquirer = require("inquirer");
const prompt = require("./util/options");



firstPrompt();

function firstPrompt() {
    //Menu
    inquirer.prompt(prompt.firstPrompt).then(function({task}){
        switch (task) {
            case "View all Employees":
            viewEmployee();
            break;
        }
    });
}

