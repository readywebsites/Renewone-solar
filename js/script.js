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