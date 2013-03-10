this.$jin_event= $jin_mixin( function( $jin_event, event ){
    $jin_wrapper.scheme.apply( this, arguments )
    
    $jin_event.type= null
    $jin_event.bubbles= false
    $jin_event.cancelable= false
    
    $jin_event.listen= function( node, handler ){
        if( node.addEventListener ){
            return $jin_nodeListener
            (   node
            ,   $jin_event.type
            ,   $jin_event.wrapHandler( handler )
            )
        } else {
            return $jin_nodeListener
            (   node
            ,   /^[a-zA-Z]+$/.test( $jin_event.type ) ? $jin_event.type : 'beforeeditfocus'
            ,   $jin_event.wrapHandler( handler )
            )
        }
    }
    
    $jin_event.wrapHandler= function( handler ){
        if( document.addEventListener ){
            return function( event ){
                return handler( $jin_event( event ) )
            }
        } else {
            return function( event ){
                event= $jin_event( event )
                if( event.type() !== $jin_event.type ) return
                return handler( event )
            }
        }
    }
    
    $jin_event.toString=
    function( ){
        return $jin_event.type
    }
    
    var init= event.init
    event.init= function( event, raw ){
        if( arguments.length === 1 ){
            if( document.createEvent ){
                raw= document.createEvent( 'Event' )
                raw.initEvent( $jin_event.type, $jin_event.bubbles, $jin_event.cancelable )
            } else {
                raw= document.createEventObject()
                raw.type= $jin_event.type
            }
        } else {
            raw= $jin_unwrap( raw )
        }
        init( event, raw )
    }
    
    event.scream=
    function( event, node ){
        if( node.dispatchEvent ){
            node.dispatchEvent( event.$ )
        } else {
            if( /^[a-zA-Z]+$/.test( event.type() ) ){
                node.fireEvent( 'on' + event.type(), event.$ )
            } else {
                event.$.$jin_event_type= event.type()
                node.fireEvent( 'onbeforeeditfocus', event.$ )
            }
        }
        return event
    }
    
    event.target=
    function( event, target ){
        return event.$.target
    }
    
    event.type=
    function( event, type ){
        if( arguments.length === 1 )
            return event.$.$jin_event_type || event.$.type
        
        if( event.$.initEvent ){
            event.$.initEvent( type, event.bubbles(), event.cancelable() )
        } else {
            event.$.$jin_event_type= event.$.type= type
        }
        
        return event
    }
    
    event.bubbles=
    function( event, bubbles ){
        if( arguments.length === 1 )
            return event.$.bubbles
        
        event.$.initEvent( event.type(), bubbles, event.cancelable() )
        return event
    }
    
    event.cancelable=
    function( event, cancelable ){
        if( arguments.length === 1 )
            return event.$.cancelable
        
        event.$.initEvent( event.type(), event.bubbles(), cancelable )
        return event
    }
    
    event.catched=
    function( event, catched ){
        if( arguments.length === 1 )
            return event.$.defaultPrevented || event.$.$jin_event_catched
        
        event.$.returnValue= !catched
        if( catched && event.$.preventDefault ) event.$.preventDefault()
        event.$.$jin_event_catched= event.$.defaultPrevented= catched
        
        return event
    }
    
    event.toString=
    function( event ){
        return $jin_event + '()'
    }
    
})