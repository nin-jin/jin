this.$jin_onInput= $jin_class( function( $jin_onInput, event ){
    
    $jin_event.scheme( $jin_onInput )
    
    $jin_onInput.type= '$jin_onInput'
    
    $jin_onInput.listen= function( node, handler ){
        return $jin_nodeListener
        (   node
        ,   'input'
        ,   $jin_onInput.wrapHandler( handler )
        )
    }
    
} )
