this.$jin_class_scheme= function( classScheme ){
    var factoryScheme= function( klass ){
        return classScheme.call( this, klass, klass.prototype )
    }
    
    factoryScheme.classScheme= classScheme
    
    return factoryScheme
}