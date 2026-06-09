(function ($) {
    "use strict";
    
    $(document).ready(function () {
        // Smooth scrolling for navigation links
        $('.navbar-nav a.nav-link').on('click', function (event) {
            if (this.hash !== "") {
                event.preventDefault();
                var hash = this.hash;
                
                // Scroll to the respective section adjusting for the fixed navbar
                $('html, body').animate({
                    scrollTop: $(hash).offset().top - 75
                }, 800, 'easeInOutExpo');
            }
        });
    });

})(jQuery);

// Solar Savings Calculator Logic
function calculateSavings() {
    const bill = document.getElementById('bill-amount').value;
    const type = document.getElementById('customer-type').value;
    
    if (!bill || bill <= 0) {
        alert("Please enter a valid monthly bill amount.");
        return;
    }

    // Rough calculation logic for demonstration
    // Avg unit price in India ~7-8 INR
    const monthlyUnits = bill / 7.5;
    const systemSize = (monthlyUnits / 120).toFixed(1); // 1KW produces ~120 units/month
    const annualSavings = (bill * 12 * 0.85).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    document.getElementById('res-size').innerText = systemSize;
    document.getElementById('res-savings').innerText = annualSavings;
    document.getElementById('calc-results').classList.remove('d-none');
}