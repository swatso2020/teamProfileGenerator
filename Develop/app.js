const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
//===================================================================
// Welcome to a team information HTML generator!
//===================================================================

// This array fills in with employee data.
const teamMembers = [];
// Manager will change-- can't be a const. 
let manager;
// This info is for the HTML.
let teamTitle;

//=========================================================
// First, we prompt the user for the manager/project info.
//=========================================================

function managerData() {
    inquirer.prompt([
        {   // Fill html with teamName.
            type: "input",
            message: "What is the name of this team/project?",
            name: "teamTitle"
        },
        {   // There is only 1 manager for a team.
            type: "input",
            message: "Who is the manager of this project?",
            name: "managerName"
        },
        {   // Employee ID.
            type: "input",
            message: "What is the manager's ID?",
            name: "managerID"
        },
        {   // Employee Email.
            type: "input",
            message: "What is the manager's email?",
            name: "managerEmail"
        },
        {
            type: "input",
            message: "What is the manager's office number?",
            name: "officeNumber"
        }]).then(managerAnswers => {
            manager = new Manager(managerAnswers.managerName, managerAnswers.managerID, managerAnswers.managerEmail, managerAnswers.officeNumber);
            teamTitle = managerAnswers.teamTitle;
            console.log("Now we will ask for employee information.")
            lesserEmployeeData();
        });
}
//=================================================================
// This repeats if more employees need to be added.
//=================================================================
function lesserEmployeeData() {
    inquirer.prompt([
        {
            type: "list",
            message: "What is this employee's role?",
            name: "employeeRole",
            choices: ["Intern", "Engineer"]
        },

        //==================================================================
        // These questions are based on the employeeRole above.
        //==================================================================
        {
            type: "input",
            message: "What is the employee's name?",
            name: "employeeName"
        },
        {
            type: "input",
            message: "What is the employee's id?",
            name: "employeeId"
        },
        {
            type: "input",
            message: "What is the employee's email?",
            name: "employeeEmail"
        },
        {
            type: "input",
            message: "What is the Engineer's Github?",
            name: "github",
            when: (userInput) => userInput.employeeRole === "Engineer"
        },
        {
            type: "input",
            message: "What's the Intern's school?",
            name: "school",
            when: (userInput) => userInput.employeeRole === "Intern"
        },
        {
            type: "confirm",
            name: "newEmployee",
            message: "Would you like to add another team member?" // if yes, go back again. If no, renderHTML
        }
    ]).then(answers => {
        //============================================================
        // Pushes a new intern into the team members array
        //============================================================
        if (answers.employeeRole === "Intern") {
            const employee = new Intern(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.school);
            teamMembers.push(employee);
        } else if (answers.employeeRole === "Engineer") {
            // A different way of pushing the info into teamMembers array.
            teamMembers.push(new Engineer(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.github));
        }
        if (answers.newEmployee === true) {
            lesserEmployeeData();
        } else {
            //==================
            //renderHTML
            //==================

            var main = fs.readFileSync('./templates/main.html', 'utf8');
            // The slashes and g => regular expressions (regex)
            // This allows the replace function to replace all occurances of teamTitle.
            // If I just did '{{teamTitle}}' then it only replaces the first instance.
            main = main.replace(/{{teamTitle}}/g, teamTitle);

            // Loop through the employees and print out all of their cards without replacing the previous one.
            var managerCard = fs.readFileSync('./templates/Manager.html', 'utf8');
            managerCard = managerCard.replace('{{name}}', manager.getName());
            managerCard = managerCard.replace('{{role}}', manager.getRole());
            managerCard = managerCard.replace('{{id}}', manager.getId());
            managerCard = managerCard.replace('{{email}}', manager.getEmail());
            managerCard = managerCard.replace('{{officeNumber}}', manager.getOfficeNumber());

            //=====================================================
            // Append all of the team members after manager
            //=====================================================

            var cards = managerCard; // Initial cards only has the Manager card info.
            for (var i = 0; i < teamMembers.length; i++) {
                var employee = teamMembers[i];
                // Cards adds and then equals every new employee card info.
                cards += renderEmployee(employee);
            }

            // Adds cards to main.html and outputs to team.html.
            main = main.replace('{{cards}}', cards);

            fs.writeFileSync('./output/team.html', main);

            // Console.log that the html has been generated
            console.log("The team.html has been generated in output");
        }
    });
}

// renderEmployee function that is called above.

function renderEmployee(employee) {
    if (employee.getRole() === "Intern") {
        var internCard = fs.readFileSync('./templates/Intern.html', 'utf8');
        internCard = internCard.replace('{{name}}', employee.getName());
        internCard = internCard.replace('{{role}}', employee.getRole());
        internCard = internCard.replace('{{id}}', employee.getId());
        internCard = internCard.replace('{{email}}', employee.getEmail());
        internCard = internCard.replace('{{school}}', employee.getSchool());
        return internCard;
    } else if (employee.getRole() === "Engineer") {
        var engineerCard = fs.readFileSync('./templates/Engineer.html', 'utf8');
        engineerCard = engineerCard.replace('{{name}}', employee.getName());
        engineerCard = engineerCard.replace('{{role}}', employee.getRole());
        engineerCard = engineerCard.replace('{{id}}', employee.getId());
        engineerCard = engineerCard.replace('{{email}}', employee.getEmail());
        engineerCard = engineerCard.replace('{{github}}', employee.getGithub());
        return engineerCard;
    }
}

managerData();
// const util = require("util");

// const writeFileAsync = util.promisify(fs.writeFile);

// const teamMembers = [];

// const managerQuestions = [
//     {
//         type: "input",
//         name: "name",
//         message: "What is your manager's name?",
//         default: "Nelio"
//     },
//     {
//         type: "input",
//         name: "id",
//         message: "What is your manager's id?",
//         default: "1234"
//     },
//     {
//         type: "input",
//         name: "email",
//         message: "What is your manager's email?",
//         default: "nelio@nelio.com"
//     },
//     {
//         type: "input",
//         name: "officeNumber",
//         message: "What is your manager's office number?",
//         default: "305 786 1212"
//     },
//     {
//         type: "list",
//         name: "teamMember",
//         message: "Which type of team member would you like to add?",
//         choices: [
//             "Engineer",
//             "Intern",
//             "I don't want to add any more team members."
//         ]
//     },
// ];

// const engineerQuestions = [
//     {
//         type: "input",
//         name: "name",
//         message: "What is your engineer's name?",
//         default: "David"
//     },
//     {
//         type: "input",
//         name: "id",
//         message: "What is your engineer's id?",
//         default: "56789"
//     },
//     {
//         type: "input",
//         name: "email",
//         message: "What is your engineer's email?",
//         default: "david@david.com"
//     },
//     {
//         type: "input",
//         name: "github",
//         message: "What is your engineer's GitHub username?",
//         default: "githubTAdavid"
//     },
//     {
//         type: "list",
//         name: "teamMember",
//         message: "Which type of team member would you like to add?",
//         choices: [
//             "Engineer",
//             "Intern",
//             "I don't want to add any more team members."
//         ]
//     },
// ];

// const internQuestions = [
//     {
//         type: "input",
//         name: "name",
//         message: "What is your intern's name?",
//         default: "Lisa"
//     },
//     {
//         type: "input",
//         name: "id",
//         message: "What is your intern's id?",
//         default: "2020"
//     },
//     {
//         type: "input",
//         name: "email",
//         message: "What is your intern's email?",
//         default: "lisa@lisa.com"
//     },
//     {
//         type: "input",
//         name: "school",
//         message: "What is your intern's school?",
//         default: "UMiami"
//     },
//     {
//         type: "list",
//         name: "teamMember",
//         message: "Which type of team member would you like to add?",
//         choices: [
//             "Engineer",
//             "Intern",
//             "I don't want to add any more team members."
//         ]
//     },
// ];


// function promptManager(questions, employeeType) {
//     inquirer.prompt(questions)
//         .then(function (answers) {

//             let newTeamMember;

//             if (employeeType == "Manager") {
//                 newTeamMember = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
//             } else if (employeeType == "Engineer") {
//                 newTeamMember = new Engineer(answers.name, answers.id, answers.email, answers.github);
//             } else if (employeeType == "Intern") {
//                 newTeamMember = new Intern(answers.name, answers.id, answers.email, answers.school);
//             }

//             teamMembers.push(newTeamMember);

//             writeFileAsync("./output/team.html", render.render(teamMembers));

//             if (answers.teamMember == "I don't want to add any more team members.") {
//                 return answers;
//             } else if (answers.teamMember == "Engineer") {
//                 promptManager(engineerQuestions, "Engineer");
//             } else if (answers.teamMember == "Intern") {
//                 promptManager(internQuestions, "Intern");
//             } else {
//                 console.log("Error");
//             }

//             return answers;

//         }).catch(function (err) {
//             console.log(err);
//         });

// }


// console.log("Manager: Please build your team.\n");

// promptManager(managerQuestions, "Manager");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
