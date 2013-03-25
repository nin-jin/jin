this.$jin_file=
$jin_class( function( $jin_file, file ){
    
    $jin_registry.scheme( $jin_file )
    $jin_wrapper.scheme( $jin_file )
    
    var init= file.init
    file.init= function( file, path ){
        init( file, $node.path.resolve( path ) )
    }
    
    file._stat= null
    file.stat= function( file ){
        if( file._stat ) return file._stat
        return file._stat= $node.fs.statSync( String( file ) )
    }
    
    file.version= function( file ){
        return file.stat().mtime.getTime().toString( 36 ).toUpperCase()
    }
    
    file.exists= function( file ){
        try {
            return !!file.stat().valueOf()
        } catch( error ){
            if( error.code === 'ENOENT' ) return false
            throw error
        }
    }
    
    file.isDir= function( file ){
        return file.stat().isDirectory()
    }
    
    file.isFile= function( file ){
        return file.stat().isFile()
    }
    
    file.toString= function( file ){
        return file.$
    }
    
    file.name= function( file ){
        return $node.path.basename( String( file ) )
    }
    
    file.ext= function( file ){
        return $node.path.extname( String( file ) )
    }
    
    file.content= function( file, content ){
        var path= String( file )
        if( arguments.length < 2 ) return $node.fs.readFileSync( path )
        try {
            $node.fs.mkdirSync( String( file.parent() ) )
        } catch( error ){
            if( error.code !== 'EEXIST' ) throw error
        }
        $node.fs.writeFileSync( path, String( content ) )
        return file
    }
    
    file.parent= function( file ){
        var path= $node.path.dirname( String( file ) )
        return $jin_file( path )
    }
    
    file.child= function( file, name ){
        return $jin_file( $node.path.join( String( file ), name ) )
    }
    
    file._childs= null
    file.childs= function( file ){
        if( file._childs ) return file._childs
        
        var names= $node.fs.readdirSync( String( file ) )
        return $jin_lazyProxy( function( ){
            return file._childs= names.map( function( name ){
                return file.child( name )
            } )
        } )
    }
    
    file.load= function( file ){
        return require( String( file ) )
    }
    
    file.relate= function( file, base ){
        return $node.path.relative( String( base ), String( file ) )
    }
    
    file.uri= function( file ){
        return $jin_uri( file.relate( '' ).replace( /\\/g, '/' ) + '?jin_file_version=' + file.version() )
    }
    
} )
