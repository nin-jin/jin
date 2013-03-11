this.$jin_onDataNeeds= $jin_class( function( $jin_onDataNeeds, event ){
    
    $jin_eventProof.scheme( $jin_onDataNeeds )
    
    $jin_onDataNeeds.type= 'jin_onDataNeeds'
    $jin_onDataNeeds.bubbles= true
    
    event.options= function( event, options ){
        if( arguments.length > 1 ){
            event.$.options= options
            return event
        } else {
            return event.$.options
        }
    }
    
} )
