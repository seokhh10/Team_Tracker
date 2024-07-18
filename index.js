const inquirer = require('inquirer');
const prompts = require('./util/options');  // Update with the actual path to your module

async function main() {
    try {
        const answers = await inquirer.prompt(prompts.firstPrompt);
        console.log('You selected:', answers.task);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();
