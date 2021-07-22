// select Elements
let countQuestionSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets-time .spans");
let quizArea = document.querySelector(".quiz-area");
let AnswrsOfQuestion = document.querySelector(".answers-area ");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdown = document.querySelector(".countdown");
let questionIndex = 0;
let theTotalRightAnswer = 0;
let countDownInterval;
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.open("Get", "Html_questions.json", true);
  myRequest.send();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      //   console.log(this.responseText);
      let questionObject = JSON.parse(this.responseText);
      // console.log(questionObject);
      let questionNumber = questionObject.length;
      setQuesNumAndCreateBullets(questionNumber);
      // Add Question Data
      addQuestionData(questionObject[questionIndex], questionNumber);

      // start countDown
      countDown(60, questionNumber);

      submitButton.onclick = () => {
        if (questionIndex < questionNumber) {
          // console.log(htmlQNumber)
          // console.log(questionIndex)

          checkAnswer(
            questionObject[questionIndex].right_answer,
            questionNumber
          );
          questionIndex++;
          // Get Next Question
          quizArea.innerHTML = "";
          AnswrsOfQuestion.innerHTML = "";
          // questionIndex++;
          addQuestionData(questionObject[questionIndex], questionNumber);
          // Handle Bullets to active
          let allBullets = Array.from(bulletsSpanContainer.children);
          allBullets[questionIndex - 1].classList.add("on");
          // console.log(questionIndex)
        }

        // start countDown
        clearInterval(countDownInterval);
        countDown(60, questionNumber);

        if (questionIndex === questionNumber) {
          submitButton.classList.add("unactive");
          submitButton.innerHTML = "Finish";
          showResult(questionNumber);
        }
      };
    }
  };
}

getQuestions();

function setQuesNumAndCreateBullets(Qnum) {
  countQuestionSpan.innerHTML = Qnum;
  for (let i = 0; i < Qnum; i++) {
    let bullet = document.createElement("span");
    bulletsSpanContainer.appendChild(bullet);
  }
}

function addQuestionData(object, Qnum) {
  if (questionIndex < Qnum) {
    let questionTittle = document.createElement("h2");
    let QuestionText = document.createTextNode(object.title);
    questionTittle.appendChild(QuestionText);
    quizArea.appendChild(questionTittle);
    // create Answers
    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      let theInput = document.createElement("input");
      let lable = document.createElement("label");
      theInput.name = "question";
      theInput.type = "radio";
      theInput.id = `answer_${i}`;
      theInput.dataset.answer = object[`answer_${i}`];
      lable.setAttribute("for", theInput.id);
      lable.innerHTML = object[`answer_${i}`];
      mainDiv.appendChild(theInput);
      mainDiv.appendChild(lable);
      AnswrsOfQuestion.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, Qnum) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === choosenAnswer) {
    // console.log("true");
    theTotalRightAnswer++;
  }
  // else{
  //   console.log("false")
  // }
  // console.log(theTotalRightAnswer)
}

function showResult(Qnum) {
  let theResult;
  if (theTotalRightAnswer === Qnum) {
    theResult = `<span class="perfect">perfect</span>, ${theTotalRightAnswer} from ${Qnum}`;
  } else if (theTotalRightAnswer < Qnum && theTotalRightAnswer > Qnum / 2) {
    theResult = `<span class="good">Good</span>, ${theTotalRightAnswer}  from ${Qnum}`;
  } else {
    theResult = `<span class="bad">Bad</span>, ${theTotalRightAnswer}  from ${Qnum}`;
  }
  resultsContainer.innerHTML = theResult;
  resultsContainer.style.display = "block";
  // Remove quizArea and AnswrsOfQuestion from Dom
  quizArea.remove();
  AnswrsOfQuestion.remove();
  bulletsSpanContainer.parentElement.remove();
}

function countDown(duration, Qnum) {
  if (questionIndex < Qnum) {
    let minuts, seconds;
    countDownInterval = setInterval(function () {
      minuts = parseInt(duration / 60);
      seconds = duration % 60;
      if (minuts < 10) {
        minuts = `0${minuts}`;
      }
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
      countdown.innerHTML = `${minuts} : ${seconds}`;
      duration--;
      if (duration < 0) {
        clearInterval(countDownInterval);
        console.log("time finish");
        submitButton.click();
      }
    }, 1000);
  }
}

// to prevent open context menu
window.addEventListener("contextmenu", (e) => e.preventDefault());
