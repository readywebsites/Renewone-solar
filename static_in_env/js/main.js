(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky / Fixed Navbar
    function handleStickyNav() {
        var $navbar = $('.navbar');
        var $wrapper = $('.navbar-wrapper');
        if (!$navbar.length) return;
        var triggerOffset = $wrapper.length ? $wrapper.offset().top : ($('.topbar-container, .bg-dark-green').first().outerHeight() || 40);
        var scrollTop = $(window).scrollTop();

        if (scrollTop >= triggerOffset && triggerOffset > 0) {
            if (!$navbar.hasClass('is-fixed')) {
                if ($wrapper.length) $wrapper.addClass('has-fixed');
                $navbar.addClass('is-fixed shadow-sm');
            }
        } else {
            if ($navbar.hasClass('is-fixed')) {
                $navbar.removeClass('is-fixed shadow-sm');
                if ($wrapper.length) $wrapper.removeClass('has-fixed');
            }
        }
    }
    $(window).on('scroll resize', handleStickyNav);
    $(document).ready(handleStickyNav);
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        loop: true,
        nav: false,
        dots: true,
        items: 1,
        dotsData: true,
    });

    // Brand carousel
    $(".brand-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        dots: false,
        nav: false,
        responsive: {
            0:{
                items: 2
            },
            576:{
                items: 3
            },
            768:{
                items: 4
            },
            992:{
                items: 6
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            }
        }
    });


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
})(jQuery);

