this.$jin_nodeListener=
$jin_class( function( $jin_nodeListener, listener ){
    
    listener.node= null
    listener.event= null
    listener.handler= null
    
    listener.init=
    function( listener, node, event, handler ){
        listener.node= node
        listener.event= event
        listener.handler= handler
        
        listener.on()
        
        return listener
    }
    
    var destroy= listener.destroy
    listener.destroy=
    function( listener ){
        listener.off()
        
        destroy.apply( this, arguments )
    }
    
    listener.on=
    function( listener ){
        if( listener.node.addEventListener ){
            listener.node.addEventListener
            (   listener.event
            ,   listener.handler
            ,   false
            )
        } else {
            listener.node.attachEvent
            (   'on' + listener.event
            ,   listener.handler
            )
        }
        
        return listener
    }
    
    listener.off=
    function( listener ){
        if( listener.node.removeEventListener ){
            listener.node.removeEventListener
            (   listener.event
            ,   listener.handler
            ,   false
            )
        } else {
            listener.node.detachEvent
            (   'on' + listener.event
            ,   listener.handler
            )
        }
        
        return listener
    }
    
})