const form = document.querySelector("#adoption-form");
const successPanel = document.querySelector("#form-success");
const resetButton = document.querySelector("#reset-form");
const message = document.querySelector("#message");
const characterCount = document.querySelector("#character-count");

const fields = {
  fullName: {
    input: document.querySelector("#full-name"),
    error: document.querySelector("#full-name-error"),
    validate(value) {
      if (!value.trim()) return "Please enter your full name.";
      if (value.trim().length < 2) return "Please enter at least 2 characters.";
      return "";
    },
  },
  email: {
    input: document.querySelector("#email"),
    error: document.querySelector("#email-error"),
    validate(value) {
      if (!value.trim()) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Enter an email like you@example.com.";
      }
      return "";
    },
  },
  phone: {
    input: document.querySelector("#phone"),
    error: document.querySelector("#phone-error"),
    validate(value) {
      if (!value.trim()) return "Please enter your phone number.";
      const digits = value.replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15) {
        return "Enter a valid phone number with 7–15 digits.";
      }
      return "";
    },
  },
  message: {
    input: message,
    error: document.querySelector("#message-error"),
    validate(value) {
      if (!value.trim()) return "Please tell us why you’d like to adopt.";
      if (value.trim().length < 20) return "Please share at least 20 characters.";
      if (value.length > 500) return "Please keep your message under 500 characters.";
      return "";
    },
  },
};

function showFieldState(field, errorMessage) {
  const wrapper = field.input.closest(".field");
  wrapper.classList.toggle("has-error", Boolean(errorMessage));
  field.input.setAttribute("aria-invalid", String(Boolean(errorMessage)));

  if (errorMessage) {
    field.error.textContent = errorMessage;
    const descriptionIds = field.input === message
      ? `message-hint ${field.error.id}`
      : field.error.id;
    field.input.setAttribute("aria-describedby", descriptionIds);
  } else {
    field.error.textContent = "";
    if (field.input === message) {
      field.input.setAttribute("aria-describedby", "message-hint");
    } else {
      field.input.removeAttribute("aria-describedby");
    }
  }
}

function validateField(field) {
  const errorMessage = field.validate(field.input.value);
  showFieldState(field, errorMessage);
  return !errorMessage;
}

Object.values(fields).forEach((field) => {
  field.input.addEventListener("blur", () => validateField(field));
  field.input.addEventListener("input", () => {
    if (field.input.closest(".field").classList.contains("has-error")) {
      validateField(field);
    }
  });
});

message.addEventListener("input", () => {
  if (message.value.length > 500) message.value = message.value.slice(0, 500);
  characterCount.textContent = `${message.value.length} / 500`;
});

function validateHomeType() {
  const homeField = document.querySelector(".home-field");
  const selectedHome = form.querySelector('input[name="homeType"]:checked');
  const error = document.querySelector("#home-type-error");
  const errorMessage = selectedHome ? "" : "Please choose house or apartment.";

  homeField.classList.toggle("has-error", Boolean(errorMessage));
  error.textContent = errorMessage;
  form.querySelectorAll('input[name="homeType"]').forEach((input) => {
    input.setAttribute("aria-invalid", String(Boolean(errorMessage)));
    input.setAttribute("aria-describedby", "home-type-error");
  });

  return !errorMessage;
}

form.querySelectorAll('input[name="homeType"]').forEach((input) => {
  input.addEventListener("change", validateHomeType);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const fieldResults = Object.values(fields).map(validateField);
  const homeIsValid = validateHomeType();
  const isValid = fieldResults.every(Boolean) && homeIsValid;

  if (!isValid) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    firstInvalid?.focus();
    return;
  }

  form.hidden = true;
  successPanel.hidden = false;
  successPanel.focus();
});

resetButton.addEventListener("click", () => {
  form.reset();
  characterCount.textContent = "0 / 500";
  Object.values(fields).forEach((field) => showFieldState(field, ""));
  document.querySelector(".home-field").classList.remove("has-error");
  document.querySelector("#home-type-error").textContent = "";
  form.hidden = false;
  successPanel.hidden = true;
  fields.fullName.input.focus();
});
