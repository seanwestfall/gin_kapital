////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// jQuery
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var $ = jQuery.noConflict();
var transitionDelay = .07;
var itemsInRow = 0;
var itemsInRowArray = [];
var activeCol;
var parentElement;
var documentHeight;
var lastScrollTop = 0;
var topOffset;
var lastTopOffset;
var headerMargin;
var promotionAreaPadding;

$(document).ready(function($) {
    "use strict";

    var $grid = $('.grid');
    var $masonry = $('.masonry');
    var $content = $('.content');
    var $contentLoader = $('.content-loader');

    $('.search-overlay').height( $(window).height() );

    rating();

    if ($(window).width() < 768) {
        $('.search.collapse').removeClass('in');

        $('.toggle-nav').on('click', function(e) {
            $('nav.main ul').toggleClass('show-nav');
            e.stopPropagation();
        });

        $(document).on('click',function() {
            $('nav.main ul').removeClass('show-nav');
        });
    }



//  Bootstrap Select ---------------------------------------------------------------------------------------------------

    bootstrapSelect();

//  Get Header and Promotion Area margin -------------------------------------------------------------------------------

    if( $('#header').length ){
        var headerElement = window.getComputedStyle( document.querySelector('#header'), null);
        headerMargin = parseInt((headerElement.marginBottom).replace(/[A-Za-z$-]/g, ""));
    }
    else {
        headerMargin = 0;
    }

    if( $('.promotion-area').length ){
        var promotionAreaElement = window.getComputedStyle( document.querySelector('.promotion-area'), null);
        promotionAreaPadding = parseInt((promotionAreaElement.paddingBottom).replace(/[A-Za-z$-]/g, ""));
    }
    else {
        promotionAreaPadding = 0;
    }

//  Masonry grid listing -----------------------------------------------------------------------------------------------

    if( $masonry.length ){
        var masonry;
        var container = $masonry;
        container.imagesLoaded( function() {
            container = document.querySelector('.masonry');
            masonry = new Masonry( container, {
                gutter: 30,
                itemSelector: '.item'
            });
            calculateItemsInRow();
            if( $('.masonry.full-width').length ){
                var windowWidth = $(window).width() / 2;
                var masonryWidth =  masonry.cols * masonry.columnWidth / 2;
                $('.masonry.full-width').css( 'margin-left', windowWidth - masonryWidth + masonry.gutter/2 );
            }
        });

    }

//  Checkbox -----------------------------------------------------------------------------------------------------------

    $('.switch').each(function(){
        var _this = $(this);
        $(this).append('<div class="track"><small></small></div>');

        if( $(this).find('input').prop('checked') ){
            $(this).addClass('checked');
        }
        else {
            $(this).removeClass('checked');
        }

        $(this).on('click',function() {
            if( $(this).find('input').prop('checked') ){
                _this.removeClass('checked');
                _this.find('input').prop('checked', false);
            }
            else {
                _this.addClass('checked');
                _this.find('input').prop('checked', true);
                showAdminTools(masonry);
            }
        });
    });

    $('.background').each(function(){
        var imagePath = $(this).children().attr('src');
        $(this).css( 'background', 'url("'+ imagePath +'") 50% 50%' );
        $(this).children().remove();
    });

//  Click Events -------------------------------------------------------------------------------------------------------

    $('.counter .plus').on('click',function() {

        if( !$(this).parent().parent().find('input').val() ){
            $(this).parent().parent().find('input').val(1);
        }
        else {
            var currentVal = parseInt( $(this).parent().parent().find('input').val() );
            $(this).parent().parent().find('input').val( currentVal + 1 );
        }
    });

    $('.counter .minus').on('click',function() {
        if( $(this).parent().parent().find('input').val() == 1 || $(this).parent().parent().find('input').val() == '' ){
            $(this).parent().parent().find('input').val('');
        }
        else {
            var currentVal = parseInt( $(this).parent().parent().find('input').val() );
            $(this).parent().parent().find('input').val( currentVal - 1 );
        }
    });

    $('.close').on('click',function() {
        if( $(this).attr('data-close-parent') ){
            var element = $(this).attr('data-close-parent');
            $('a[href="' +element+ '"]').trigger('click');
            removeAnimation(element);
        }
        else {
            removeAnimation($content);
            $('.submit-button').removeClass('submit-page-open');
            $grid.removeClass('idle offset-' + activeCol );
            $content.removeClass('idle');
            $('#page-wrapper').css('height','');

            if( !$('.grid').hasClass('idle') ) {
                setTimeout(function(){
                    $contentLoader.removeClass( 'idle' );
                    $contentLoader.removeClass( activeCol );
                    $('.content #loader').remove();
                    activeCol = '';
                }, 800);
            }

            var b = 0;
            $.each( itemsInRowArray, function (i) {
                setTimeout(function(){
                    b++;
                    var referenceItemOffset = $('.item:nth-child(' + b + 'n)').css('left');
                    $('.item').each(function() {
                        if( $(this).css('left') == referenceItemOffset ){
                            $(this).removeClass('stretch');
                        }
                    });
                }, i * 100);
            });
        }
        removeOffsetLeft();
    });

    $('a, button, .btn-group, .btn, .item a').on('click',function() {
        clickEvents(this);
    });

    $('form').on('submit', function(e){
        e.preventDefault();
        var _this = $(this);
        if( $('.search-overlay').length ){
            $('.search-overlay').removeClass('idle');
            removeAnimation('.search-overlay');
            setTimeout(function(){
                $('.search-overlay').remove();
                //window.location.replace( _this.attr('action') );
                window.location.href = _this.attr('action') ;
            }, 1000);
        }

    });

//  Disable page reloading if href is #

    $('a[href="#"], a[data-external]').on('click',function(e) {
        e.preventDefault();
    });

//  Average color of image

    averageColor( $('.item .inner') );

    $('.item').live('inview', function(event, isInView, visiblePartX, visiblePartY) {
        if (isInView) {
            if (visiblePartY == 'top') {
                // top of element
                $(this).addClass('idle');
            } else if (visiblePartY == 'bottom') {
                // bottom of element
            } else {
                // whole element
                $(this).addClass('idle');
            }
        } else {
            // element has gone out of viewport
        }
    });

//  Smooth Navigation Scrolling ----------------------------------------------------------------------------------------

    $('.navigation .nav a[href^="#"], a[href^="#"].roll').on('click',function (e) {
        e.preventDefault();
        var target = this.hash,
            $target = $(target);
        if ($(window).width() > 768) {
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top - $('.navigation').height()
            }, 2000)
        } else {
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, 2000)
        }
    });

//  iCheck -------------------------------------------------------------------------------------------------------------

    if ($('.checkbox').length > 0) {
        $('input').iCheck();
    }

    if ($('.radio').length > 0) {
        $('input').iCheck();
    }

//  Dropzone -----------------------------------------------------------------------------------------------------------

    if( $('.dropzone').length > 0 ) {
        Dropzone.autoDiscover = false;
        $("#file-submit").dropzone({
            url: "upload",
            addRemoveLinks: true
        });

        $("#profile-picture").dropzone({
            url: "upload",
            addRemoveLinks: true
        });
    }

//  No UI Slider -------------------------------------------------------------------------------------------------------

    if( $('.ui-slider').length > 0 ){
        $('.ui-slider').each(function() {
            var step;
            if( $(this).attr('data-step') ) {
                step = parseInt( $(this).attr('data-step') );
            }
            else {
                step = 10;
            }
            var sliderElement = $(this).attr('id');
            var element = $( '#' + sliderElement);
            var valueMin = parseInt( $(this).attr('data-value-min') );
            var valueMax = parseInt( $(this).attr('data-value-max') );
            $(this).noUiSlider({
                start: [ valueMin, valueMax ],
                connect: true,
                range: {
                    'min': valueMin,
                    'max': valueMax
                },
                step: step
            });
            if( $(this).attr('data-value-type') == 'price' ) {
                if( $(this).attr('data-currency-placement') == 'before' ) {
                    $(this).Link('lower').to( $(this).children('.values').children('.value-min'), null, wNumb({ prefix: $(this).attr('data-currency'), decimals: 0, thousand: '.' }));
                    $(this).Link('upper').to( $(this).children('.values').children('.value-max'), null, wNumb({ prefix: $(this).attr('data-currency'), decimals: 0, thousand: '.' }));
                }
                else if( $(this).attr('data-currency-placement') == 'after' ){
                    $(this).Link('lower').to( $(this).children('.values').children('.value-min'), null, wNumb({ postfix: $(this).attr('data-currency'), decimals: 0, thousand: ' ' }));
                    $(this).Link('upper').to( $(this).children('.values').children('.value-max'), null, wNumb({ postfix: $(this).attr('data-currency'), decimals: 0, thousand: ' ' }));
                }
            }
            else {
                $(this).Link('lower').to( $(this).children('.values').children('.value-min'), null, wNumb({ decimals: 0 }));
                $(this).Link('upper').to( $(this).children('.values').children('.value-max'), null, wNumb({ decimals: 0 }));
            }
        });
    }

// Autocomplete address ------------------------------------------------------------------------------------------------

    var input = document.getElementById('location') ;
    var autocomplete = new google.maps.places.Autocomplete(input, {
        types: ["geocode"]
    });
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }
    });

// Bootstrap Animated Tabs ---------------------------------------------------------------------------------------------

    var activeTab;
    var transitionParent;

    $('body').find('a[data-toggle="collapse"]').on('click',function() {
        var where = $(this).attr('href');
        activeTab = $(this).attr('data-tab');
        $(activeTab).addClass('active');
        $(where + ' a[href="' + activeTab + '"]').tab('show');
        transitionParent = $(this).attr('data-transition-parent');
    });

    $('.has-tabs').each(function(){
        var _this = $(this);
        var thisHeight;
        var padding;

        $(this).on('shown.bs.collapse', function (e) {
            if ($(window).width() > 768) {
                thisHeight = $(this).height();
                $(this).find('.inner:first').css('height', $(this).height() );
                padding = thisHeight - $(activeTab).height();
            }
        });
        $(this).on('show.bs.collapse', function (e) {
            $(this).find('.animate').addClass('idle');
        });
        $(this).on('hide.bs.collapse', function () {
            $(this).find('.animate').removeClass('idle');
        });
        $(this).on('hidden.bs.collapse', function () {
            $(transitionParent).removeClass('idle');
            $(activeTab).removeClass('active');
            _this.find('.inner:first').css('height', '');
        });

        $(this).find('a[data-toggle="tab"]').on('click',function() {
            var element = $(this).attr('href');
            removeAnimation(element);
            _this.find('.inner:first').css('height', $(element).height() + padding );
        });

    });

    $('.fullscreen-map #search-collapse').on('hidden.bs.collapse shown.bs.collapse', function () {
        $('.map-wrapper #map').height( $(window).height() - $('header:first').height() - 1 - $('.page-content .search').height() );
    });

    if ($(window).width() > 768) {
        $(window).on('scroll', function(){
            if( $contentLoader.length ){
                topOffset = $contentLoader.offset().top;
                var st = $(this).scrollTop();
                if (st < lastScrollTop){
                    //up
                    if( (st + headerMargin  ) <= topOffset ){
                        $contentLoader.css('top', headerMargin  );
                        $contentLoader.css('position','fixed');
                        lastTopOffset = topOffset;
                    }
                    if ( st <= ( $('body header:first').height() + headerMargin + $('.promotion-area').height() + $('.page-content .search').height() )  ) {
                        $contentLoader.css('position','relative');
                        $contentLoader.css('top',0);
                    }
                }
                else {
                    // down
                    $contentLoader.css('position','');
                    $contentLoader.css('top',lastTopOffset - ( $('body header:first').height() + headerMargin + $('.promotion-area').height() + promotionAreaPadding + $('.page-content .search').height() ) );
                }
                lastScrollTop = st;
            }
        });
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// On Load
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(window).load(function(){
    documentHeight = $(document).height();
});
