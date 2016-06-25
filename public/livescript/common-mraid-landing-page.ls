# require mraid-landing-page
# require common-landing-page

window.common-mraid-landing-page = ({language}:parameters)->    
    
    {change-language, navigate-to-url, get-extra-event-args}:mraid-landing-page = window.mraid-landing-page!
    {techify-language} = window.utils

    # this call to change-language simply updates the css-class of the element with id "container" by
    # suffixing it with 2 letter iso code and since the DOM is accessible when this function is invoked 
    # we don't need to call it at load time
    if language.length == 2
        change-language language
    
    # the common-landing-page expects the language to be "techified" instead of standard 2 letter iso code
    # since the mobi-wap-api designed by tech team works with a LangID property that is different from the 
    # standard 2 letter iso language code
    language := techify-language language
    
    {mount-page, populate, record-event, get-state, set-state, switch-state}:clp = 
        window.common-landing-page {} <<< parameters <<< {get-extra-event-args, navigate-to-url}    

    {
        get-ready: (callback) -> 
            <- mraid-landing-page.get-ready do 
                {
                    record-event
                    state-change-listener: parameters?.on-mraid-state-change
                }
            populate ...
            mount-page!
            callback ... if !!callback

        get-ready-without-mount: (callback) ->
            <- mraid-landing-page.get-ready do 
                {
                    record-event
                    state-change-listener: parameters?.on-mraid-state-change
                }
            populate ...
            callback ... if !!callback
        mount-page
        record-event
        get-state
        set-state
        switch-state
        change-language: (iso-code) ->
            # LangID query string parameter in MobiWAP pages is not the standard ISO Code
            # mapping for ISO codes to LangID are defined in utils.ls
            change-language iso-code
            clp.change-language iso-code
            # language := window.utils.techify-language iso-code
    }