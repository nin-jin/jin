this.$jin_widget= $jin_class_scheme( function( $jin_widget, widget ){
    
    $jin_wrapper.scheme( $jin_widget )
    
    $jin_widget.id= null
    
    var staticInit= $jin_widget.init
    $jin_widget.init= function( ){
        staticInit()
        $jin_widget.component= $jin_component( $jin_widget.id, $jin_widget )
    }
    
    var make= $jin_widget.make
    $jin_widget.make= function( node ){
        var widgets= $jin_component.widgetsOf( node )
        return widgets[ $jin_widget.id ] || make.apply( this, arguments )
    }
    
    var destroy= $jin_widget.destroy
    $jin_widget.destroy= function( ){
        $jin_widget.component.destroy()
        destroy()
    }
    
    $jin_widget.toString= function( ){
        return $jin_widget.id
    }
    
} )