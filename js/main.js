let questions = [];
let falseAnswer = false;

//When window is loaded fetch questions and store them in questions array
window.addEventListener("load", fetchQuestions);

function fetchQuestions() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "questions.json", true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState == 4) {
            let data = JSON.parse(xhr.responseText);

            //Store 3 random questions from JSON file in an array
            while (questions.length < 3) {
                let randomQuestion = Math.floor(Math.random() * data.length);
                if (!questions.includes(data[randomQuestion])) {
                    questions.push(data[randomQuestion]);
                }
            }

            //Add event listener to start button
            let startButton = document.querySelector(".btn-start");
            startButton.classList.add("slide-up");
            startButton.addEventListener("click", startQuiz);
        }
    };
}

function startQuiz(e) {
    e.preventDefault();
    //Variable for a number of actually visible question
    let number = 1;

    let startingScreen = document.querySelector(".starting-section");
    startingScreen.classList.add("hide");

    fillQuizContainers(number);
}

//Function that fills empty quiz containers with questions from an array 
function fillQuizContainers(number) {
    //Creating all elements needed
    let quizContainers = document.querySelectorAll(".quiz-container");

    for (let i = number - 1; i < quizContainers.length; i++) {
        let question = document.createElement("p");
        let answers = [document.createElement("a"), document.createElement("a")];
        let questionNumber = document.createElement("p");

        //Creating text nodes with text from questions array
        let questionText = document.createTextNode(questions[i].question);
        let answersText = [document.createTextNode(questions[i].answers[0]), document.createTextNode(questions[i].answers[1])];
        let numberOfQuestionText = document.createTextNode(`Pytanie ${i+1}/3`);

        for (let j = 0; j < answers.length; j++) {
            answers[j].setAttribute("href", "#");
            answers[j].classList.add("answer");
            answers[j].appendChild(answersText[j]);
            answers[j].addEventListener("click", (e) => {
                //Function that checks if clicked answer is true or not
                checkQuestion(e, number, quizContainers);
                number++;
            });
        }

        //Appending all elements to DOM
        question.appendChild(questionText);
        question.classList.add("question");

        questionNumber.appendChild(numberOfQuestionText);
        questionNumber.classList.add("question-number");

        quizContainers[i].appendChild(question);
        quizContainers[i].appendChild(answers[1]);
        quizContainers[i].appendChild(answers[0]);
        quizContainers[i].appendChild(questionNumber);
    };

    quizContainers[0].classList.add("show");
}

function checkQuestion(e, number, quizContainers) {
    e.preventDefault();

    //If the answer is wrong variable changes and CV won't show up
    if (e.target.innerText != questions[number - 1].trueAnswer) {
        falseAnswer = true;
    }

    e.target.parentNode.classList.add("hide");
    e.target.parentNode.classList.remove("show");

    if (number < 3) {
        //If there were no enough answers continue showing questions
        quizContainers[number].classList.add("show");
    } else {
        let access = document.querySelector(".access-section");
        let accessText = document.querySelector(".access-section h1");

        //Show granted or denied board based on falseAnswer variable
        if (falseAnswer == true) {
            let accessDenied = document.createTextNode("Odmowa dostępu do CV");
            accessText.appendChild(accessDenied);

            access.classList.add("denied");

        } else {
            let accessGranted = document.createTextNode("Uzyskano dostęp do CV");
            accessText.appendChild(accessGranted);

            access.classList.add("granted");

            setTimeout(() => {
                showCV(access);
            }, 2000);
        }
    }
}

function showCV(access) {
    let cv = document.querySelector(".cv-section");
    let quizSection = document.querySelector(".quiz-section");

    access.classList.contains("granted") ? access.classList.remove("granted") : false;

    quizSection.classList.add("hide");

    //Finally showing CV
    cv.style.display = "flex";
    setTimeout(() => {
        cv.classList.add("show");
    }, 100);
}