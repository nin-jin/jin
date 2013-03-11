this.$jin_widget= function( $jin_widget, widget ){
    
    $jin_wrapper.scheme( $jin_widget )
    
    $jin_widget.component= $jin_component( $jin_widget.id, $jin_widget )
    
    var destroy= $jin_widget.destroy
    $jin_widget.destroy= function( ){
        $jin_widget.component.destroy()
        destroy()
    }
    
}