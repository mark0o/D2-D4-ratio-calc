// Application data from the provided JSON
const APP_DATA = {
  typical_ratios: {
    male_average: 0.965,
    female_average: 0.98,
    masculine_threshold: 0.95,
    feminine_threshold: 1.0,
  },
  hormone_ranges: {
    testosterone_male: {
      min: 300,
      max: 1000,
      typical_min: 450,
      typical_max: 600,
      unit: "ng/dL",
    },
    testosterone_female: {
      min: 15,
      max: 70,
      typical_min: 20,
      typical_max: 40,
      unit: "ng/dL",
    },
    estradiol_male: {
      min: 13,
      max: 42,
      typical_min: 20,
      typical_max: 35,
      unit: "pg/mL",
    },
    estradiol_female: {
      min: 60,
      max: 450,
      typical_min: 100,
      typical_max: 250,
      unit: "pg/mL",
    },
  },
  scientific_info: {
    key_facts: [
      `2D:4D ratio reflects
                    <span class="tooltip"
                      >prenatal<span class="tooltiptext"
                        >Hormone concentrations during pregnancy supporting
                        fetal and maternal health.<br>
                        <a class="tooltip-link" href="https://www.perplexity.ai/search/what-s-prenatal-hormone-exposu-8t1S978.Th.y4_PHfuGX_w">learn more</a></span
                      ></span
                    >
                    hormone exposure, not current levels`,
      "Ratio is established during fetal development and remains constant",
      "Lower ratios (shorter index finger) indicate higher prenatal testosterone",
      "Higher ratios (longer index finger) indicate lower prenatal testosterone",
      "No reliable correlation exists between 2D:4D and adult hormone levels",
    ],
    measurement_tips: [
      "Measure from palm-side finger tip to midpoint of bottom crease",
      "Use millimeters or inches for accuracy",
      "Take measurements multiple times for consistency",
      "Right hand ratios may be more sensitive to prenatal hormones",
    ],
  },
};

// DOM Elements
const indexFingerInput = document.getElementById("index-finger");
const ringFingerInput = document.getElementById("ring-finger");
const indexUnitSelect = "mm";
const ringUnitSelect = "mm";
const calculateBtn = document.getElementById("calculate-btn");
const resultsSection = document.getElementById("results-section");
const ratioValue = document.getElementById("ratio-value");
const ratioCategory = document.getElementById("ratio-category");
const ratioIndicator = document.getElementById("ratio-indicator");

// Unit conversion functions
function convertToMM(value, unit) {
  switch (unit) {
    case "mm":
      return value;
    case "cm":
      return value * 10;
    case "inches":
      return value * 25.4;
    default:
      return value;
  }
}

// Calculate 2D:4D ratio
function calculateRatio() {
  const indexLength = parseFloat(indexFingerInput.value);
  const ringLength = parseFloat(ringFingerInput.value);
  const indexUnit = indexUnitSelect;
  const ringUnit = ringUnitSelect;

  // Validate inputs
  if (!indexLength || !ringLength || indexLength <= 0 || ringLength <= 0) {
    hideResults();
    return;
  }

  // Convert both measurements to millimeters for calculation
  const indexMM = convertToMM(indexLength, indexUnit);
  const ringMM = convertToMM(ringLength, ringUnit);

  // Calculate ratio (index finger / ring finger)
  const ratio = indexMM / ringMM;

  // Display results
  displayResults(ratio);
}

function calculateRatioWScroll() {
  const indexLength = parseFloat(indexFingerInput.value);
  const ringLength = parseFloat(ringFingerInput.value);
  const indexUnit = indexUnitSelect.value;
  const ringUnit = ringUnitSelect.value;

  // Validate inputs
  if (!indexLength || !ringLength || indexLength <= 0 || ringLength <= 0) {
    hideResults();
    return;
  }

  // Convert both measurements to millimeters for calculation
  const indexMM = convertToMM(indexLength, indexUnit);
  const ringMM = convertToMM(ringLength, ringUnit);

  // Calculate ratio (index finger / ring finger)
  const ratio = indexMM / ringMM;

  // Display results
  displayResultsWScroll(ratio);
}

// Display calculation results
function displayResults(ratio) {
  // Show results section
  resultsSection.style.display = "block";

  // Display ratio value
  ratioValue.textContent = ratio.toFixed(3);

  // Determine category and styling
  const category = determineCategory(ratio);
  updateCategoryDisplay(category);
  updateSpectrumIndicator(ratio);
}

function displayResultsWScroll(ratio) {
  // Show results section
  resultsSection.style.display = "block";

  // Display ratio value
  ratioValue.textContent = ratio.toFixed(3);

  // Determine category and styling
  const category = determineCategory(ratio);
  updateCategoryDisplay(category);
  updateSpectrumIndicator(ratio);

  // Scroll to results
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Determine ratio category
function determineCategory(ratio) {
  if (ratio <= 0.95) {
    return {
      name: "masculine",
      label: "Masculine Range",
      description:
        "Lower than average - typically associated with higher prenatal testosterone exposure",
    };
  } else if (ratio <= 1.0) {
    return {
      name: "average",
      label: "Average Range",
      description: "Within typical range for most individuals",
    };
  } else {
    return {
      name: "feminine",
      label: "Feminine Range",
      description:
        "Higher than average - typically associated with lower prenatal testosterone exposure",
    };
  }
}

// Update category display
function updateCategoryDisplay(category) {
  ratioCategory.textContent = category.label;
  ratioCategory.className = `ratio-category ${category.name}`;
}

// Update spectrum indicator position
function updateSpectrumIndicator(ratio) {
  // Calculate position as percentage across the spectrum
  // Range from 0.85 to 1.15 for display purposes
  const minDisplay = 0.85;
  const maxDisplay = 1.15;
  const clampedRatio = Math.max(minDisplay, Math.min(maxDisplay, ratio));
  const percentage =
    ((clampedRatio - minDisplay) / (maxDisplay - minDisplay)) * 100;

  ratioIndicator.style.left = `${percentage}%`;
}

// Hide results section
function hideResults() {
  resultsSection.style.display = "none";
}

// Validate number input
function validateNumberInput(input) {
  const value = parseFloat(input.value);
  if (isNaN(value) || value <= 0) {
    input.classList.add("error");
    return false;
  } else {
    input.classList.remove("error");
    return true;
  }
}

// Real-time calculation as user types
function setupRealTimeCalculation() {
  const inputs = [
    indexFingerInput,
    ringFingerInput,
    indexUnitSelect,
    ringUnitSelect,
  ];

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      // Small delay to avoid excessive calculations while typing
      clearTimeout(input.calculationTimeout);
      input.calculationTimeout = setTimeout(() => {
        calculateRatio();
      }, 300);
    });

    input.addEventListener("change", calculateRatio);
  });
}

// Populate scientific facts dynamically
function populateScientificFacts() {
  const factsList = document.getElementById("scientific-facts-list");
  if (factsList) {
    factsList.innerHTML = "";
    APP_DATA.scientific_info.key_facts.forEach((fact) => {
      const li = document.createElement("li");
      li.innerHTML = fact;
      factsList.appendChild(li);
    });
  }
}

// Populate measurement tips dynamically
function populateMeasurementTips() {
  const tipsList = document.getElementById("measurement-tips-list");
  if (tipsList) {
    tipsList.innerHTML = "";
    APP_DATA.scientific_info.measurement_tips.forEach((tip) => {
      const li = document.createElement("li");
      li.textContent = tip;
      tipsList.appendChild(li);
    });
  }
}

// Add input validation styling
function addInputValidation() {
  const numberInputs = [indexFingerInput, ringFingerInput];

  numberInputs.forEach((input) => {
    input.addEventListener("blur", () => {
      validateNumberInput(input);
    });

    input.addEventListener("input", () => {
      // Remove error styling when user starts typing
      input.classList.remove("error");
    });
  });
}

// Add keyboard shortcuts
function addKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Enter key to calculate when inputs are focused
    if (
      e.key === "Enter" &&
      (document.activeElement === indexFingerInput ||
        document.activeElement === ringFingerInput)
    ) {
      calculateRatio();
    }

    // Escape key to clear results
    if (e.key === "Escape") {
      hideResults();
    }
  });
}

// Add helpful input formatting
function addInputFormatting() {
  const numberInputs = [indexFingerInput, ringFingerInput];

  numberInputs.forEach((input) => {
    // Prevent negative values
    input.addEventListener("input", (e) => {
      if (e.target.value < 0) {
        e.target.value = 0;
      }
    });

    // Format decimal places on blur
    input.addEventListener("blur", (e) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value) && value > 0) {
        e.target.value = value.toFixed(8);
      }
    });
  });
}

// Add unit synchronization option
function addUnitSynchronization() {
  // Keep units in sync by default for easier comparison
  indexUnitSelect.addEventListener("change", () => {
    ringUnitSelect.value = indexUnitSelect.value;
    calculateRatio();
  });

  ringUnitSelect.addEventListener("change", () => {
    indexUnitSelect.value = ringUnitSelect.value;
    calculateRatio();
  });
}

// Add smooth animations for result appearance
function addResultAnimations() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        const target = mutation.target;
        if (
          target.id === "results-section" &&
          target.style.display !== "none"
        ) {
          // Add fade-in animation
          target.style.opacity = "0";
          target.style.transform = "translateY(20px)";

          // Trigger animation
          setTimeout(() => {
            target.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            target.style.opacity = "1";
            target.style.transform = "translateY(0)";
          }, 10);
        }
      }
    });
  });
}

// Add error handling for edge cases
function addErrorHandling() {
  window.addEventListener("error", (e) => {
    console.error("Calculator error:", e.error);
    // Could add user-friendly error message here
  });

  // Handle very extreme ratios
  const originalDisplayResults = displayResults;
  displayResults = function (ratio) {
    if (ratio > 2 || ratio < 0.5) {
      // Show warning for extreme ratios
      const warning = document.createElement("div");
      warning.className = "measurement-warning";
      warning.innerHTML = `
        <p><strong>⚠️ Unusual ratio detected (${ratio.toFixed(3)})</strong></p>
        <p>Please double-check your measurements. Typical 2D:4D ratios range from 0.8 to 1.2.</p>
      `;

      // Remove existing warning
      const existingWarning = document.querySelector(".measurement-warning");
      if (existingWarning) {
        existingWarning.remove();
      }

      // Add warning before results
      resultsSection.insertBefore(warning, resultsSection.firstChild);
    } else {
      // Remove warning if ratio is normal
      const existingWarning = document.querySelector(".measurement-warning");
      if (existingWarning) {
        existingWarning.remove();
      }
    }

    originalDisplayResults(ratio);
  };
}

// Initialize the application
function initializeApp() {
  // Set up event listeners
  calculateBtn.addEventListener("click", calculateRatioWScroll);

  // Set up real-time calculation
  setupRealTimeCalculation();

  // Populate dynamic content
  populateScientificFacts();
  populateMeasurementTips();

  // Add enhancements
  addInputValidation();
  addKeyboardShortcuts();
  addInputFormatting();
  addUnitSynchronization();
  addResultAnimations();
  addErrorHandling();

  // Set default focus
  indexFingerInput.focus();

  console.log("2D:4D Calculator initialized successfully");
}

// Wait for DOM to be fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
