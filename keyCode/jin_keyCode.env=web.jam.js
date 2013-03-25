this.$jin_keyCode= { }

void function( ){

    $jin_keyCode.ctrlPause= 3
    
    $jin_keyCode.backSpace= 8
    $jin_keyCode.tab= 9
    
    $jin_keyCode.enter= 13
    
    $jin_keyCode.shift= 16
    $jin_keyCode.ctrl= 17
    $jin_keyCode.alt= 18
    $jin_keyCode.pause= 19
    $jin_keyCode.capsLock= 20
    
    $jin_keyCode.escape= 27
    
    $jin_keyCode.space= 32
    $jin_keyCode.pageUp= 33
    $jin_keyCode.pageDown= 34
    $jin_keyCode.end= 35
    $jin_keyCode.home= 36
    $jin_keyCode.left= 37
    $jin_keyCode.up= 38
    $jin_keyCode.right= 39
    $jin_keyCode.down= 40
    
    $jin_keyCode.insert= 45
    $jin_keyCode.delete= 46
        
    for( var code= 48; code <= 57; ++code ){
        $jin_keyCode[ String.fromCharCode( code ).toLowerCase() ]= code
    }

    for( var code= 65; code <= 90; ++code ){
        $jin_keyCode[ String.fromCharCode( code ).toLowerCase() ]= code
    }

    $jin_keyCode.win= 91
    
    $jin_keyCode.context= 93

    for( var numb= 1; numb <= 12; ++numb ){
        $jin_keyCode[ 'f' + numb ]= 111 + numb
    }
    
    $jin_keyCode.numLock= 144
    $jin_keyCode.scrollLock= 145
    
    $jin_keyCode.semicolon= 186
    $jin_keyCode.plus= 187
    $jin_keyCode.minus= 189
    $jin_keyCode.comma= 188
    $jin_keyCode.period= 190
    $jin_keyCode.slash= 191
    $jin_keyCode.tilde= 192
    
    $jin_keyCode.openBracket= 219
    $jin_keyCode.backSlash= 220
    $jin_keyCode.closeBracket= 221
    $jin_keyCode.apostrophe= 222
    $jin_keyCode.backSlashLeft= 226
    
}( )