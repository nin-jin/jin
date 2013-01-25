this.$jin_file=
$jin_class( function( $jin_file, file ){
    
    $jin_registry.scheme( $jin_file, file )
    $jin_wrapper.scheme( $jin_file, file )
    
    var init= file.init
    file.init= function( file, path ){
        init( file, $.path.normalize( path ) )
    }
    
    file._stat= null
    file.stat= function( file ){
        if( file._stat ) return file._stat
        return file._stat= $.fs.statSync( String( file ) )
    }
    
    file.version= function( file ){
        return file.stat().mtime.getTime().toString( 26 ).toUpperCase()
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
        return $.path.basename( String( file ) )
    }
    
    file.ext= function( file ){
        return $.path.extname( String( file ) )
    }
    
    file.content= function( file, content ){
        var path= String( file )
        if( arguments.length < 2 ) return $.fs.readFileSync( path )
        try {
            $.fs.mkdirSync( file.parent() )
        } catch( error ){
            if( error.code !== 'EEXIST' ) throw error
        }
        return $.fs.writeFileSync( path, String( content ) )
    }
    
    file.parent= function( file ){
        var path= $.path.dirname( String( file ) )
        return $jin_file( path )
    }
    
    file.child= function( file, name ){
        return $jin_file( $.path.join( String( file ), name ) )
    }
    
    file._childs= null
    file.childs= function( file ){
        if( file._childs ) return file._childs
        
        var names= $.fs.readdirSync( String( file ) )
        return $.jin.lazy( function( ){
            return file._childs= names.map( function( name ){
                return file.child( name )
            } )
        } )
    }
    
} )
