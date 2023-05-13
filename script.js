document.addEventListener("DOMContentLoaded", () => {
    // Cargar preguntas
    fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            populateTopics(data);
            createMockExam(data);
            loadQuestions(data[0].topic);
        });

    // Escuchar evento de cambio en el selector de temas
    const topicSelector = document.getElementById("topic-selector");
    topicSelector.addEventListener("change", (event) => {
        loadQuestions(event.target.value);
		// al cambiar de topic, asegurarse que el botón cambie de estado si se ha usado
		hideAnswers();
    });

    // Escuchar evento de click en el botón de enviar
    const submitButton = document.getElementById("submit-button");
    submitButton.addEventListener("click", () => {
        // Aquí va la lógica para validar las respuestas
    });

    const viewAnswersButton = document.getElementById("view-answers-button");
    viewAnswersButton.addEventListener("click", () => {
        viewAnswers();
    });
});

function calculateScore() {
    const selectedTopic = questionsData.find(q => q.topic === document.getElementById("topic-selector").value);
    const totalQuestions = selectedTopic.questions.length;
    const pointsPerQuestion = 10 / totalQuestions;
    let score = 0;

    selectedTopic.questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);

        if (selectedOption) {
            const selectedIndex = parseInt(selectedOption.value);

            if (selectedIndex === question.answer) {
                score += pointsPerQuestion;
            } else {
                score -= pointsPerQuestion / totalQuestions;
            }
        }
    });

    // Asegurarse de que la nota esté en el rango de 0 a 10
    score = Math.min(Math.max(score, 0), 10);
    alert(`Tu nota es: ${score.toFixed(2)}`);
}

// Escuchar evento de click en el botón de enviar
const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", () => {
    calculateScore();
    displayResults();
});



let questionsData = [];

function populateTopics(questions) {
    questionsData = questions;
    const topicSelector = document.getElementById("topic-selector");
    questions.forEach(questionSet => {
        const option = document.createElement("option");
        option.value = questionSet.topic;
        option.textContent = questionSet.topic;
        topicSelector.appendChild(option);
    });
}

function displayResults() {
    const selectedTopic = questionsData.find(q => q.topic === document.getElementById("topic-selector").value);

    selectedTopic.questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
        const questionDiv = document.querySelector(`.question[data-index="${index}"]`);
		const traversalElement = document.querySelector(`.traversal-element[data-index="${index}"]`)
        if (selectedOption) {
            const selectedIndex = parseInt(selectedOption.value);
            const optionItem = selectedOption.parentElement;

            if (selectedIndex === question.answer) {
                optionItem.style.backgroundColor = "#5ce25c";
				traversalElement.className = 'traversal-element correct'
            } else {
                optionItem.style.backgroundColor = "#e25c5c";
				traversalElement.className = 'traversal-element incorrect'
            }
        }

        const explanation = document.createElement("p");
        explanation.className = "explanation";
        explanation.textContent = question.explanation;
        //check if the explanation is already displayed
        if(questionDiv.lastChild.className != "explanation"){

            questionDiv.appendChild(explanation);
        }
    });
}

function loadQuestions(topic) {
	// obtener los contenedores
    const questionContainer = document.getElementById("question-container");
	const traversalContainer = document.getElementById('traversal-container')
	// Vaciar los contenedores
    questionContainer.innerHTML = ""; 
	traversalContainer.innerHTML = ''; 

    const selectedTopic = questionsData.find(q => q.topic === topic);
    selectedTopic.questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");
		// add unique index per question
		questionDiv.id = `q_${index}`
        questionDiv.dataset.index = index;

        const questionLabel = document.createElement("label");
        questionLabel.textContent = `${index + 1}. ${question.question}`;
        questionDiv.appendChild(questionLabel);
		// populate traversal
		const traversalDiv = document.createElement('div')
		traversalDiv.classList.add('traversal-element')
		traversalDiv.dataset.index = index
		const traversalButton = document.createElement('a')
		traversalButton.classList.add('traversal-button')
		traversalButton.href = `#q_${index}`
		const traversalText = document.createElement('span')
		traversalText.textContent = index+1
		traversalText.classList = 'traversal-text'
		traversalButton.appendChild(traversalText)
		traversalDiv.appendChild(traversalButton)
		traversalContainer.appendChild(traversalDiv)

        const optionList = document.createElement("ul");
        question.options.forEach((option, optionIndex) => {
            const optionItem = document.createElement("li");
			optionItem.className = "answer"


            const optionInput = document.createElement("input");
            optionInput.type = "radio";
            optionInput.name = `question-${index}`;
            optionInput.value = optionIndex;
			optionInput.id = `question-${index}-${optionIndex}`;

            const optionLabel = document.createElement("label");
            optionLabel.textContent = option;
			optionLabel.htmlFor = `question-${index}-${optionIndex}`;

            optionItem.appendChild(optionInput);
            optionItem.appendChild(optionLabel);
            optionList.appendChild(optionItem);

            optionItem.addEventListener("click", (event) => {
                if(event.target !== optionInput) {
                    optionInput.click();
					traversalDiv.classList.add('answered')
                }
            });

        });
		questionDiv.appendChild(optionList);
		questionContainer.appendChild(questionDiv);
    });
}

//Marks the correct answers and displays the explanation
function viewAnswers(){
    const selectedTopic = questionsData.find(q => q.topic === document.getElementById("topic-selector").value);

    selectedTopic.questions.forEach((question, index) => {
        const questionDiv = document.querySelector(`.question[data-index="${index}"]`);
        const explanation = document.createElement("p");
        explanation.className = "explanation";

        explanation.textContent = question.explanation;
        if(questionDiv.lastChild.className != "explanation"){
            questionDiv.appendChild(explanation);
        }

        //Marks the correct answer
        const correctOption = document.getElementById(`question-${index}-${question.answer}`);
        const correctOptionItem = correctOption.parentElement; 
        correctOptionItem.style.backgroundColor = "green";
        correctOptionItem.style.color = "white";
        correctOption.checked = true;

    });

    //change the button to hide answers
    const viewAnswersButton = document.getElementById("view-answers-button");
    viewAnswersButton.textContent = "Ocultar respuestas";
    viewAnswersButton.removeEventListener("click", viewAnswers);
    viewAnswersButton.addEventListener("click", hideAnswers);
}

function hideAnswers() {
    const explanationList = document.querySelectorAll(".explanation");
    explanationList.forEach(explanation => {
		explanation.remove();
    });
	// reset traversal
	const traversalList = document.querySelectorAll('.traversal-element')
	traversalList.forEach(traversal => {
		traversal.className = 'traversal-element'
	})

    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.checked = false;
    });

    const optionItems = document.querySelectorAll(".answer");
    optionItems.forEach(optionItem => {
        optionItem.style.backgroundColor = "#a1d5f8";
        optionItem.style.color = "black";
    });

    //change the button to view answers
    const viewAnswersButton = document.getElementById("view-answers-button");
    viewAnswersButton.textContent = "Ver respuestas";
    viewAnswersButton.removeEventListener("click", hideAnswers);
    viewAnswersButton.addEventListener("click", viewAnswers);

}

function createMockExam(data) {
    let mockExamQuestions = [];
    const numOfQuestionsPerTopic = 5;

    data.forEach(topic => {
        const questions = topic.questions;
        for(let i = 0; i < numOfQuestionsPerTopic; i++) {
            const randomIndex = Math.floor(Math.random() * questions.length);
            mockExamQuestions.push(questions[randomIndex]);
            questions.splice(randomIndex, 1); // Removemos la pregunta seleccionada para evitar duplicados
        }
    });

    shuffleArray(mockExamQuestions); // Mezcla las preguntas del simulacro de examen

    // Añadimos el nuevo tema de "Simulacro de examen" a los datos de las preguntas
    questionsData.push({
        topic: "Simulacro de examen",
        questions: mockExamQuestions
    });

    // Añadimos la opción de "Simulacro de examen" al selector de temas
    const topicSelector = document.getElementById("topic-selector");
    const option = document.createElement("option");
    option.value = "Simulacro de examen";
    option.textContent = "Simulacro de examen";
    topicSelector.appendChild(option);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambia elementos
    }
}