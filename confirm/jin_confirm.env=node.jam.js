this.$jin_confirm= $jin_async2sync( function( question, done ){
    require( 'promptly' ).confirm( question, done )
}, 'now' )