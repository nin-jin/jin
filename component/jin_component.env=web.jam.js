this.$jin_component=
$jin_class( function( $jin_component, component ){
    
    $jin_component.map= {}
    
    $jin_component.checkTree= function( node ){
        var nodes= node.getElementsByTagName( '*' )
        for( var i= 0; i < nodes.length; ++i ){
            checkNode( nodes[ i ] )
        }
    }
    
    $jin_component.widgetsOf= function( node ){
        return node.jin_component_widgets || {}
    }
    
    component.id= null
    component.widget= null
    
    var init= component.init
    component.init= function( component, id, widget ){
        init.apply( this, arguments )
        
        component.id= id
        component.widget= { make: widget }
        
        $jin_component.map[ component.id ]= component
        
        $jin_component.checkTree( document )
    }
    
    var destroy= component.destroy
    component.destroy= function( component ){
        delete $jin_component.map[ component.id ]
        
        destroy.apply( this, arguments )
    }
    
    $jin_onElemAdd.listen( document, function( event ){
        checkNode( event.target() )
    })
    
    $jin_onElemDrop.listen( document, function( event ){
        var node= event.target()
        
        var widgets= node.jin_component_widgets
        if( !widgets ) return
        
        for( var id in widgets ){
            var widget= widgets[ id ]
            if( !widget ) continue
            widget.destroy()
        }
        
        delete node.jin_component_widgets
    })
    
    $jin_onDomReady.listen( document, function( event ){
        $jin_component.checkTree( document )
    })
    
    function checkNode( node ){
        if( node.nodeType != 1 ) return
        
        var names= [ node.localName ]
        
        for( var i= 0; i < node.attributes.length; ++i ){
            names.push( node.attributes[ i ].nodeName )
        }
        
        names.forEach( function( name ){
            var component= $jin_component.map[ name ]
            if( component ) checkNodeComponent( node, component )
        })
    }
    
    function checkNodeComponent( node, component ){
        var widgets= $jin_component.widgetsOf( node )
        if( component.id in widgets ) return
        
        widgets[ component.id ]= component.widget.make( node )
        node.jin_component_widgets= widgets
    }

} )