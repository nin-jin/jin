this.$jin_mod=
$jin_class( function( $jin_mod, mod ){
    
    $jin_registry.scheme( $jin_mod, mod )
    $jin_wrapper.scheme( $jin_mod, mod )
    
    mod.file= null
    
    mod.toString= function( mod ){
        return String( mod.file )
    }
    
    mod.init= function( mod, path ){
        mod.file= $jin_file( path )
    }
    
    mod.pack= function( mod ){
        return $jin_pack( mod.file.parent() )
    }
    
    mod.src= function( mod, name ){
        return $jin_src( mod.file.child( name ) )
    }    
    
    mod.srcs= function( mod ){
        return mod.file.childs()
        .filter( function( file ){
            return file.isFile() && /^[a-zA-Z]/.test( file.name() )
        } )
        .map( function( file ){
            return $jin_src( file )
        } )
    }
    
} )
