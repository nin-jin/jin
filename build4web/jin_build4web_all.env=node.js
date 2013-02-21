this.$jin_build4web_all= function( pack ){
    pack= $jin_pack( pack )
    
    $jin_build4web_js_dev( pack )
    $jin_build4web_css_dev( pack )
    $jin_build4web_xsl_dev( pack )
    $jin_build4web_doc_dev( pack )
    
    $jin_build4web_js_release( pack )
    $jin_build4web_css_release( pack )
    $jin_build4web_xsl_release( pack )
    $jin_build4web_doc_release( pack )
}