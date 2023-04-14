const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const { Octokit } = require("@octokit/rest");

// OpenAI Config
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


// Octokit Config
const octokit = new Octokit({
  auth: process.env.PERSONAL_ACCESS_TOKEN,
});

const owner = "SSHSRN";
const repo = "AI-ChatBot";

const getRes = async (openai, userPrompt) => {
  let res = await openai.createCompletion({
    model: "text-davinci-003",
    // Find the other models here: https://platform.openai.com/playground/
    prompt: userPrompt,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  console.log(res.data.choices[0].text);
  return res.data.choices[0].text;
};

const getImg = async (openai, userPrompt) => {
  let res = await openai.createImage({
    prompt: userPrompt,
    n: 1,
    size: "1024x1024",
  });
  var image_url = res.data.data[0].url;
  return image_url;
};

const image_requested = async (prompt) => {
  let message = prompt.toLowerCase();
  message += ` Does the above prompt ask for an image as response? Reply with "yes" or "no" and nothing else.`;
  const res = await getRes(openai, message);
  return (res.toLowerCase());
};

const get_text_response = async (req, res) => {
  const checkImg = await image_requested(req.body.prompt);
  console.log("image check: " + checkImg);
  if (checkImg.includes("yes")) {
    console.log("image requested");
    const userPrompt = req.body.prompt;
    const response = await getImg(openai, userPrompt);
    resObj = {
      "image_requested": true,
      "image_link": ""
    }
    resObj["image_link"] = response;
    console.log(resObj);
    res.send(resObj);
  } else {
    console.log("text requested");
    const userPrompt = req.body.prompt;
    const response = await getRes(openai, userPrompt);
    res.send(response);
  }
}

const get_image_response = async (req, res) => {
  console.log(req.body.prompt);
  const userPrompt = req.body.prompt;
  const response = await getImg(openai, userPrompt);
  res.send(response);
}

const play_akinator = async (req, res) => {
  const category = req.body.category;
  console.log(`Let's play akinator on ${category}!`);
  res.send("Yet to work on this");
}

const create_issue = async (req, res) => {
  console.log(req.body);
  let issueTitle = await getRes(openai, `${req.body.message}\n\nWhat should be the title for this feature or bug that has been submittwd by a user for imprvoing the application?
    Reply only with a proper title for the issue following the github issue naming conventions and nothing else.`);
  console.log(issueTitle);
  // remove quotation marks from the title
  issueTitle = issueTitle.replace(/['"]+/g, '');
  const issue = await octokit.issues.create({
    owner,
    repo,
    title: issueTitle,
    body: `${req.body.message}`,
    labels: [`${req.body.type}`],
  });
  console.log(issue);
  res.send("success");
};

const create_issue_with_assignee = async (req, res) => {
  console.log(req.body);
  let issueTitle = await getRes(openai, `${req.body.message}\n\nWhat should be the title for this feature or bug that has been submittwd by a user for imprvoing the application?
    Reply only with a proper title for the issue following the github issue naming conventions and nothing else.`);
  console.log(issueTitle);
  // remove quotation marks from the title
  issueTitle = issueTitle.replace(/['"]+/g, '');
  const issue = await octokit.issues.create({
    owner,
    repo,
    title: issueTitle,
    body: `${req.body.message}`,
    labels: [`${req.body.type}`],
    assignees: [`${req.body.githubID}`],
  });
  console.log(issue);
  res.send({
    issue_creation: "success"
  });
}

module.exports = {
  get_text_response,
  play_akinator,
  get_image_response,
  create_issue,
  create_issue_with_assignee,
}