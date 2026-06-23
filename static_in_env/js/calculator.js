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

function calculateSolar(e) {

    e.preventDefault();

    const inputValue = parseFloat(
        document.getElementById('calcInputValue').value
    ) || 0;

    const unitCost = parseFloat(
        document.getElementById('unitCostInput').value
    ) || 8;

    let load = 0;
    let monthlyUnits = 0;

    // Monthly Bill
    if(currentCalcType === 'monthly_bill'){

        monthlyUnits = inputValue / unitCost;
        load = (monthlyUnits * 12) / 1400;
    }

    // Monthly Units
    else if(currentCalcType === 'monthly_units'){

        monthlyUnits = inputValue;
        load = (monthlyUnits * 12) / 1400;
    }

    // Roof Area
    else if(currentCalcType === 'roof_area'){

        load = inputValue / 100;
        monthlyUnits = (load * 1400) / 12;
    }

    // Appliance Calculator
    else{

        load = parseFloat(
            document.getElementById(
                'recommendedSolar'
            ).innerText
        ) || 0;

        monthlyUnits = load * 120;
    }

    if(load < 1){
        load = 1;
    }

    load = Math.round(load * 10) / 10;

    let area = Math.ceil(load * 100);

    let monthlySavings =
        monthlyUnits * unitCost;

    let totalCost = load * 65000;

    let subsidy = 0;

    if(load <= 1)
        subsidy = 30000;
    else if(load <= 2)
        subsidy = 60000;
    else
        subsidy = 78000;

    let netCost = totalCost - subsidy;

    document.getElementById('res_system')
        .innerText = load.toFixed(1) + " kW";

    document.getElementById('res_area')
        .innerText = area + " Sq.Ft.";

    document.getElementById('res_savings')
        .innerText =
        "₹" +
        Math.round(monthlySavings)
        .toLocaleString('en-IN');

    document.getElementById('res_total_cost')
        .innerText =
        "₹" +
        Math.round(totalCost)
        .toLocaleString('en-IN');

    document.getElementById('res_subsidy')
        .innerText =
        "- ₹" +
        Math.round(subsidy)
        .toLocaleString('en-IN');

    document.getElementById('res_net_cost')
        .innerText =
        "₹" +
        Math.round(netCost)
        .toLocaleString('en-IN');

    let modal = new bootstrap.Modal(
        document.getElementById('resultModal')
    );

    modal.show();
}

/* ======================================
   SAVE LEAD
====================================== */

function saveLead() {

    let data = {

        name:
            document.getElementById('lead_name')?.value,

        phone:
            document.getElementById('lead_phone')?.value,

        email:
            document.getElementById('lead_email')?.value,

        system:
            document.getElementById('res_system')
                .innerText
    };

    console.log(data);

    alert(
        "Thank You! Our Team Will Contact You."
    );
}


/* ======================================
   PAGE LOAD
====================================== */

document.addEventListener(
    'DOMContentLoaded',
    function () {

        loadApplianceTable();

    }
);