this.$jin_registry=
$jin_class( function( $jin_registry, registry ){
    var storage= {}
    
    var make= $jin_registry.make
    $jin_registry.make=
    function( name ){
        var key= '_' + name
        var obj= storage[ key ]
        if( obj ) return obj
        
        return storage[ key ]= make.apply( this, arguments )
    }
    
})
