# require spy
# require utils

# abstract landing page definition
window.landing-page = ({get-extra-event-args or (-> {})}) ->

    {debounce, dispatch-event} = window.utils
    {get-load-time-object} = window.spy    

    # object -> Void
    record = (event-object) !-> spy.record-event {} <<< get-extra-event-args! <<< event-object

    # string -> object -> Void
    record-event = (event-type, event-args) !-> record {event-type, event-args}

    {
        get-extra-event-args: -> {}
        populate: (how) ->

            record-event \populating, {}

            '''
            records the page-ready event with the load time information obtained from mobi-spy.get-load-time-object method: 
            {
                event-type: \pageReady
                event-args: {
                    load-time: n 
                    fetch-time: n
                    DOM-load-time: n
                    navigation-time: n
                    how: ""
                }
            }
            '''
            # object -> Void            
            get-load-time-object (load-time-object) !-> record-event \pageReady, {how: how or \load-event} <<< load-time-object
            
            is-boolean = -> typeof! it == \Boolean

            # find the name of the visibility change event (browser prefixed)
            visibility-change = 
                | is-boolean document.hidden => \visibilitychange
                | is-boolean document.moz-hidden => \mozvisibilitychange
                | is-boolean document.ms-hidden => \msvisibilitychange
                | is-boolean document.webkit-hidden => \webkitvisibilitychange
                | _ => undefined

            # listen for visibility change & record it
            document.add-event-listener visibility-change, -> record-event \visibility-change

            previous-inner-width = window.inner-width
            previous-inner-height = window.inner-height
            previous-outer-width = window.outer-width
            previous-outer-height = window.outer-height

            # listen for resize change & record it
            window.add-event-listener \resize, debounce do 
                ->                    
                    record-event \page-resize, 
                        delta-inner-width: window.inner-width - previous-inner-width
                        delta-inner-height: window.inner-height - previous-inner-height
                        delta-outer-width: window.outer-width - previous-outer-width
                        delta-outer-height: window.outer-height - previous-outer-height
                    # (WARNING: MUTATION)
                    previous-inner-width := window.inner-width
                    previous-inner-height := window.inner-height
                    previous-outer-width := window.outer-width
                    previous-outer-height := window.outer-height
                500

            # notify others that the page loaded successfully
            dispatch-event \x-mobi-one-load, {}

        record-event
    }