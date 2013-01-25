with(this){
;//jin\proxy\jin_proxy.jam.js
this.$jin_proxy=
function( handler ){

    if( typeof Proxy === 'undefined' )
        throw new Error( 'Can not find Proxy API. In node.js use --harmony flag to enable.' )

    if( typeof Proxy === 'function' ) return function( target ){
        return Proxy( target, handler )
    }
    
    var oldTraps= new function( ){
        
        this.getOwnPropertyDescriptor=
        this.getPropertyDescriptor=
        function( name ){
            if( handler.getOwnPropertyDescriptor ) return handler.getOwnPropertyDescriptor( this.valueOf(), name )
            return Object.getOwnPropertyDescriptor( this.valueOf(), name )
        }
        
        this.getOwnPropertyNames=
        function( ){
            return ( handler.getOwnPropertyNames || Object.getOwnPropertyNames )( this.valueOf() )
        }
        
        this.defineProperty=
        function( name, descriptor ){
            return ( handler.getOwnPropertyNames || Object.getOwnPropertyNames )( this.valueOf(), name, descriptor )
        }
        
        this.delete=
        function( name ){
            return handler.deleteProperty ? handler.deleteProperty( this.valueOf(), name ) : delete this.valueOf()[ name ]
        }
        
        this.fix=
        function( ){
            throw new Error( '"fix" trap is unsupported for this proxy' )
        }
        
        this.has=
        function( name ){
            return handler.has ? handler.has( this.valueOf(), name ) : name in this.valueOf()
        }
        
        this.hasOwn=
        function( name ){
            return handler.hasOwn ? handler.hasOwn( this.valueOf(), name ) : this.valueOf().hasOwnProperty( name )
        }
        
        this.get=
        function( receiver, name ){
            if( handler.get ) return handler.get( this.valueOf(), name, receiver )
            
            if( name === 'valueOf' ) return this.valueOf
            if( name === 'toString' ) return function(){ return String( this.valueOf() ) }
            if( name === 'inspect' ) return function(){ return require( 'util' ).inspect( this.valueOf() ) }
            if( this.valueOf() == null ) return null
            
            return this.valueOf()[ name ]
        }
        
        this.set=
        function( receiver, name, value ){
            if( handler.set ) return handler.set( this.valueOf(), name, value, receiver )
            
            this.valueOf()[ name ]= value
            return this.valueOf()[ name ] === value
        }
        
        this.enumerate=
        function( ){
            if( handler.enumerate ) return handler.enumerate( this.valueOf() )
            
            var names= []
            for( var name in this.valueOf() ) names.push( name )
            return names
        }
        
        this.keys=
        function( ){
            if( handler.keys ) return handler.keys( valueOf )
            
            return Object.keys( Object( this.valueOf() ) )
        }
        
        this.valueOf= null
        
    }
    
    return function( target ){
        target= target && target.valueOf()
        var valueOf=
        function( ){
            return handler.hasOwnProperty( 'valueOf' ) ? handler.valueOf( target ) : target
        }
        
        var traps= Object.create( oldTraps )
        traps.valueOf= valueOf
        return Proxy.createFunction
        (   traps
        ,   function( ){
                return handler.apply ? handler.apply( valueOf(), this, arguments ) : valueOf().apply( this, arguments )
            }
        ,   function( ){
                if( handler.construct ) return handler.construct( valueOf(), arguments )
                
                var obj= Object.create( valueOf().prototype )
                var res= valueOf().apply( obj, arguments )
                
                return Object( ( res == null ) ? obj : res )
            }
        )
    }

}
;//jin\lazyProxy\jin_lazyProxy.jam.js
this.$jin_lazyProxy=
function( make ){
    var value
    var maked= false
    
    var get= function( ){
        if( maked ) return value
        value= make()
        maked= true
        return value
    }
    
    return $jin_proxy
    (   {   valueOf: function( target ){
                return target()
            }
        }
    )
    ( get )
}
;//jin\async2sync\jin_async2sync.env=node.jam.js
this.$jin_async2sync=
function( func, now ){
    return $jin_proxy
    (   {   apply:
            function( func, self, args ){
                var fiber= null
                var result= null
                var error= null
                var done= false
                
                void [].push.call( args, function( err, res ){
                    
                    result= res
                    error= err
                    done= true
                    
                    if( fiber ){
                        fiber.run( )
                        fiber= null
                    }
                } )
                
                void func.apply( self, args )
                
                if( done ){
                    if( error ) throw error
                    return result
                }
                
                var get= function( ){ 
                    if( !done ){
                        var fibers= require( 'fibers' )
                        fiber= fibers.current
                        fibers.yield()
                        if( error ) error.stack+= '\n--fiber--' + (new Error).stack.replace( /^[^\n]*/, '' )
                    }
                    
                    if( error ) throw error
                    return result
                }
                
                return now ? get() : $jin_lazyProxy( get )
            }
        }
    )( func )
}

;//jin\fiberizer\jin_fiberizer.env=node.jam.js
this.$jin_fiberizer=
$jin_proxy( { get: function( base, name ){
    if( !require( 'fibers' ).current )
        return base[ name ]
    
    if( name === 'valueOf' ) return function( ){ return base }
    if( name === 'inspect' ) return function(){ return require( 'util' ).inspect( base ) }
    
    var chunks= /^(.+)Sync(Now)?$/.exec( name )
    if( !chunks ){
        if( typeof base[ name ] !== 'object' )
            return base[ name ]
        
        return fiberizer( base[ name ] )
    }
    
    name= chunks[ 1 ]
    if( typeof base[ name ] !== 'function' )
        return base[ name ]
    
    var now= chunks[ 2 ]
    var value= $jin_async2sync( base[ name ], now )
    
    return value
} } )

;//jin\autoloader\jin_autoloader.env=node.jam.js
this.$jin_autoloader=
$jin_proxy( { get: function( prefix, name ){
    var path= ( prefix || '' ) + name
    
    try {
        path= require.resolve( path )
    } catch( error ){
        if( error.code !== 'MODULE_NOT_FOUND' ) throw error
        if( name === 'constructor' ) return function(){ return function(){} }
        
        if( name === 'inspect' ) return function(){ return '$jin_autoloader( "' + prefix + '" )' }
        
        console.info( '$.jin.loader: Autoinstall( ' + path + ' )')
        
        var $= $jin_autoloader()
        $.npm.loadSyncNow( {} )
        $.npm.commands.installSyncNow([ path ])
    }
    
    return /*$jin_fiberizer*/( require( path ) )
} } )

;//jin\jin\jin.env=node.jam.js
this.$= $jin_autoloader()
;//jin\application\jin_application.env=node.jam.js
this.$jin_application= function( app, done ){
    var $= $jin_autoloader()
    app= $.jin.sync2async( app )
    return app( $, done )
}
;//jin\factory\jin_factory.jam.js
this.$jin_factory= function( scheme ){
    
    var factory= function( ){
        if( this instanceof factory ) return
        return factory.make.apply( factory, arguments )
    }
    
    factory.make= function( ){
        return new this
    }
    
    scheme( factory )
    
    return factory
}

;//jin\method\jin_method.jam.js
this.$jin_method= function( func ){
    if( typeof func !== 'function' )
        return func
    
    var method= function( ){
        var args= [].slice.call( arguments )
        args.unshift( this )
        return func.apply( null, args )
    }
    
    method.call= func
    
    return method
}

;//jin\class\jin_class.jam.js
this.$jin_class= function( scheme ){
    return $jin_factory( function( klass ){
        
        var proto= klass.prototype
        proto.init= function( obj ){ }
        
        klass.scheme= scheme
        
        var make= klass.make
        klass.make= function( ){
            var obj= make.apply( this, arguments )
            obj.init.apply( obj, arguments )
            return obj
        }
        
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
        
        scheme( klass, proto )
        
        for( var key in proto ){
            if( !proto.hasOwnProperty( key ) )
                continue
            
            proto[ key ]= $jin_method( proto[ key ] )
        }
        
    } )
}


;//jin\mixin\jin_mixin.jam.js
this.$jin_mixin=
function( schemeMixin ){
    
    var mixin= $jin_class( schemeMixin )
    
    mixin.make=
    function( scheme ){
        return $jin_class( function( Class, proto ){
            schemeMixin( Class, proto )
            scheme( Class, proto )
        })
    }
    
    return mixin
}



;//jin\registry\jin_registry.jam.js
this.$jin_registry=
$jin_mixin( function( $jin_registry, registry ){
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

;//jin\wrapper\jin_wrapper.jam.js
this.$jin_wrapper=
$jin_mixin( function( $jin_wrapper, wrapper ){
    
    var make= $jin_wrapper.make
    $jin_wrapper.make=
    function( obj ){
        if( obj instanceof $jin_wrapper ) return obj
        
        return make.apply( this, arguments )
    }
    
    wrapper.$= null
    
    var init= wrapper.init
    wrapper.init= function( wrapper, value ){
        init.apply( this, arguments )
        wrapper.$= value
    }
    
})

;//jin\file\jin_file.env=node.jam.js
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

;//jin\listFiles\jin_listFiles.env=node.jam.js
this.$jin_listFiles=
function( root, includeDir, excludeDir ){
    includeDir= includeDir || /./
    excludeDir= excludeDir || /\/\W/
    root= root || '.'
    
    function Files( root, stats ){
        this.root= root
        this.stats= stats
    }
    void function( files ){
        
        files.root= null
        files.stats= null
        
        files.filter= function( includeFile, excludeFile ){
            includeFile= includeFile || /./
            excludeFile= excludeFile || /\/\W/
            
            var stats= {}
            for( var path in this.stats ){
                if( !includeFile.test( path ) ) continue
                if( excludeFile.test( path ) ) continue
                
                stats[ path ]= this.stats[ path ]
            }
            return new Files( this.root, stats )
        }
        
        files.list= function( ){
            return Object.keys( this.stats )
        }
        
        files.toString= function(){
            return 'Files {' + this.list() + ']'
        }
        
    }( Files.prototype )

    var getStat= $.fs.statSync
    var getChilds= $.fs.readdirSync
    
    var childs= {}
    childs[ '/' ]= getChilds( root )
    
    var files= {}
    while( true ){
        
        var stats= {}
        for( var dir in childs ){
            childs[ dir ].forEach( function( name ){
                var path= dir + name
                stats[ path ]= getStat( root + path )
            } )
        }
        
        var end= true
        childs= {}
        for( var path in stats ){
            var stat= stats[ path ]
            
            if( stat.isDirectory() ){
                path+= '/'
                
                if( !includeDir.test( path ) ) continue
                if( excludeDir.test( path ) ) continue
                
                childs[ path ]= getChilds( root + path )
                end= false
                
                continue
            }
             
            if( !stat.isFile() ) continue
            
            files[ path ]= stat
        }
        if( end ) break
        
    }
    return new Files( root, files )
}

;//jin\pms\jin_pms.env=node.jam.js
this.$jin_pms=
$jin_class( function( $jin_pms, pms ){
    
    $jin_registry.scheme( $jin_pms, pms )
    $jin_wrapper.scheme( $jin_pms, pms )
    
    pms.file= null
    
    pms.toString= function( pms ){
        return String( pms.file )
    }
    
    pms.init= function( pms, path ){
        pms.file= $jin_file( path )
    }
    
    pms.pack= function( pms, name ){
        return $jin_pack( pms.file.child( name ) )
    }
    
    pms.mod= function( pms, name ){
        var chunks= /^([a-zA-Z0-9]+)_([a-zA-Z0-9]+)/.exec( name )
        var packName= chunks[ 1 ]
        var modName= chunks[ 2 ]
        
        return pms.pack( packName ).mod( modName )
    }
    
    pms.packs= function( pms ){
        return pms.file.childs()
        .filter( function( file ){
            return file.isDir() && /^[a-zA-Z]/.test( file.name() )
        } )
        .map( function( file ){
            return $jin_pack( file )
        } )
    }
    
} )

;//jin\pack\jin_pack.env=node.jam.js
this.$jin_pack=
$jin_class( function( $jin_pack, pack ){
    
    $jin_registry.scheme( $jin_pack, pack )
    $jin_wrapper.scheme( $jin_pack, pack )
    
    pack.file= null
    
    pack.toString= function( pack ){
        return String( pack.file )
    }
    
    pack.init= function( pack, path ){
        pack.file= $jin_file( path )
    }
    
    pack.pms= function( pack ){
        return $jin_pms( pack.file.parent() )
    }
    
    pack.mod= function( pack, name ){
        return $jin_mod( pack.file.child( name || pack.file.name() ) )
    }
    
    pack.mods= function( pack ){
        return pack.file.childs()
        .filter( function( file ){
            return file.isDir() && /^[a-zA-Z]/.test( file.name() )
        } )
        .map( function( file ){
            return $jin_mod( file )
        } )
    }
    
    pack.index= function( pack, vary ){
        if( !vary ) vary= {}
        var varyFilter= []
        for( var key in vary ){
            var val= vary[ key ]
            varyFilter.push( '\\.' + key + '=(?!' + val + '\\.)' )
        }
        varyFilter= RegExp( varyFilter.join( '|' ) || '^$' )
        
        var indexSrcs= []
        var indexMods= []
        
        pack.mods().forEach( function processMod( mod ){
            if( ~indexMods.indexOf( mod ) ) return
            indexMods.push( mod )
            
            var srcs= mod.srcs().filter( function( src ){
                return !varyFilter.test( src.file )
            } )
            
            srcs.forEach( function( src ){
                src.uses().forEach( processMod )
            } )
            
            indexSrcs= indexSrcs.concat( srcs )
        } )
        
        return indexSrcs
    }
    
    pack.build= function( pack, vary ){
        var filePrefix= vary2string( 'index', vary )
        
        var srcs= pack.index( vary )
        
        var srcsJS= srcs.filter( function( src ){
            return /\.js$/.test( src.file.name() )
        } )
        
        var indexJS= [ "\
void function( path ){                    \n\
    var fs= require( 'fs' )               \n\
    var source= fs.readFileSync( path )   \n\
    source= 'with(this){' + source + '}'  \n\
    module._compile( source, path )       \n\
    return arguments.callee               \n\
}                                         \n\
        "]
        
        indexJS= indexJS.concat( srcsJS.map( function( src ){
            return '("' + String( src ).replace( /\\/g, '\\\\' ) + '")'
        } ) )
        
        pack.file.child( '-mix' ).child( filePrefix + '.stage=dev.js' )
        .content( indexJS.join( '\n' ) )
        
        var contentsJS= srcsJS.map( function( src ){
            return ';//' + src + '\n' + src.file.content()
        } )
        
        pack.file.child( '-mix' ).child( filePrefix + '.stage=release.js' )
        .content( 'with(this){\n' + contentsJS.join( '\n' ) + '}' )
        
        return pack
    }
    
    pack.load= function( pack, vary ){
        if( !vary ) vary= {}
        vary.env= 'node'
        
        var path= String( pack.file.child( '-mix' ).child( vary2string( 'index', vary ) + '.js' ) )
        return require( $.path.resolve( path ) )
    }
    
    var vary2string= function( prefix, vary ){
        if( !vary ) vary= {}
        
        var chunks= []
        for( var key in vary ){
            chunks.push( key + '=' + vary[ key ] )
        }
        chunks.sort()
        chunks.unshift( prefix )
        
        return chunks.join( '.' )
    }
    
} )

;//jin\src\jin_src.env=node.jam.js
this.$jin_src=
$jin_class( function( $jin_src, src ){
    
    $jin_registry.scheme( $jin_src, src )
    $jin_wrapper.scheme( $jin_src, src )
    
    src.file= null
    
    src.toString= function( src ){
        return String( src.file )
    }
    
    src.init= function( src, path ){
        src.file= $jin_file( path )
    }
    
    src.mod= function( src ){
        return $jin_mod( src.file.parent() )
    }
    
    src._uses= null
    src.uses= function( src ){
        if( src._uses ) return src._uses
        var uses= [ src.mod(), src.mod().pack().mod() ]
        
        if( /\.jam\.js$/.test( src.file ) ){
            String( src.file.content() )
            .replace
            (   /\$([a-zA-Z0-9]+)_([a-zA-Z0-9]+)/g
            ,   function( str, packName, modName ){
                    var mod= src.mod().pack().pms().pack( packName ).mod( modName )
                    if( !~uses.indexOf( mod ) ) uses.push( mod )
                }
            )
        }
        
        if( /\.meta\.tree$/.test( src.file ) ){
            var meta= $.jin.tree.parse( src.file.content() )
            
            meta.select(' include / module / ').values().forEach( function( moduleName ){
                var mod= src.mod().pack().pms().mod( moduleName )
                if( !~uses.indexOf( mod ) ) uses.push( mod )
            } )
            
            meta.select(' include / package / ').values().forEach( function( packName ){
                src.mod().pack().pms().pack( packName ).mods()
                .forEach( function( mod ){
                    if( !~uses.indexOf( mod ) ) uses.push( mod )
                } )
            } )
        }
        
        return src._uses= uses
    }
    
} )

;//jin\mod\jin_mod.env=node.jam.js
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

;//jin\operator\jin_operator.js
this.$jin_operator=
new function( ){
    
    this.summ= function( a, b ){
        return a + b
    }
    
    this.sub= function( a, b ){
        return a - b
    }
    
    this.mult= function( a, b ){
        return a * b
    }
    
    this.div= function( a, b ){
        return a / b
    }
    
}
;//jin\path\jin_path.jam.js
this.$jin_path=
function( axis ){

    var cache= {}
    
    var tokens= Object.keys( axis )
    
    var lexer= RegExp( '([' + tokens + ']?)\s*([^' + tokens + '\\s]*)', 'g' )
    
    return function( path ){
        var result= cache[ path ]
        if( result ) return result
        
        var processors= []
        path.replace
        (   lexer
        ,   function( str, type, name ){
                if( !str ) return
                processors.push( axis[ type || '' ]( name ) )
            }
        )
        
        return cache[ path ]= function( value ){
            return processors.reduce( function( val, proc ){
                return proc( val )
            }, value )
        }
    }

}

;//jin\persistent\jin_persistent.env=node.jam.js
this.$jin_persistent=
function( body, options ){
    
    $jin_application( process.env[ '$jin_persistent:body' ] ? body : supervisor )
    
    function supervisor( $ ){
        var app= null
        var allowRestart= false
        
        function start( ){
            console.info( $['cli-color'].yellow( '$jin_persistent: Starting application...' ) )
            var env= Object.create( process.env )
            env[ '$jin_persistent:body' ]= true
            app= $.child_process.fork( process.mainModule.filename, [], { env: env } )
            
            allowRestart= false
            var isStopped= false
            
            app.on( 'exit', function( code ){
                if( code ) console.error( $['cli-color'].redBright( '$jin_persistent: Application halted (' + code + ')' ) )
                app= null
                if( allowRestart ) start()
            } )
            
            var sleepTimer= setTimeout( function( ){
                allowRestart= true
            }, 1000 )
        }
        
        function restart( ){
            allowRestart= true
            if( app ) app.kill()
            else start()
        }
        
        start()
        
        $.jin.sourceWatcher( function( event ){
            console.info( $['cli-color'].green( '$jin_persistent: Some files changed!' ) )
            restart()
        } )
        
    }
    
}

;//jin\tree\jin_tree.jam.js
this.$jin_tree=
$jin_class( function( $jin_tree, tree ){
    
    $jin_tree.parse= function( str, name ){
        content= []
        
        var stack= [ content ]
        var lines= String( str ).split( '\n' )
        
        for( var i= 0; i < lines.length; ++i ){
            var line= lines[ i ]
            var chunks= /^([ \t]*)([^=]*)(?:=(.*))?$/.exec( line )
            
            if( !chunks ) continue
            
            var indent= chunks[ 1 ]
            var key= chunks[ 2 ]
            var value= chunks[ 3 ]
            
            stack.splice( 0, stack.length - indent.length - 1 )
            
            var keys= key.split( /\s+/ )
            var s= stack[ 0 ]
            
            for( var j= 0; j < keys.length; ++j ){
                var key= keys[ j ]
                if( !key ) continue
                
                var t= new Tree( [], key )
                s.push( t )
                s= t.content
            }
            
            stack.unshift( s )
            
            if( value != null ) s.push( value )
        }
        
        return $jin_tree( content, name )
    }
    
    tree.name= null
    tree.content= null
    
    tree.init= function( tree, content, name ){
        if( content instanceof $jin_tree ) content= content.content
        
        tree.name= name
        tree.content= content
    }
    
    tree.lines= function( tree ){
        
        var lines= [ ]
        tree.forEach( function( value ){
            if( value instanceof $jin_tree ){
                lines= lines.concat( value.lines().content )
            } else {
                lines.push( '=' + value )
            }
        } )
        
        if( this.name ){
            if( this.content.length > 1 ){
                lines= lines.map( function( line ){
                    return '\t' + line
                })
                lines.unshift( this.name )
            } else {
                lines[ 0 ]= this.name + ' ' + lines[ 0 ]
            }
        }
        
        return $jin_tree( lines )
    }
    
    tree.select= function( tree, path ){
        return treePath( path )( tree )
    }
    
    tree.values= function( tree, values ){
        if( arguments.length > 1 ){
            var args= [ 0, tree.data.length ].concat( values )
            args.splice.apply( this.data, args )
            return tree
        }
        
        values= []
        
        this.forEach( function( val ){
            if( val instanceof $jin_tree ) return
            values.push( val )
        } )
        
        return values
    }
    
    tree.forEach= function( tree, proc ){
        tree.content.forEach( proc )
        return tree
    }
    
    tree.map= function( tree, proc ){
        return tree.content.map( proc )
    }
    
    tree.toString= function( tree ){
        return tree.values().join( '\n' )
    }
    
    tree.inspect= function( tree ){
        return String( tree.lines() )
    }
    
    var treePath= $jin_path( new function( ){
        
        this[ '' ]= function( name ){
            
            return function( tree ){
                var found= []
                tree.content.forEach( function( value ){
                    if(!( value instanceof $jin_tree )) return
                    if( value.name !== name ) return
                    
                    found.push( value )
                })
                return $jin_tree( found )
            }
            
        }
        
        this[ '/' ]= function( name ){
            
            if( !name ) return function( tree ){
                var result= []
                tree.content.forEach( function( value ){
                    if(!( value instanceof $jin_tree )) return
                    
                    result= result.concat( value.content )
                })
                return $jin_tree( result )
            }
            
            return function( tree ){
                var found= []
                tree.content.forEach( function( value ){
                    if(!( value instanceof $jin_tree )) return
                    
                    value.content.forEach( function( value ){
                        if(!( value instanceof $jin_tree )) return
                        if( value.name !== name ) return
                        
                        found.push( value )
                    })
                })
                return $jin_tree( found )
            }
            
        }
        
    } )

} )

;//jin\unwrap\jin_unwrap.jam.js
this.$jin_unwrap= function( obj ){
    return obj.$ || obj
}
}