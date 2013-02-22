this.$jin_build4web_all= function( pack ){
    pack= $jin_pack( pack )
    
    var res= { dev: {}, release: {} }
    
    res.dev.js= $jin_build4web_js_dev( pack )
    res.dev.css= $jin_build4web_css_dev( pack )
    res.dev.xsl= $jin_build4web_xsl_dev( pack )
    res.dev.doc= $jin_build4web_doc_dev( pack )
    
    res.release.js= $jin_build4web_js_release( pack )
    res.release.css= $jin_build4web_css_release( pack )
    res.release.xsl= $jin_build4web_xsl_release( pack )
    res.release.doc= $jin_build4web_doc_release( pack )
    
    return res
}