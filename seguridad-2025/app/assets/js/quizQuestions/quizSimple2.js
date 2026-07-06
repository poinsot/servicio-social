let fin = document.getElementById("fin-del-modulo");
var questions = [
  {
    text: `OSHA no ha contribuido en nada a reducir la tasa de mortalidad relacionada con el trabajo.`,
    image: `../../assets/images/course/modulo2/osha-3.png`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 1,
    answers: [`Verdadero`, `Falso`],
  },
  {
    text: `El empleador puede solicitar una reunión informal con el Director de Área si recibe una citación.`,
    image: `../../assets/images/course/modulo2/reunion.jpg`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 0,
    answers: [`Verdadero`, `Falso`],
  },
  {
    text: `No es necesario que el inspector de OSHA presente sus credenciales oficiales.`,
    image: `../../assets/images/course/modulo2/documents.jpg`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 1,
    answers: [`Verdadero`, `Falso`],
  },
  {
    text: `En las violaciones internacionales se paga hasta $70,000 dólares maximo o encarcelamiento de hasta 6 meses si provocó fatalidad.`,
    image: `../../assets/images/course/modulo2/dinero.jpg`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 0,
    answers: [`Verdadero`, `Falso`],
  },
  {
    text: `La persona competente esta designada por cualquier empleado y no tiene autoridad para tomar acciones apropiadas.`,
    image: `../../assets/images/course/modulo1/3-maquinaria.jpg`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 1,
    answers: [`Verdadero`, `Falso`],
  },
  {
    text: `Un empleador, es una persona dedicada a un negocio comercial que ocupa trabajadores.`,
    image: `../../assets/images/course/modulo2/worker.jpg`,
    correctText: `¡Correcto!`,
    incorrectText: `Incorrecto...`,
    correctIndex: 0,
    answers: [`Verdadero`, `Falso`],
  },
];
questions = questions.sort((a, b) => 0.5 - Math.random());

const answersList = function (answers, correctIndex, id) {
  return answers
    .map((ans, i) => {
      let className = correctIndex === i ? "option buena" : "option";
      return `
      <input type="radio" class="custom-control-input ${className}" name="radiobutton${id}" />
      <button type="button" class="btn btn-outline-dark q-option-${id} mrg-btm-25 ${className}" id="U13_Q${id}_A${i}" style="width: 10rem;" onclick="selectOption('${id}', '${i}')">
          ${ans}
      </button>
      `;
    })
    .join("");
};

function selectOption(questionId, optionId) {
  // Desmarcar todos los botones de la misma pregunta
  const buttons = document.querySelectorAll(`.q-option-${questionId}`);
  buttons.forEach(button => {
      button.classList.remove('btn-dark');
      button.classList.add('btn-outline-dark');
      button.classList.remove('selected');
  });

  // Marcar el botón seleccionado
  const selectedButton = document.getElementById(`U13_Q${questionId}_A${optionId}`);
  selectedButton.classList.remove('btn-outline-dark');
  selectedButton.classList.add('btn-dark');
  selectedButton.classList.add('selected');

  // Crear o actualizar el input radio correspondiente
  let radioInput = document.querySelector(`input[name="radiobutton${questionId}"]`);
  if (!radioInput) {
      radioInput = document.createElement('input');
      radioInput.type = 'radio';
      radioInput.name = `radiobutton${questionId}`;
      radioInput.style.display = 'none';
      document.body.appendChild(radioInput);
  }
  radioInput.value = optionId;
  radioInput.checked = true;
}

const question = function (
  i,
  { text, image, incorrectText, correctText, correctIndex, answers }
) {
  const answersHtml = answersList(answers, correctIndex, i);

  return `
        <div class="question col-md-5 col-sm-12 mx-1 margin-10">
            <p class="question-text">
                ${i + 1}. ${text}
            </p>
            <div class="row justify-content-center">
            <p class="alertWrong mb-2 font-size-14 font-weight-bold" style="display: none; color: red">
                ${incorrectText}
            </p>
            <p class="alertCorrect mb-2 font-size-14 font-weight-bold" style="display: none; color: green">
                ${correctText}
            </p>
            </div>
            <div class="row justify-content-center">
              ${answersHtml}
              <div class="w-100"></div>
              <div class="quiz">
                <img src="${image}" alt="" class="img-fluid rounded mrg-btm-20">
              </div>
            </div>
        </div>
        `;
};

const generateQuestions = function () {
  return questions
    .map((q, i) => {
      return question(i, q);
    })
    .join("");
};

const questionsContainer = document.querySelector("#questions");

const modal = document.querySelector("#modal-fs");
const modalMessage = modal.querySelector("#modal-message");
const modalScore = modal.querySelector("#modal-score");
const correctImg = modal.querySelector("#correct-img");
const incorrectImg = modal.querySelector("#incorrect-img");

document.addEventListener("DOMContentLoaded", function (_) {
  const qs = generateQuestions();
  questionsContainer.insertAdjacentHTML("afterbegin", qs);

  incorrectImg.style.display = "none";
  correctImg.style.display = "none";
});

function checkAll() {
  var correct = 0;
  var count = 0;

  $("div.question").each(function () {
    count++;
    var elem = $(this);
    $(this).find(".alertCorrect").css("display", "none");
    $(this).find(".alertWrong").css("display", "none");
    $(this).removeClass("correct");
    $(this).removeClass("incorrect");
    var isCorrect = true;
    $(this).find("button.option").each(function () {
      if ($(this).hasClass("buena")) {
        if (!$(this).hasClass("selected")) {
          isCorrect = false;
          $(this)[0].classList.remove('btn-dark');
          $(this)[0].classList.add('btn-outline-dark');
          $(this)[0].classList.remove('selected');
        }
      } else {
        if ($(this).hasClass("selected")) {
          isCorrect = false;
          $(this)[0].classList.remove('btn-dark');
          $(this)[0].classList.add('btn-outline-dark');
          $(this)[0].classList.remove('selected');
        }
      }
    });
    if (isCorrect == true) {
      correct++;
      $(this).find(".alertCorrect").css("display", "block");
      $(this).addClass("correct");
    } else {
      $(this).find(".alertWrong").css("display", "block");
      $(this).addClass("incorrect");
    }
  });
  let score = parseInt((correct * 100) / count);
  modalScore.textContent = `${score} / 100`;

  if (score >= 80) {
    fin.setAttribute("style", "display: block");
    modalMessage.textContent = "¡Excelente!";
    incorrectImg.style.display = "none";
    correctImg.style.display = "block";
    generarClave("modulo3"); // Genera y muestra la clave automáticamente

  } else {
    modalMessage.textContent = "Vuelve a intentarlo...";
    incorrectImg.style.display = "block";
    correctImg.style.display = "none";

    if (score < 25) {
      alert(
        "Le recomendamos volver a leer esta sección para tener mayor puntuaje que 25."
      );
    }
  }
}
