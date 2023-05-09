document.addEventListener("DOMContentLoaded", () => {
    // Cargar preguntas
    fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            populateTopics(data);
            loadQuestions(data[0].topic);
        });

    // Escuchar evento de cambio en el selector de temas
    const topicSelector = document.getElementById("topic-selector");
    topicSelector.addEventListener("change", (event) => {
        loadQuestions(event.target.value);
    });

    // Escuchar evento de click en el botón de enviar
    const submitButton = document.getElementById("submit-button");
    submitButton.addEventListener("click", () => {
        // Aquí va la lógica para validar las respuestas
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

function loadQuestions(topic) {
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = ""; // Vaciar el contenedor

    const selectedTopic = questionsData.find(q => q.topic === topic);
    selectedTopic.questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");

        const questionLabel = document.createElement("label");
        questionLabel.textContent = `${index + 1}. ${question.question}`;
        questionDiv.appendChild(questionLabel);

        const optionList = document.createElement("ul");
        question.options.forEach((option, optionIndex) => {
            const optionItem = document.createElement("li");

            const optionInput = document.createElement("input");
            optionInput.type = "radio";
            optionInput.name = `question-${index}`;
            optionInput.value = optionIndex;

            const optionLabel = document.createElement("label");
            optionLabel.textContent = option;

            optionItem.appendChild(optionInput);
            optionItem.appendChild(optionLabel);
            optionList.appendChild(optionItem);
        });

        questionDiv.appendChild(optionList);
        questionContainer.appendChild(questionDiv);
    });
}