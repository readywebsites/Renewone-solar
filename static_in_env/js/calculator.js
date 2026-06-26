/* ======================================
   SOLAR CALCULATOR JS
====================================== */

let currentCalcType = "monthly_bill";

/* ======================================
   CALCULATION OPTION SELECT
====================================== */

function selectOption(type) {

    currentCalcType = type;

    document.querySelectorAll('.option-box')
        .forEach(box => box.classList.remove('active'));

    const inputField = document.getElementById('calcInputValue');

   if (type === 'monthly_bill') {

    document.getElementById('opt_bill')
        .classList.add('active');

    document.getElementById('dynamicLabel')
        .innerText = "Monthly Electricity Bill";

    if (inputField) {
        inputField.value = 3000;
        inputField.placeholder = "e.g. 5000";
    }
}
   else if (type === 'monthly_units') {

    document.getElementById('opt_units')
        .classList.add('active');

    document.getElementById('dynamicLabel')
        .innerText = "Monthly Electricity Units";

    if (inputField) {
        inputField.value = 350;
        inputField.placeholder = "e.g. 350";
    }
}

    else if (type === 'roof_area') {

        document.getElementById('opt_area')
            .classList.add('active');

        document.getElementById('dynamicLabel')
            .innerText =
            "Enter Total Unobstructed Rooftop Area (Sq. Ft.)";

        inputField.value = 500;
        inputField.min = 50;
        inputField.placeholder = "Enter Rooftop Area";
    }

    const roofFields =
    document.getElementById('roofAreaFields');

const dynamicContainer =
    document.getElementById('dynamicInputContainer');

if(type === 'roof_area'){

    if(dynamicContainer){
        dynamicContainer.style.display = 'none';
    }

    if(roofFields){
        roofFields.style.display = 'block';
    }

}
else{

    if(dynamicContainer){
        dynamicContainer.style.display = 'block';
    }

    if(roofFields){
        roofFields.style.display = 'none';
    }

}
}
/* ======================================
   APPLIANCE DATA
====================================== */

const appliances = {

    "Residential": [

        ["Ceiling Fan", 0.075],
        ["LED Bulb", 0.009],
        ["Television (LED)", 0.08],
        ["Refrigerator", 0.15],
        ["Washing Machine", 0.50],
        ["Microwave Oven", 1.20],
        ["Water Pump", 0.75],
        ["Iron", 1.00],
        ["Air Conditioner (1 Ton)", 1.20],
        ["Geyser", 2.00]

    ],

    "Non-Residential": [

        ["Ceiling Fan", 0.075],
        ["Tube Light (LED)", 0.022],
        ["Desktop Computer", 0.10],
        ["Printer", 0.60],
        ["Air Conditioner", 1.20],
        ["Freezer", 0.40],
        ["Water Cooler", 0.10],
        ["Coffee Machine", 0.80],
        ["Photocopier", 1.60],
        ["Projector", 0.22]

    ]
};


/* ======================================
   LOAD APPLIANCE TABLE
====================================== */

function loadApplianceTable() {

    let type = "Residential";

    let data = appliances[type];

    let html = `
        <div class="table-responsive">
        <table class="table table-bordered">

            <thead>
                <tr>
                    <th>Appliance</th>
                    <th>Quantity</th>
                    <th>Power (kW)</th>
                    <th>Total (kW)</th>
                </tr>
            </thead>

            <tbody>
    `;

    data.forEach(item => {

        html += `

        <tr>

            <td>${item[0]}</td>

            <td>
                <input type="number"
                       class="form-control qty"
                       value="0"
                       min="0"
                       data-power="${item[1]}">
            </td>

            <td>${item[1]}</td>

            <td class="row-total">
                0
            </td>

        </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        </div>
    `;

    document.getElementById(
        'applianceTableContainer'
    ).innerHTML = html;


    document.querySelectorAll('.qty')
        .forEach(input => {

            input.addEventListener(
                'input',
                calculateAppliances
            );

        });

    calculateAppliances();
}


/* ======================================
   APPLIANCE CALCULATION
====================================== */

function calculateAppliances() {

    let totalLoad = 0;

    document.querySelectorAll('.qty')
        .forEach(input => {

            let qty =
                parseFloat(input.value) || 0;

            let power =
                parseFloat(input.dataset.power);

            let total = qty * power;

            input.closest('tr')
                .querySelector('.row-total')
                .innerText = total.toFixed(2);

            totalLoad += total;

        });

    document.getElementById(
        'totalLoad'
    ).innerText = totalLoad.toFixed(2);

    let solarSize = totalLoad * 1.25;

    document.getElementById(
        'recommendedSolar'
    ).innerText = solarSize.toFixed(2);
}


/* ======================================
   UNIT COST
====================================== */

const slider =
    document.getElementById('unitCostSlider');

const input =
    document.getElementById('unitCostInput');

if (slider && input) {

    slider.addEventListener('input', function () {

        input.value = this.value;

        // Update text value
        const textVal = document.getElementById('unitCostVal');
        if(textVal){
            textVal.innerText =
                parseFloat(this.value).toFixed(2);
        }

    });

    input.addEventListener('input', function () {

        slider.value = this.value;

        // Update text value
        const textVal = document.getElementById('unitCostVal');
        if(textVal){
            textVal.innerText =
                parseFloat(this.value).toFixed(2);
        }

    });

}

/* ======================================
   STATE WISE TARIFF AUTO UPDATE
====================================== */

const stateTariffs = {
    uttar_pradesh: 8,
    gujarat: 7,
    delhi: 9,
    maharashtra: 10
};

const stateSelect = document.getElementById('stateSelect');

if (stateSelect) {

    stateSelect.addEventListener('change', function () {

        let tariff = stateTariffs[this.value] || 8;

        // Update slider
        slider.value = tariff;

        // Update input box
        input.value = tariff;

        // Update text
        document.getElementById('unitCostVal')
            .innerText = tariff.toFixed(2);

    });

}

/* ======================================
   FINAL CALCULATION
====================================== */

let leadCalcType = '';
let leadInputValue = 0;
let leadState = '';
let leadCategory = '';
let leadUnitCost = 0;

function calculateSolar(e) {

    e.preventDefault();

    const inputValue = parseFloat(
        document.getElementById('calcInputValue').value
    ) || 0;

    const unitCost = parseFloat(
        document.getElementById('unitCostInput').value
    ) || 8;

    leadCalcType = currentCalcType;
    leadState = document.getElementById('stateSelect')?.value || '';
    leadCategory = document.getElementById('categorySelect')?.value || '';
    leadUnitCost = unitCost;

    if (currentCalcType === 'roof_area') {
        leadInputValue = parseFloat(document.getElementById('roofAreaInput')?.value) || inputValue;
    } else {
        leadInputValue = inputValue;
    }

   // Reset Lead Form State

const leadSection = document.getElementById('leadFormSection');

if (leadSection) {
    leadSection.classList.remove('d-none');
}

const errorDiv = document.getElementById('leadFormError');

if (errorDiv) {
    errorDiv.classList.add('d-none');
    errorDiv.innerText = '';
}

const form = document.getElementById('leadCaptureForm');

if (form) {
    form.classList.remove('was-validated');
    form.reset();

    const mobileInput = document.getElementById('lead_mobile');

    if (mobileInput) {
        mobileInput.classList.remove('is-invalid');
    }
}

    // Open Modal
    let modalEl = document.getElementById('resultModal');

if (modalEl) {

    let modal = bootstrap.Modal.getInstance(modalEl);

    if (!modal) {
        modal = new bootstrap.Modal(modalEl);
    }

    modal.show();

} else {

    console.error("Modal with id='resultModal' not found");

}

/* ======================================
   SUBMIT LEAD FORM
   ====================================== */

function submitLeadForm(e) {
    e.preventDefault();

    const form = document.getElementById('leadCaptureForm');
    const errorDiv = document.getElementById('leadFormError');
    errorDiv.classList.add('d-none');
    errorDiv.innerText = '';

    const fullName = document.getElementById('lead_full_name').value.trim();
    const mobile = document.getElementById('lead_mobile').value.trim();
    const email = document.getElementById('lead_email').value.trim();
    const city = document.getElementById('lead_city').value.trim();

    let isValid = true;

    // Reset validation states
    form.classList.remove('was-validated');
    document.getElementById('lead_mobile').classList.remove('is-invalid');

    if (!fullName) isValid = false;

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) isValid = false;

    // Validate mobile (digits only)
    const mobileFeedback = document.getElementById('lead_mobile_feedback');
    if (!mobile) {
        isValid = false;
        mobileFeedback.innerText = "Mobile number is required.";
    } else if (!/^\d+$/.test(mobile)) {
        isValid = false;
        mobileFeedback.innerText = "Mobile number should accept only numeric values.";
        document.getElementById('lead_mobile').classList.add('is-invalid');
    }

    if (!city) isValid = false;

    if (!isValid || !form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    // Show loading state
    const submitBtn = document.getElementById('btnSubmitLead');
    const spinner = document.getElementById('btnSubmitSpinner');
    const btnText = document.getElementById('btnSubmitText');

    submitBtn.disabled = true;
    spinner.classList.remove('d-none');
    btnText.innerText = 'Submitting...';

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;

    fetch('/contact/save-solar-lead/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({
            full_name: fullName,
            mobile: mobile,
            email: email,
            city: city,
            calculation_type: leadCalcType,
            input_value: leadInputValue,
            state: leadState,
            category: leadCategory,
            unit_cost: leadUnitCost
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errData => {
                throw new Error(errData.message || 'Server error occurred.');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            // Close popup
            let modalEl = document.getElementById('resultModal');
            let modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) {
                modal.hide();
            }
            
            // Show page success message
            const pageSuccess = document.getElementById('pageSuccessAlert');
            if (pageSuccess) {
                pageSuccess.classList.remove('d-none');
                pageSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Hide calculator card
            const calcRow = document.getElementById('calculatorCardRow');
            if (calcRow) {
                calcRow.classList.add('d-none');
            }
        } else {
            throw new Error(data.message || 'Failed to save lead.');
        }
    })
    .catch(error => {
        console.error('Submission Error:', error);
        errorDiv.innerText = error.message || 'Something went wrong. Please try again.';
        errorDiv.classList.remove('d-none');
    })
    .finally(() => {
        submitBtn.disabled = false;
        spinner.classList.add('d-none');
        btnText.innerText = 'Submit Request';
    });
}


/* ======================================
   PAGE LOAD
====================================== */

document.addEventListener('DOMContentLoaded', function () {

    // Page Loaded Successfully

});