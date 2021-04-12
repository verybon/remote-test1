
(function(){

     /* tab title */
     $( ".tab-title a ").on( "click", function(e){
          e.preventDefault();
          var $t = $( this ),
               $p = $t.closest( ".tab-title" );
               console.log('1')
          $p.find( "li" ).removeClass( "on" );
          $t.closest( "li" ).addClass( "on" );
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
          var $target = $( this ).closest( ".has-depth" );
          e.preventDefault();
          $target.hasClass( "on" ) ? $target.removeClass( "on" ) : $target.addClass( "on" );
     });

     // btn-show-nav

})();
