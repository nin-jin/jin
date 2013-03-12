this.$jin_factory= function( scheme ){
    
    var factory= function( ){
        if( this instanceof factory ) return
        return factory.make.apply( factory, arguments )
    }
    
    factory.make= function( ){
        return new this
    }
    
    factory.init= function( ){
    }
    
    scheme( factory )
    
    factory.init()
    
    return factory
}
