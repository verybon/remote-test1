/* tab title */
(function(){
     $( ".tab-title a ").on( "click", function(e){
          e.preventDefault();
          var $t = $( this ),
               $p = $t.closest( ".tab-title" );
               console.log('1')
          $p.find( "li" ).removeClass( "on" );
          $t.closest( "li" ).addClass( "on" );
     });
})();
