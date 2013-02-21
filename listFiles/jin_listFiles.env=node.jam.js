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

    var getStat= $node.fs.statSync
    var getChilds= $node.fs.readdirSync
    
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
