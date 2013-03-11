this.$jin_class= function( scheme ){
    return $jin_factory( function( klass ){
        
        var proto= klass.prototype
        proto.init= function( obj ){ }
        
        klass.scheme= $jin_class_scheme( scheme )
        
        var make= klass.make
        klass.make= function( ){
            var obj= make.apply( this, arguments )
            obj.init.apply( obj, arguments )
            return obj
        }
        
        var destroy= 
        proto.destroy=
        function( obj ){
            for( var key in obj ){
                if( !obj.hasOwnProperty( key ) )
                    continue
                
                var val= obj[ key ]
                if(( val )&&( typeof val.destroy === 'function' ))
                    val.destroy()
                
                delete obj[ key ]
            }
        }
        
        klass.destroy= function( ){
            destroy( klass )
        }
        
        klass.scheme( klass )
        
        for( var key in proto ){
            if( !proto.hasOwnProperty( key ) )
                continue
            
            proto[ key ]= $jin_method( proto[ key ] )
        }
        
    } )
}

