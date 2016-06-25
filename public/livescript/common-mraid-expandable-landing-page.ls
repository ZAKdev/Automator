
# require common-mraid-landing-page

window.common-mraid-expandable-landing-page = ({language}:parameters) ->
    
    
    parse-bool = -> return it == \true

    lazy-load = 
        | (typeof parameters.query-params?.lazy-load) == \string => parse-bool parameters.query-params.lazy-load 
        | (typeof parameters.lazy-load) == \string => parse-bool parameters.lazy-load
        | _ => true

    {get-extra-event-args, navigate-to-url, change-language}:mlp = window.mraid-expandable-landing-page parameters
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
        window.common-landing-page {} <<< parameters <<< {language, get-extra-event-args, navigate-to-url}

    {
        get-ready: (callback) -> 
            <- mlp.get-ready do 
                {
                    record-event
                    state-change-listener: parameters?.on-mraid-state-change                         
                    expand-click-listener: -> mount-page! if lazy-load
                }
            populate ...
            mount-page! if !lazy-load
            callback ... if !!callback
        get-state
        record-event
        set-state
        switch-state
        change-language: (iso-code) ->
            # LangID query string parameter in MobiWAP pages is not the standard ISO Code
            # mapping for ISO codes to LangID are defined in utils.ls
            change-language iso-code
            clp.change-language iso-code
            # language := window.utils.techify-language iso-code
    }


