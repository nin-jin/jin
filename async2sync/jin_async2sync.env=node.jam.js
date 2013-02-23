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
                        var fibers= $node.fibers
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
