let articleID = -1;

let answeredQuestions = [];

function on(articleId) {
  let btn = document.getElementById("quiz"+articleId);
  if(btn.hasAttribute("done")){
      alert("You have already answered those questions!");
      return;
  }

  articleID = articleId;

  document.getElementById("questionOverlay").style.display = "block";
  document.body.style.position = "fixed";
  nextQuestionID = 1;
  fetchQuestion(nextQuestionID);

  btn.setAttribute("done", "true");
}

function off() {
  document.getElementById("questionOverlay").style.display = "none";
  document.body.style.position = "static";
}

function next(){
  let btn = document.getElementById("submitButton");

  if(btn.innerText == "Next"){
    btn.innerText = "Submit";
    document.getElementById("info").hidden = true;
    fetchQuestion(nextQuestionID);
  }
  else{
    let selectedAnswer = "";

    if((selectedAnswer = answerSelected()) != undefined){
      document.getElementById("info").hidden = true;

      saveResult(selectedAnswer);
      btn.innerText = "Next";
    } else {
      showError();
    }
  }
}

function answerSelected(){
  const radioButtons = document.querySelectorAll('input[name="answer"]');
  for (const rb of radioButtons) {
      if (rb.checked) {
        let i = rb.value.replace("answer", "");
        return document.getElementById("label" + i).innerText;
      }
  }

  return undefined;
}

function showError(){
  let errorElem = document.getElementById("info");
  errorElem.innerText = "You must select one of the above before moving on!";
  errorElem.removeAttribute("hidden");
}

//JSON-Server functions

let currentQuestion;
let nextQuestionID;

function fetchQuestion(id){
  fetch("http://dev.byiconic.at:3000/articles/"+articleID).then (response => response.json())
  .then(function(data){
    currentQuestion = getRightQuestion(data, id);
    nextQuestionID++;

    if(currentQuestion != undefined){
      //Load Questions
      loadQuestion(currentQuestion);
    } else {
      off();
    }
  })
  .catch( function (error) {
    console.error("error: " + error);
  });
}

function getRightQuestion(data, id){
  for (let i = 0; i < data.questions.length; i++) {
    if(data.questions[i].ID == id){
      return data.questions[i];
    }
  }
}

function loadQuestion(question){
  let dest = document.getElementById("questionDiv");
  while(dest.firstChild) { dest.removeChild(dest.firstChild); }

  let questionArticle = createQuestionArticle(question);
  dest.appendChild(questionArticle);
}

function saveResult(selectedAnswer) {
  getCurrentCount(currentQuestion.ID, selectedAnswer);
}

function getCurrentCount(id, selectedAnswer){
  fetch("http://dev.byiconic.at:3000/results?id="+articleID+"").then (response => response.json())
  .then(function(data){
    increaseServerCounts(data[0], id, selectedAnswer);
  })
}

function increaseServerCounts(currentResult, questionID, selectedAnswer) {
  let newResult = currentResult;
  let correct = false;

  newResult.questions[questionID-1].count++;
  if(selectedAnswer === currentQuestion.RightAnswer){
    newResult.questions[questionID-1].correctCount++;
    correct = true;
  }

  addToEndResult(correct, selectedAnswer);
  showResult(correct, currentQuestion.RightAnswer);
  updateServer(newResult);
}

function addToEndResult(correct, selectedAnswer) {
  currentQuestion.correct = correct;
  currentQuestion.selectedAnswer = selectedAnswer;

  answeredQuestions.push(currentQuestion);
}

function showResult(correct, rightAnswer){
  let infoElem = document.getElementById("info");

  if(correct){
    infoElem.style.color = "green";
    infoElem.innerText = "Correct!";

  }else{
    infoElem.style.color = "red";
    infoElem.innerText = "Incorrect! '"+rightAnswer+"' would be correct.";
  }

  infoElem.hidden = false;
}

function updateServer(newResult){
  fetch("http://dev.byiconic.at:3000/results/" + newResult.id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newResult),
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function createQuestionArticle(question){
  let result = document.createElement("article");
  result.setAttribute("class", "question");

  let h1 = document.createElement("h1");
  h1.setAttribute("class", "question");
  h1.innerText = question.Question;

  //1
  let radio1 = document.createElement("input");
  radio1.setAttribute("type", "radio");
  radio1.setAttribute("name", "answer");
  radio1.setAttribute("id", "answer1");
  radio1.setAttribute("value", "answer1");

  let label1 = document.createElement("label");
  label1.setAttribute("id", "label1");
  label1.setAttribute("class", "answerRadioBtn");
  label1.setAttribute("for", "answer1");
  label1.innerText = question.AnswerOne;

  //2
  let radio2 = document.createElement("input");
  radio2.setAttribute("type", "radio");
  radio2.setAttribute("name", "answer");
  radio2.setAttribute("id", "answer2");
  radio2.setAttribute("value", "answer2");

  let label2 = document.createElement("label");
  label2.setAttribute("id", "label2");
  label2.setAttribute("class", "answerRadioBtn");
  label2.setAttribute("for", "answer2");
  label2.innerText = question.AnswerTwo;

  //3
  let radio3 = document.createElement("input");
  radio3.setAttribute("type", "radio");
  radio3.setAttribute("name", "answer");
  radio3.setAttribute("id", "answer3");
  radio3.setAttribute("value", "answer3");

  let label3 = document.createElement("label");
  label3.setAttribute("id", "label3");
  label3.setAttribute("class", "answerRadioBtn");
  label3.setAttribute("for", "answer3");
  label3.innerText = question.AnswerThree;

  //4
  let radio4 = document.createElement("input");
  radio4.setAttribute("type", "radio");
  radio4.setAttribute("name", "answer");
  radio4.setAttribute("id", "answer4");
  radio4.setAttribute("value", "answer4");

  let label4 = document.createElement("label");
  label4.setAttribute("id", "label4");
  label4.setAttribute("class", "answerRadioBtn");
  label4.setAttribute("for", "answer4");
  label4.innerText = question.AnswerFour;

  result.appendChild(h1);

  result.appendChild(radio1);
  result.appendChild(label1);
  result.appendChild(document.createElement("br"));

  result.appendChild(radio2);
  result.appendChild(label2);
  result.appendChild(document.createElement("br"));

  result.appendChild(radio3);
  result.appendChild(label3);
  result.appendChild(document.createElement("br"));

  result.appendChild(radio4);
  result.appendChild(label4);
  result.appendChild(document.createElement("br"));

  return result;
}

function createEvaluationTable(){
  let result = document.createElement("table");
  result.setAttribute("id", "evaluationTable");

  return result;
}

function createEvaluationRow(question, rightAnswer, selectedAnswer){
  let result = document.createElement("tr");
  result.setAttribute("class", "evaluationTableRow");

  let col1 = document.createElement("td");
  col1.innerText = question;
  col1.setAttribute("class", "evaluationTableRowField")

  let col2 = document.createElement("td");
  col2.innerText = rightAnswer;
  col2.setAttribute("class", "evaluationTableRowField")

  let col3 = document.createElement("td");
  col3.innerText = selectedAnswer;
  col3.setAttribute("class", "evaluationTableRowField")

  result.appendChild(col1);
  result.appendChild(col2);
  result.appendChild(col3);

  return result;
}

function openEvaluation() {
  document.getElementById("evaluationOverlay").style.display = "block";
  document.body.style.position = "fixed";

  let table = createEvaluationTable();

  let totalCount = 0;
  let correctCount = 0;

  for(let i = 0; i < answeredQuestions.length; i++, totalCount++) {
    let newRow = createEvaluationRow(answeredQuestions[i].Question, answeredQuestions[i].RightAnswer, answeredQuestions[i].selectedAnswer);
    table.appendChild(newRow);

    if(answeredQuestions[i].RightAnswer == answeredQuestions[i].selectedAnswer){
      correctCount++;
    }
  }

  let percentage = document.createElement("p");
  percentage.innerText = (correctCount / totalCount) * 100 + " %";
  percentage.setAttribute("id", "evaluationPercentage");

  document.getElementById("evaluationContent").appendChild(table);
  document.getElementById("evaluationContent").appendChild(percentage);
}

function closeEvaluation() {
  document.getElementById("evaluationOverlay").style.display = "none";
  document.body.style.position = "static";
}
