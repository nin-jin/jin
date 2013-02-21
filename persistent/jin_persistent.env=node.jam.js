this.$jin_persistent=
function( body, options ){
    
    $jin_application( process.env[ '$jin_persistent:body' ] ? body : supervisor )
    
    function supervisor( ){
        var app= null
        var allowRestart= false
        
        function start( ){
            console.info( $node['cli-color'].yellow( '$jin_persistent: Starting application...' ) )
            var env= Object.create( process.env )
            env[ '$jin_persistent:body' ]= true
            app= $node.child_process.fork( process.mainModule.filename, [], { env: env } )
            
            allowRestart= false
            var isStopped= false
            
            app.on( 'exit', function( code ){
                if( code ) console.error( $node['cli-color'].redBright( '$jin_persistent: Application halted (' + code + ')' ) )
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
        
        $jin_sourceWatcher( function( event ){
            console.info( $node['cli-color'].green( '$jin_persistent: Some files changed!' ) )
            restart()
        } )
        
    }
    
}
