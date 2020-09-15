
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const render = require("./lib/htmlRenderer");

let teamMembers = [];

const firstQuestion = {
  type: "list",
  message: "Would you like to add a member or generate current team?",
  name: "Add",
  choices: ["Add Member", "Generate Team"],
};
const questionsYourRole = {
  type: "list",
  message: "What member you want to add?",
  name: "role",
  choices: ["Intern", "Engineer", "Manager"],
};

const fileNameQuestion = {
  type: "input",
  message: "Please enter valid file name",
  name: "fileName",
};

const Questions = {
  Manager: [
    {
      type: "input",
      message: "Please enter your name",
      name: "name",
    },
    {
      type: "input",
      message: "What is your id Number?",
      name: "id",
    },
    {
      type: "input",
      message: "What is your email?",
      name: "email",
    },
    {
      type: "input",
      message: "What is your office number?",
      name: "officeNumber",
    },
  ],
  Engineer: [
    {
      type: "input",
      message: "Your name",
      name: "name",
    },
    {
      type: "input",
      message: "What is your id Number?",
      name: "id",
    },
    {
      type: "input",
      message: "What is your email?",
      name: "email",
    },
    {
      type: "input",
      message: "What is your Github userName?",
      name: "githubUserName",
    },
  ],
  Intern: [
    {
      type: "input",
      message: "Please enter your name",
      name: "name",
    },
    {
      type: "input",
      message: "What is your id Number?",
      name: "id",
    },
    {
      type: "input",
      message: "What is your email?",
      name: "email",
    },
    {
      type: "input",
      message: "What is your school?",
      name: "school",
    },
  ],
};

const startApp = () => {
  selectRole();
};

const addOrFinish = () => {
  inquirer.prompt(firstQuestion).then((answer) => {
    if (answer.Add === "Add Member") {
      selectRole();
    } else {
      
      getFileName();
    }
  });
};

const selectRole = () => {
  inquirer.prompt(questionsYourRole).then((answer) => {
    console.log(answer);
    roleQuestions(Questions[answer.role], answer.role);
  });
};
const roleQuestions = (questions, role) => {
  inquirer.prompt(questions).then((answer) => {
    //console.log(answer);
    let member = {};
    if (role === "Manager") {
      member = new Manager(
        answer.name,
        answer.id,
        answer.email,
        answer.officeNumber
      );
    } else if (role === "Engineer") {
      member = new Engineer(
        answer.name,
        answer.id,
        answer.email,
        answer.gitHubUserName
      );
    } else if (role === "Intern") {
      member = new Intern(answer.name, answer.id, answer.email, answer.school);
    }
    teamMembers.push(member);
    addOrFinish();
  });
};
console.log(teamMembers);

const getFileName = () => {
  inquirer.prompt(fileNameQuestion).then((answer) => {
    if (answer.fileName) {
      generateTeam(answer.fileName);
    } else {
      getFileName();
    }
  });
};

const generateTeam = (fileName) => {
  const outputPath = path.join(OUTPUT_DIR, fileName + ".html");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  fs.writeFileSync(outputPath, render(teamMembers), (err) => {
    if (err) {
      console.log(err);
      getFileName();
    }
  });
};
startApp();
