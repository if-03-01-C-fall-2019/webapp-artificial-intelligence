function on() {
  document.getElementById("overlay").style.display = "block";
  document.body.style.position = "fixed";
  nextQuestionID = 1;
  fetchQuestion(nextQuestionID);
}

function off() {
  document.getElementById("overlay").style.display = "none";
  document.body.style.position = "static";
}

function next(){
  let selectedAnswer;

  if((selectedAnswer = answerSelected()) != undefined){
    document.getElementById("error").hidden = true;

    saveResult(selectedAnswer);
    fetchQuestion(nextQuestionID);
  } else {
    showError();
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
  let errorElem = document.getElementById("error");
  errorElem.removeAttribute("hidden");
}

//JSON-Server functions

let currentQuestion;
let nextQuestionID;

function fetchQuestion(id){
  fetch("http://dev.byiconic.at:3000/questions?ID="+id+"").then (response => response.json())
  .then(function(data){
    currentQuestion = data[0];
    nextQuestionID++;

    if(data.length == 1){
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
  fetch("http://dev.byiconic.at:3000/results?id="+id+"").then (response => response.json())
  .then(function(data){
    increaseServerCounts(data[0], id, selectedAnswer);
  })
}

function increaseServerCounts(currentResult, questionID, selectedAnswer) {
  let newResult = currentResult;
  newResult.count++;
  if(selectedAnswer === currentQuestion.RightAnswer)
    newResult.correctCount++;

  updateServer(newResult);
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
