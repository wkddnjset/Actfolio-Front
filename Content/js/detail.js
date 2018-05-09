/**
 * 1. Menu Mobile
 * 2. Portfolio
 * 3. Map
 * 4. Project Detail
 * 5. Preload
 * Like Project
 * Sticky project
 * Tooltip
 * Load More
 */

'use strict';

(function ($) {

	$.fn.decozIsotope = function (opts) {
		var $self = $(this),
			defaults = {
				filter         : '*',
				itemSelector   : '.project-item',
				percentPosition: true,
				masonry        : {
					columnWidth: '.project-item-sizer'
				}
			},
			options = $.extend(defaults, $self.data(), opts),
			$images = $('img', $self),
			count = 0,
			total = $images.length;

		if (total) {
			$.each($images, function () {
				var image = new Image();

				image.src = $(this).attr('src');

				image.onload = function () {

					count++;

					if (count === total) {
						$self.isotope(options);
						$self.data('isIsotope', true);
					}
				}
			});
		}
		else {
			$self.isotope(options);
			$self.data('isIsotope', true);
		}

		$self.prev('.controls').on( 'click', 'a', function(e) {
			e.preventDefault();
			var filterValue = $( this ).attr('data-filter');
			$self.isotope({ filter: filterValue });
		});

	};

	$.fn.decozMagnificPopup = function (opts) {

		var $self = $(this),
			options = $.extend({
				delegate   : '.media',
				type       : 'image',
				tLoading   : '<div class="dots">\
							<div class="dot active"></div>\
							<div class="dot active"></div>\
							<div class="dot active"></div>\
							<div class="dot active"></div>\
						</div>',
				mainClass  : 'mfp-img-mobile',
				gallery    : {
					enabled           : true,
					navigateByImgClick: true,
					preload           : [0, 3] // Will preload 0 - before current, and 1 after the current image
				},
				image      : {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
				},
				closeMarkup: '<button title="%title%" type="button" class="mfp-close"></button>',
				callbacks  : {
					markupParse      : function (item) {
					},
					imageLoadComplete: function () {
						var $container = $('.mfp-container');

						$container.addClass('load-done');
						setTimeout(function () {
							$container.addClass('load-transition');
						}, 50);
					},
					change           : function () {
						var $container = $('.mfp-container');
						$container.removeClass('load-done load-transition');
					}

				}
			}, $self.data(), opts);
		$('.media', $self).each( function () {
			var href = $(this).data('url');

			if (href && href !== '') {
				$(this).attr('href', href);
			}

		});
		$self.magnificPopup(options);
	};

	$(document).ready(function () {

		/* 1. Menu Mobile */
		var $btnMenu = $('.menu-mobile'),
			$boxLeft = $('.box-left'),
			$menuMobile = $('.main-menu', $boxLeft),
			$bodyCover = $('.body-overlay');

		$('a', $menuMobile).on('click', function (event) {
			var $li = $(this).closest('li'),
				$subMenu = $('> .sub-menu', $li);

			if ($subMenu.length) {
				event.preventDefault();
				$subMenu.slideToggle(300);
			}
		});

		$btnMenu.on('click', function () {
			$boxLeft.toggleClass('active');
		});

		$bodyCover.on('click', function () {
			$boxLeft.removeClass('active');
		});

		$(document).on('keydown', function (event) {
			if ($boxLeft.hasClass('active') && event.keyCode === 27) {
				$bodyCover.trigger('click');
			}
		});

		/* 2. Portfolio */
		var $portfolio = $('.grids-layout');

		if ($portfolio.length) {

			$portfolio.each(function () {
				$(this).decozIsotope();
			})
		}

		/* 3. Map */
		var $maps = $('.maps');

		if ($maps.length) {
			var lat = $maps.data('lat') ? $maps.data('lat') : '21.036671',
				long = $maps.data('long') ? $maps.data('long') : '105.835090',
				zoom = $maps.data('zoom') ? $maps.data('zoom') : 15,
				dataMap = {
					zoom                 : zoom,
					center               : new google.maps.LatLng(lat, long),
					mapTypeId            : google.maps.MapTypeId.ROADMAP,
					mapTypeControlOptions: {
						mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
							'styled_map']
					},
					scrollwheel          : false,
					styles               : [{
						"featureType": "water",
						"stylers"    : [{"saturation": 43}, {"lightness": -11}, {"hue": "#0088ff"}]
					}, {
						"featureType": "road",
						"elementType": "geometry.fill",
						"stylers"    : [{"hue": "#ff0000"}, {"saturation": -100}, {"lightness": 99}]
					}, {
						"featureType": "road",
						"elementType": "geometry.stroke",
						"stylers"    : [{"color": "#808080"}, {"lightness": 54}]
					}, {
						"featureType": "landscape.man_made",
						"elementType": "geometry.fill",
						"stylers"    : [{"color": "#ece2d9"}]
					}, {
						"featureType": "poi.park",
						"elementType": "geometry.fill",
						"stylers"    : [{"color": "#ccdca1"}]
					}, {
						"featureType": "road",
						"elementType": "labels.text.fill",
						"stylers"    : [{"color": "#767676"}]
					}, {
						"featureType": "road",
						"elementType": "labels.text.stroke",
						"stylers"    : [{"color": "#ffffff"}]
					}, {"featureType": "poi", "stylers": [{"visibility": "off"}]}, {
						"featureType": "landscape.natural",
						"elementType": "geometry.fill",
						"stylers"    : [{"visibility": "on"}, {"color": "#b8cb93"}]
					}, {
						"featureType": "poi.park",
						"stylers"    : [{"visibility": "on"}]
					}, {
						"featureType": "poi.sports_complex",
						"stylers"    : [{"visibility": "on"}]
					}, {
						"featureType": "poi.medical",
						"stylers"    : [{"visibility": "on"}]
					}, {"featureType": "poi.business", "stylers": [{"visibility": "simplified"}]}]
				},
				map = new google.maps.Map($maps[0], dataMap),
				marker = new google.maps.Marker({
					position: new google.maps.LatLng(lat, long),
					map     : map,
					icon    : 'images/marker.png'
				});
		}

		// 4. Project Details
		var $imageProject = $('.images-project');

		if ($imageProject.length) {
			$imageProject.decozMagnificPopup({
				delegate: 'a'
			});
		}

		// Tooltips
		var $controls = $('.controls', '.projects');

		if ($controls.length) {
			$('[data-tooltip]', $controls).each( function () {
				var $this = $(this),
					number = $(this).data('tooltip'),
					tooltip = '<span class="tooltip-text"></span>',
					$tooltip;

				if (!$('.tooltip-text', $this).length) {
					$this.append(tooltip);
				}

				if (!number) {
					number = 0;
				}
				$tooltip = $('.tooltip-text', $this);

				$tooltip.text(number);
			});
		}

		// Like Project
		// 5. Like Project
		var $btnLike = $('.zmdi-favorite');

		if ($btnLike.length) {
			var $numberLike = $('.number-like');
			$btnLike.on('click', function (event) {

				if ($btnLike.hasClass('running')) {
					return;
				}
				$btnLike.addClass('running');
				$.ajax({
					url: DECOZ_SCRIPTS.DECOZ_AJAX,
					data: {
						action: 'decoz_increase_like_project',
						post_id: $btnLike.data('id')
					},
					type: 'POST',
					success: function (respond) {
						$numberLike.text(respond);
					},
					error: function () {
						$btnLike.removeClass('running');
					},
					complete: function (respond) {
					}
				})
			})
		}

		// Load More
		/**
		 * To do loadmore
		 */

		// Sticky Project
		var $projectInner = $('.project-inner.sticky');

		if ($projectInner.length && $projectInner.parent().hasClass('col-md-6')) {
			console.log($projectInner);
			var options = {
				marginTop: 0,
				limit: function () {
					var limit = $imageProject.outerHeight(true) + $imageProject.offset().top - $projectInner.outerHeight(true);

					return limit;
					// return $('#footer').offset().top ;j
				},
				removeOffsets: true
			};

			$projectInner.scrollToFixed(options);
		}

	});

	// 5. Preload
	$(window).on('load', function () {
		var $preload = $('#preload');

		if ($preload.length) {
			$preload.addClass('deactivate');
		}
	});



})(jQuery);