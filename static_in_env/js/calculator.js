/* ======================================
       SOLAR CALCULATOR JS
       ====================================== */
    
    let currentCalcType = "monthly_bill";
    let leadCalcType = '';
    let leadInputValue = 0;
    let leadState = '';
    let leadCategory = '';
    let leadUnitCost = 0;
    
    const stateTariffs = {
        uttar_pradesh: 8,
        gujarat: 7,
        delhi: 9,
        maharashtra: 10
    };
    
    /* ======================================
       CALCULATION OPTION SELECT
       ====================================== */
    function selectOption(type) {
        currentCalcType = type;
    
        document.querySelectorAll('.option-box').forEach(box => {
            if (box) {
                box.classList.remove('active');
            }
        });
    
        const inputField = document.getElementById('calcInputValue');
    
        if (type === 'monthly_bill') {
            const optBill = document.getElementById('opt_bill');
            if (optBill) {
                optBill.classList.add('active');
            }
            const dynamicLabel = document.getElementById('dynamicLabel');
            if (dynamicLabel) {
                dynamicLabel.innerText = "Monthly Electricity Bill";
            }
            if (inputField) {
                inputField.value = 3000;
                inputField.placeholder = "e.g. 5000";
            }
        } else if (type === 'monthly_units') {
            const optUnits = document.getElementById('opt_units');
            if (optUnits) {
                optUnits.classList.add('active');
            }
            const dynamicLabel = document.getElementById('dynamicLabel');
            if (dynamicLabel) {
                dynamicLabel.innerText = "Monthly Electricity Units";
            }
            if (inputField) {
                inputField.value = 350;
                inputField.placeholder = "e.g. 350";
            }
        } else if (type === 'roof_area') {
            const optArea = document.getElementById('opt_area');
            if (optArea) {
                optArea.classList.add('active');
            }
            const dynamicLabel = document.getElementById('dynamicLabel');
            if (dynamicLabel) {
                dynamicLabel.innerText = "Enter Total Unobstructed Rooftop Area (Sq. Ft.)";
            }
            if (inputField) {
                inputField.value = 500;
                inputField.min = 50;
                inputField.placeholder = "Enter Rooftop Area";
            }
        }
    
        const roofFields = document.getElementById('roofAreaFields');
        const dynamicContainer = document.getElementById('dynamicInputContainer');
    
        if (type === 'roof_area') {
            if (dynamicContainer) {
                dynamicContainer.style.display = 'none';
            }
            if (roofFields) {
                roofFields.style.display = 'block';
            }
        } else {
            if (dynamicContainer) {
                dynamicContainer.style.display = 'block';
            }
            if (roofFields) {
                roofFields.style.display = 'none';
            }
        }
    }
    
    /* ======================================
       FINAL CALCULATION / OPEN LEAD FORM
       ====================================== */
    function calculateSolar(e) {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
    
        let inputValue = 0;
        const calcInput = document.getElementById('calcInputValue');
        if (calcInput) {
            inputValue = parseFloat(calcInput.value) || 0;
        }
    
        let unitCost = 8;
        const unitCostInput = document.getElementById('unitCostInput');
        if (unitCostInput) {
            unitCost = parseFloat(unitCostInput.value) || 8;
        }
    
        leadCalcType = currentCalcType;
        
        const stateSel = document.getElementById('stateSelect');
        if (stateSel) {
            leadState = stateSel.value || '';
        } else {
            leadState = '';
        }
    
        const catSel = document.getElementById('categorySelect');
        if (catSel) {
            leadCategory = catSel.value || '';
        } else {
            leadCategory = '';
        }
    
        leadUnitCost = unitCost;
    
        if (currentCalcType === 'roof_area') {
            const roofInput = document.getElementById('roofAreaInput');
            if (roofInput) {
                leadInputValue = parseFloat(roofInput.value) || inputValue;
            } else {
                leadInputValue = inputValue;
            }
        } else {
            leadInputValue = inputValue;
        }
    
        // Reset Lead Form State
        const form = document.getElementById('leadCaptureForm');
        if (form) {
            form.classList.remove('was-validated');
            form.reset();
        }
    
        const mobileInput = document.getElementById('lead_mobile');
        if (mobileInput) {
            mobileInput.classList.remove('is-invalid');
        }
    
        const errorDiv = document.getElementById('leadFormError');
        if (errorDiv) {
            errorDiv.classList.add('d-none');
            errorDiv.innerText = '';
        }
    
        const leadSection = document.getElementById('leadFormSection');
        if (leadSection) {
            leadSection.classList.remove('d-none');
        }
    
        // Open Modal
        const modalEl = document.getElementById('resultModal');
        if (modalEl && typeof bootstrap !== 'undefined') {
            let modal = bootstrap.Modal.getInstance(modalEl);
            if (!modal) {
                modal = new bootstrap.Modal(modalEl);
            }
            if (modal) {
                modal.show();
            }
        } else {
            console.error("Modal with id='resultModal' not found or bootstrap is undefined");
        }
    }
    
    /* ======================================
       SUBMIT LEAD FORM
       ====================================== */
    function submitLeadForm(e) {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
    
        const form = document.getElementById('leadCaptureForm');
        if (!form) return;
    
        const errorDiv = document.getElementById('leadFormError');
        if (errorDiv) {
            errorDiv.classList.add('d-none');
            errorDiv.innerText = '';
        }
    
        let fullName = '';
        const fullNameEl = document.getElementById('lead_full_name');
        if (fullNameEl) {
            fullName = fullNameEl.value.trim();
        }
    
        let mobile = '';
        const mobileEl = document.getElementById('lead_mobile');
        if (mobileEl) {
            mobile = mobileEl.value.trim();
        }
    
        let email = '';
        const emailEl = document.getElementById('lead_email');
        if (emailEl) {
            email = emailEl.value.trim();
        }
    
        let city = '';
        const cityEl = document.getElementById('lead_city');
        if (cityEl) {
            city = cityEl.value.trim();
        }
    
        let isValid = true;
    
        // Reset validation states
        form.classList.remove('was-validated');
        if (mobileEl) {
            mobileEl.classList.remove('is-invalid');
        }
    
        if (!fullName) {
            isValid = false;
        }
    
        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailPattern.test(email)) {
            isValid = false;
        }
    
        // Validate mobile (digits only)
        const mobileFeedback = document.getElementById('lead_mobile_feedback');
        if (!mobile) {
            isValid = false;
            if (mobileFeedback) {
                mobileFeedback.innerText = "Mobile number is required.";
            }
        } else if (!/^\d+$/.test(mobile)) {
            isValid = false;
            if (mobileFeedback) {
                mobileFeedback.innerText = "Mobile number should accept only numeric values.";
            }
            if (mobileEl) {
                mobileEl.classList.add('is-invalid');
            }
        }
    
        if (!city) {
            isValid = false;
        }
    
        if (!isValid || (typeof form.checkValidity === 'function' && !form.checkValidity())) {
            form.classList.add('was-validated');
            return;
        }
    
        // Show loading state
        const submitBtn = document.getElementById('btnSubmitLead');
        const spinner = document.getElementById('btnSubmitSpinner');
        const btnText = document.getElementById('btnSubmitText');
    
        if (submitBtn) {
            submitBtn.disabled = true;
        }
        if (spinner) {
            spinner.classList.remove('d-none');
        }
        if (btnText) {
            btnText.innerText = 'Submitting...';
        }
    
        let csrfToken = '';
        const csrfInput = document.querySelector('[name=csrfmiddlewaretoken]');
        if (csrfInput) {
            csrfToken = csrfInput.value;
        }
    
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
                const modalEl = document.getElementById('resultModal');
                if (modalEl && typeof bootstrap !== 'undefined') {
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    if (modal) {
                        modal.hide();
                    }
                }
                
                // Show page success message
                
                const pageSuccess = document.getElementById('pageSuccessAlert');

if (pageSuccess) {
    pageSuccess.classList.remove('d-none');

    if (typeof pageSuccess.scrollIntoView === 'function') {
        pageSuccess.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    setTimeout(function () {
        window.location.href = '/';
    }, 3000);
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
            if (errorDiv) {
                errorDiv.innerText = error.message || 'Something went wrong. Please try again.';
                errorDiv.classList.remove('d-none');
            }
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
            }
            if (spinner) {
                spinner.classList.add('d-none');
            }
            if (btnText) {
                btnText.innerText = 'Submit Request';
            }
        });
    }
    
    /* ======================================
       PAGE LOAD EVENT LISTENERS
       ====================================== */
    document.addEventListener('DOMContentLoaded', function () {
        // Bind Unit Cost Slider and Input Listeners
        const slider = document.getElementById('unitCostSlider');
        const input = document.getElementById('unitCostInput');
    
        if (slider) {
            slider.addEventListener('input', function () {
                const inputEl = document.getElementById('unitCostInput');
                if (inputEl) {
                    inputEl.value = this.value;
                }
                const textVal = document.getElementById('unitCostVal');
                if (textVal) {
                    textVal.innerText = parseFloat(this.value).toFixed(2);
                }
            });
        }
    
        if (input) {
            input.addEventListener('input', function () {
                const sliderEl = document.getElementById('unitCostSlider');
                if (sliderEl) {
                    sliderEl.value = this.value;
                }
                const textVal = document.getElementById('unitCostVal');
                if (textVal) {
                    textVal.innerText = parseFloat(this.value).toFixed(2);
                }
            });
        }
    
        // Bind State Select Listener
        const stateSelect = document.getElementById('stateSelect');
        if (stateSelect) {
            stateSelect.addEventListener('change', function () {
                const tariff = stateTariffs[this.value] || 8;
                
                const sliderEl = document.getElementById('unitCostSlider');
                if (sliderEl) {
                    sliderEl.value = tariff;
                }
    
                const inputEl = document.getElementById('unitCostInput');
                if (inputEl) {
                    inputEl.value = tariff;
                }

                const textVal = document.getElementById('unitCostVal');
                if (textVal) {
                    textVal.innerText = tariff.toFixed(2);
                }
            });
        }
    });