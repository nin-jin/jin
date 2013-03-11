this.$jin_eventProof= $jin_class( function( $jin_eventProof, event ){
    $jin_event.scheme( $jin_eventProof )
    
    var scream= event.scream
    event.scream=
    function( event, node ){
        scream( event, node )
        
        if( !event.catched() )
            throw new Error( '[' + event + '] is not catched' )
        
        return event
    }
    
})
