this.$jin_onChange= $jin_class( function( $jin_onChange, event ){
    
    $jin_event.scheme( $jin_onChange )
    
    $jin_onChange.type= '$jin_onChange'
    
    $jin_onChange.listen= function( node, handler ){
        return $jin_nodeListener
        (   node
        ,   'DOMSubtreeModified'
        ,   $jin_onChange.wrapHandler( handler )
        )
    }
    
} )
