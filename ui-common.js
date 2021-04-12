(function(){
	var screenPositionTempSav;
	function fn_hideScroll(){
		if( fn_check_mo() ){
			screenPositionTempSav = window.scrollY;
			$( "body" ).height( window.innerHeight ).addClass( "on-layer" );
		}
	}
	function fn_showScroll(){
		if( fn_check_mo() ){
			$( "body" ).removeAttr( "style" ).removeClass( "on-layer" );
			setTimeout(function(){
				window.scrollTo({
					top: screenPositionTempSav,
					left: 0,
					behavior: 'smooth'
				});
			},0);
		}
	}
	/* .btn-show-nav */
	function fn_check_mo(){
		if( $( ".btn-show-nav" ).is( ":visible" ) ){
			return true;
		} else {
			return false;
		}
	}

	/* tab title */
	$( ".tab-title a ").on( "click", function(e){
		e.preventDefault();
		var $t = $( this ),
			$p = $t.closest( ".tab-title" );
			console.log('1')
		$p.find( "li" ).removeClass( "on" );
		$t.closest( "li" ).addClass( "on" );
	});

	/* main - trading apply btn */
	$( ".trading-fixed-btn-apply" ).on("click", function(){
		$( ".trading.layer-full" ).addClass( "on" );
		fn_hideScroll();
	});

	/* main - layer close btn */
	$( ".layer-btn-close" ).on("click", function(){
		$( this ).closest( ".layer" ).removeClass( "on" );
		fn_showScroll();
	});

	/* nav - show */
	$( ".btn-show-nav" ).on( "click", function(e){
		$( ".nav" ).addClass( "on" );
	});

	/* nav - close */
	$( ".nav-btn-close" ).on( "click", function(e){
		$( ".nav" ).removeClass( "on" );
	});

	/* nav - depth1 */
	$( ".nav-depth1 > li > a" ).on( "click", function(e){
		e.preventDefault();
		$( ".nav-depth1 > li" ).removeClass( "on" );
		$( this ).closest( "li" ).addClass( "on" );
	});

	/* nav - depth2 */
	$( ".nav-depth2 > li.has-depth > a" ).on( "click", function(e){
		if( fn_check_mo() ){
			var $target = $( this ).closest( ".has-depth" );
			e.preventDefault();
			$target.hasClass( "on" ) ? $target.removeClass( "on" ) : $target.addClass( "on" );
		}
	});

	$( ".nav-depth2 > li.has-depth" ).on( "mouseenter", function(e){
		if( !fn_check_mo() ){
			$( this ).closest( ".has-depth" ).addClass( "on" );
		}
	});

	$( ".nav-depth2 > li.has-depth" ).on( "mouseleave", function(e){
		if( !fn_check_mo() ){
			$( this ).closest( ".has-depth" ).removeClass( "on" );
		}
	});

	/* nav - btn-show-nav */
	$( ".gnb a" ).on("mouseenter", function(){
		if( !fn_check_mo() ){
			$( ".nav" ).addClass( "on" );
			$( ".nav-depth1 > li" ).removeClass( "on" );
			$( ".nav-depth1 > li" ).eq( $( this ).closest( "li" ).index() ).addClass( "on" );
		}
	});

	$( ".nav-wrap" ).on("mouseleave", function(){
		$( ".nav" ).removeClass( "on" );
	});

})();
