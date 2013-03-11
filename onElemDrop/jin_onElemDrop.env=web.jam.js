this.$jin_onElemDrop= $jin_class( function( $jin_onElemDrop, event ){
    
    $jin_event.scheme( $jin_onElemDrop )
    
    $jin_onElemDrop.type= '$jin_onElemDrop'
    
    $jin_onElemDrop.listen=
    function( node, handler ){
        return $jin_nodeListener
        (   node
        ,   'DOMNodeRemoved'
        ,   $jin_onElemDrop.wrapHandler( handler )
        )
    }
    
    var wrapHandler= $jin_onElemDrop.wrapHandler
    $jin_onElemDrop.wrapHandler= function( handler ){
        handler= wrapHandler( handler )
        
        return function( event ){
            event= $jin_onElemDrop( event )
            
            var target= event.target()
            if( target.nodeType !== 1 ) return
            
            var elems= ( /*@cc_on!@*/0 ) ? [] : [].slice.call( target.getElementsByTagName( '*' ) )
            elems.unshift( event.target() )
            
            for( var i= 0; i < elems.length; ++i ){
                var lister= $jin_nodeListener
                (   elems[ i ]
                ,   $jin_onElemDrop.type
                ,   handler
                )
                
                $jin_onElemDrop().scream( elems[ i ] )
                lister.destroy()
            }
        }
    }
    
} )
