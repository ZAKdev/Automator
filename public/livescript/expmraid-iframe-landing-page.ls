# require mraid-landing-page
# require iframe-landing-page

window.expmraid-iframe-landing-page = (parameters)->

    parse-bool = -> return it == \true

    lazy-load = 
        | (typeof parameters.query-params?.lazy-load) == \string => parse-bool parameters.query-params.lazy-load 
        | (typeof parameters.lazy-load) == \string => parse-bool parameters.lazy-load
        | _ => true

    {get-extra-event-args}:mraid-expandable-landing-page = window.mraid-expandable-landing-page parameters
    {populate, record-event, mount-page} = window.html5-iframe-landing-page {} <<< parameters <<< {get-extra-event-args}

    {
        get-ready: (callback) -> 
            <- mraid-expandable-landing-page.get-ready do 
                {
                    record-event
                    state-change-listener: parameters?.on-mraid-state-change                         
                    expand-click-listener: -> mount-page! if lazy-load
                }
            populate ...
            mount-page! if !lazy-load
            callback ... if !!callback
        record-event
    }