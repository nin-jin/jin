this.$jin_onDataSupply= $jin_class( function( $jin_onDataSupply, event ){
    
    $jin_eventProof.scheme( $jin_onDataSupply )
    
    $jin_onDataSupply.type= 'jin_onDataSupply'
    
    event.content= function( event, content ){
        if( arguments.length > 1 ){
            event.$.content= content
            return event
        } else {
            return event.$.content
        }
    }
    
} )
