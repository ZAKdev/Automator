# require mobi-one-constants

mobi-spy = ({common-event-properties or {}, url or \http://mone-analytics.mobileacademy.com/}:parameters) ->

    load-start = Date.now!

    cookies-enabled = ->
        if !!navigator?.cookie-enabled
            navigator.cookie-enabled
        else
            try
                document.cookie = \test-cookie
                document.cookie.index-of \test-cookie != -1
            catch err
                false

    get-load-time-object = (callback)->
        load-time-object = 
            load-time: Date.now! - load-start

        set-timeout do 
            ->
                try
                    if !!window?.performance and !!window.performance?.timing
                        {
                            fetch-end
                            fetch-start
                            load-event-end
                            navigation-end
                            navigation-start
                            response-end
                        } = window.performance.timing
                        
                        callback {} <<< load-time-object <<< {
                            DOM-load-time: load-event-end - response-end
                            fetch-time: response-end - fetch-start
                            load-time: load-event-end - navigation-start
                            navigation-time: fetch-start - navigation-start
                        }
                    
                    else 
                        callback load-time-object
                catch err
                    window.record-error err, \get-load-time-object-error
            100

    get-page-visibility-status = ->
        hidden-property = 
            | !!document.hidden => \hidden
            | !!document.moz-hidden => \mozHidden
            | !!document.ms-hidden => \msHidden
            | !!document.webkit-hidden => \webkitHidden
            | _ => undefined

        if !!hidden-property
            return {
                hidden-property
                hidden: document[hidden-property]
            }

        {
            hidden-property: null
            hidden: null
        }    

    {
        get-load-time-object
        record-event: do -> 
            previous-event-time = undefined
            (event-object) ->
                current-date = new Date!
                current-time = current-date.get-time!

                final-event-object = {
                    client-side-referrer: document.referrer
                    client-side-creation-date: current-date
                    client-side-creation-time: current-time
                    cookies-enabled: cookies-enabled!
                    point-of-generation: \web-page
                    time-since-last-event: current-time - (previous-event-time or current-time)
                    time-since-page-load: current-time - load-start
                    url: window.location.href
                    inner-width: window.inner-width
                    inner-height: window.inner-height
                    outer-width: window.outer-width
                    outer-height: window.outer-height
                    screen-width: screen.width
                    screen-height: screen.height
                } <<< get-page-visibility-status! <<< common-event-properties <<< event-object

                try
                    final-event-object <<< 
                        in-iframe: top.location.href != window.location.href
                        top-url: top.location.href
                catch exception
                    console?.error exception

                return if (final-event-object?.event-args?.trigger?.action or '') in <[auto customization]>
                try 
                    xhr = new XMLHttpRequest!
                    xhr.open \POST, url
                    xhr.set-request-header \Content-Type, 'text/plain'
                    xhr.send JSON.stringify(finalEventObject)
                catch exception
                    console?.error exception

                # WARNING (MUTATION)
                previous-event-time := current-time
    }

{q42, user-id, session-id, client-session-id, impressions, query-tokens, spy-server, ab}? = window.mobi-one-constants 
common-event-properties = {ab, q42, user-id, session-id, client-session-id, impressions, query-tokens}   

window.spy = mobi-spy {common-event-properties, url: spy-server}

supports-touch = false

window <<< do ->
    tap-spy = mobi-spy {common-event-properties, url: "#{spy-server}recordTap"}
    {each, map} = window.prelude
    {
        # adds a mousedown listener to the document for recording taps
        # returns a function that when invoked removes the mousedown listener from the document
        # start-recording-tap :: Extras -> (a -> IO())        
        start-recording-tap: (get-extras) ->

            # :: String -> Element -> Number -> Number -> ()
            record-touch-event = (type, target, x, y) !->
                window.spy.record-event {} <<< get-extras! <<<
                    event-type: \mousedown
                    event-args:
                        supports-touch: supports-touch
                        type: type
                        element:
                            id: target.id
                            class: target.class-name
                            client-rect: target.get-bounding-client-rect!
                            tag: target.tag-name
                        x: x
                        y: y

            # MUTATION
            # :: Event -> ()
            touch-listener = (e) !->
                supports-touch := true
                {page-x, page-y}? = e?.touches?.0
                record-touch-event \touchstart, e?.target, page-x, page-y

            # :: Event -> ()
            mouse-listener = (e) !->
                {target, page-x, page-y}? = e
                record-touch-event \mousedown, target, page-x, page-y

            document.add-event-listener \touchstart, touch-listener
            document.add-event-listener \mousedown, mouse-listener

            -> 
                document.remove-event-listener \touchstart, touch-listener
                document.remove-event-listener \mousedown, mouse-listener
    }


