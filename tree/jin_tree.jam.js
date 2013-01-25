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
