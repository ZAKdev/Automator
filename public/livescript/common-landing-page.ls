# require prelude
# require utils
# require url-parser
# require landing-page
# require jsonp-api (defined in mobi-wap-api)
# require spy
window.common-landing-page = (
    {       
        server-redirection or 0
        creative
        suffix
        domain
        protocol or \http
        double-confirmation or (-> false)
        campaign-id or window?.mobiOneConstants?.campaignId
        get-extra-event-args or (-> {})
        sub-method-detection-failure-fallback-url
        non-direct-wap-fallback-url
        unsupported-sub-method-fallback-url
        supported-sub-methods
        language
        on-will-transition or (-> true)
        on-subscribe-click or (-> true)
        on-submit-number or (-> true)
        sub-method-request-timeout or 5000
        page-id
        path
        query-params or {}
        subscriptionUrlHook or ((url) -> url)
        validate-pin or (-> true)
        map-iframe-confirmation-url or ((url) -> url)
    }:props
)-> 
    
    navigate-to-url = do ->
        urls = {}
        (url) ->
            _navigate-to-url = ->
                if props.navigate-to-url
                    props.navigate-to-url url
                else
                    set-timeout (-> window.location.href = url), 100
            if url
                if urls[url]
                    console.log "navigating to #{url} already"
                else
                    urls[url] = 1
                    _navigate-to-url url
            else
                console.log "navigate-to-url url cannot be empty"
    
    query-params = {} <<< (window?.mobiOneConstants?.queryParams or {}) <<< query-params

    if typeof! double-confirmation == \Boolean
        double-confirmation = -> true

    {any, camelize, each, filter, find, map, pairs-to-obj, unique} = window.prelude
    {add-click-listener, cancel-event, dispatch-event, focus-on-input-field, debounce, untechify-language} = window.utils
    {parse-query} = window.url-parser
    {get-service-url, get-sub-method, poll-subscription-status, submit-number, submit-pin, type:jsonp-api-type}:api-instance =  window.jsonp-api {creative, suffix}

    # TechLanguage -> ISOCode
    language-iso-code = untechify-language language

    elements = 
        * id: \already-subscribed-error
        * id: \confirm
          required: -> false
        * id: \congrats
        * id: \container
        * id: \default-state
        * id: \error
          required: -> false
        * id: \double-confirmation
          required: -> false
        * id: \double-confirmation-no
          required: -> false
        * id: \iframe-state
          required: -> false
        * id: \iframe-confirmation
          required: -> false
        * id: \subscription-error
          required: -> false
        * id: \subscription-error-message
          required: -> false  
        * id: \subscription-polling
          required: -> false
        * id: \invalid-number-error
        * id: \invalid-pin-error
        * id: \operator-selection
          required: -> false
        * id: \keyword
        * id: \mo
        * id: \number
        * id: \number-entry
        * id: \pin
        * id: \pin-entry
        * id: \service-unavailable-error
          required: -> false
        * id: \short-code
        * id: \submit-number
        * id: \submit-pin
        * id: \sub-method-detection-request-preloader
          required: -> false

    $$ = elements
        |> map ({id, required})->
            element = document.get-element-by-id id
            return [(camelize id), element] if !!element
            is-required = if !!required then required! else true
            throw "#{id} not found" if is-required
        |> filter -> !!it
        |> pairs-to-obj

    # equivalent to get-initial-state in react
    state = {
        container-id: \default-state
        name: \start-state
        number: $$.number.value
        pin: $$.pin.value
    }

    # copy the initial state for future use
    initial-state = {} <<< state

    {populate, record-event}:landing-page = window.landing-page {
        get-extra-event-args: -> 
            {visit-id, selected-sub-method, sub-method-names, operator-id, name}? = state
            {} <<< {
                campaign-id: parse-int campaign-id
                creative
                domain
                double-confirmation
                page-id: parse-int page-id
                page-language: language        
                path                
                suffix
            } <<<  get-extra-event-args! <<< {
                state: name
                visit-id
                sub-method: selected-sub-method
                sub-method-names
                operator-id
            }
    }

    render = !->

        {
            container-id
            err
            error
            keyword
            name
            next-url
            number
            number-entry-error
            pin
            pin-entry-error
            short-code
            subscription-error-message
            iframe-confirmation-url
        }? = state

        return console.error err if !!err

        if !!(<[direct-wap-subscription-url external-page-url service-page single-click-subscription-url]> |> find (== name))
            dispatch-event \x-mobi-one-subscription, {}
            return navigate-to-url next-url 

        # show the current state container and hide the rest
        containers = <[error congrats default-state double-confirmation subscription-polling mo number-entry operator-selection pin-entry subscription-error iframe-state]>
        if !!(containers |> find (== container-id))
            new-class ="show-#{container-id}"
            $$.container.class-name = if ($$.container.class-name.index-of \show-) == -1 then "#{$$.container.class-name} #{new-class}" else ($$.container.class-name.replace /show-[a-z\-]*/g, new-class)
            containers
                |> map -> [it, $$[camelize it]]        
                |> each ([id, element])-> element?.style?.display = if id == container-id then "" else \none

        if !!$$.error
            $$.error.innerHTML = error

        # mo
        $$.keyword.innerHTML = keyword
        $$.short-code.innerHTML = short-code

        # number-entry
        $$.number.value = number
        $$.number-entry.class-name = number-entry-error
        $$.already-subscribed-error.style.display = if number-entry-error == \already-subscribed-error then "" else \none
        $$.invalid-number-error.style.display = if number-entry-error == \invalid-number-error then "" else \none

        if $$.iframe-confirmation and iframe-confirmation-url
            $$.iframe-confirmation.set-attribute \src, (map-iframe-confirmation-url iframe-confirmation-url)

        if !!$$.service-unavailable-error
            $$.service-unavailable-error.style.display = if number-entry-error == \service-unavailable-error then "" else \none

        # pin entry
        $$.pin.value = pin
        $$.pin-entry.className = pin-entry-error

        if !!pin-entry-error
            $$.invalid-pin-error.style.display = ""
            if state?.pin-entry-error-message
                $$.invalid-pin-error.innerHTML = state.pin-entry-error-message

        else
            $$.invalid-pin-error.style.display = "none"

        $$.invalid-pin-error.style.display = if !!pin-entry-error then "" else \none

        if !!$$?.sub-method-detection-request-preloader
            $$.sub-method-detection-request-preloader.style.display = if state.waiting-for-sub-method-details then "" else "none"

        if !!$$?.subscription-error-message and !!subscription-error-message
            $$.subscription-error-message.innerHTML = subscription-error-message

        match name
            | \number-entry => focus-on-input-field $$.number
            | \pin-entry => focus-on-input-field $$.pin

        if !!props.render
            props.render state

    set-state = (parameters, trigger = {}, transition-event-args = {}) !->

        event-args =
            detail: {
                from-state: state.name
                to-state: parameters.name
                trigger
            }
        dispatch-event \x-mobi-one-before-transition, event-args

        return if !on-will-transition state, {} <<< state <<< parameters

        if !!state?.name and !!parameters?.name and state.name != parameters.name
            record-event \transition, {from-state: state.name, to-state: parameters.name, trigger}  <<< transition-event-args
            dispatch-event \x-mobi-one-transition, event-args

        state <<< parameters
        render!

        dispatch-event \x-mobi-one-set-state, event-args

    $$.number.add-event-listener \change, (e)-> set-state {number: e.current-target.value}

    $$.pin.add-event-listener \change, (e)-> set-state {pin: e.current-target.value}

    subscribe = (trigger, data-operator-id, element) !->
        if !state?.selected-sub-method
            if sub-method-detection-failure-fallback-url and !state.wait-for-sub-method-details
                set-state do
                    waiting-for-sub-method-details: set-timeout do 
                        -> set-state do 
                            name: \external-page-url
                            next-url: sub-method-detection-failure-fallback-url
                        sub-method-request-timeout
            return

        {keyword, method, next-url, operator-id, short-code}:sub-method? = state.sub-method-list 
            |> find ({operator-id}?)-> 
                state.sub-method-list.length == 1 or operator-id == data-operator-id

        if !sub-method
            return
        
        subscription-url = match jsonp-api-type
            | \mobi-wap => 
                q = parse-query "http://#{domain}#{next-url}" 
                    .REMOVE \jsonp 
                    .SET \LangID, language 
                    .SET \skiphost, \1
                q.to-string!
            | \mobi-one =>
                q = parse-query next-url .SET \language, language-iso-code
                q.to-string!

        subscription-url := subscriptionUrlHook subscription-url, element

        set-state-helper = ({name, next-url}:new-state) ->
            set-state do 
                {} <<< new-state <<< {container-id: name, operator-id, selected-sub-method: method}
                {} <<< trigger
                if name == \direct-wap-subscription-url || name == \single-click-subscription-url then {redirect-url: next-url} else {}        

        switch method
            | \DirectMSISDN =>
                has-double-confirmation = double-confirmation operator-id
                match jsonp-api-type
                | \mobi-wap => 
                    set-state-helper do
                        name: if has-double-confirmation then \double-confirmation else \direct-wap-subscription-url
                        next-url: subscription-url
                | \mobi-one =>
                    if has-double-confirmation 
                        set-state-helper {name: \double-confirmation, next-url: subscription-url} 
                    else 
                        show-subscription-preloader subscription-url, trigger
            | \DirectWAP =>
                has-double-confirmation = double-confirmation operator-id
                match jsonp-api-type
                | \mobi-wap => 
                    set-state-helper do
                        name: if has-double-confirmation then \double-confirmation else \direct-wap-subscription-url
                        next-url: subscription-url
                | \mobi-one =>
                    if has-double-confirmation 
                        set-state-helper {name: \double-confirmation, next-url: subscription-url} 
                    else 
                        show-subscription-preloader subscription-url, trigger
            | \LinkClick, \ExternalPageUrl, \ExternalLink, \RedirectOnClick =>
                set-state-helper do
                    name: \external-page-url
                    next-url: if (next-url.index-of \http) == 0 then next-url else "http://#{domain}#{if (next-url.index-of '/') == 0 then '' else '/'}#{next-url}"
            | \WAPPIN => 
                set-state-helper do
                    name: \number-entry
                    number: initial-state.number
                    number-entry-error: null
                    number-submission-url: 
                        | state.sub-method-list.length == 1 => subscription-url
                        | _ => parse-query subscription-url .SET \reqType, \MSISDNSubmission .SET \oc, operator-id .to-string!
            | \MO => set-state-helper {name: \mo, keyword, short-code}
            | \JavaApp => set-state-helper {name: \single-click-subscription-url, next-url: subscription-url}
            | _ => set-state-helper {name: \single-click-subscription-url, next-url}

    (document.get-elements-by-class-name \subscribe) |> map (element)->
        e, trigger <- add-click-listener element
        return if !on-subscribe-click e, trigger
        subscribe do 
            trigger
            (parse-int e.current-target.get-attribute \data-operator-id) if state.name != \start-state
            element
        set-state {auto-subscribe: true, auto-subscription-trigger: trigger}

    show-subscription-preloader = (next-url, trigger) ->
        set-state {name: \subscription-polling, container-id: \subscription-polling}, trigger
        subscription-error-message, [subscriber-id, next-url]? <- poll-subscription-status domain, next-url
        return set-state {container-id: \subscription-error, name: \subscription-error, subscription-error-message} if !!subscription-error-message
        set-state {subscriber-id}
        set-state {name: \congrats, container-id: \congrats, subscriber-id}
        set-state {name: \service-page, next-url}, {how: \polling-completed}, {}

    if !!$$.confirm
        add-click-listener $$.confirm, (e, trigger) -> 
            match jsonp-api-type
            | \mobi-wap => set-state {name: \direct-wap-subscription-url}, trigger, {redirect-url: state.next-url}
            | \mobi-one => show-subscription-preloader state.next-url, trigger
            | _ => throw "Unexpected jsonp-api-type: #{jsonp-api-type}"

    if !!$$.double-confirmation-no
        add-click-listener $$.double-confirmation-no, (e, trigger)-> set-state {name: \default-state, container-id: \default-state}, trigger

    add-click-listener $$.submit-number, (e, trigger)->
        return if !on-submit-number e, trigger
        number = $$.number.value

        # the language can be changed any time from the page by making a call to page.change-language 
        # therefore we update the url to ensure that the user gets subscribed with the correct language
        number-submission-url = match jsonp-api-type
            | \mobi-wap => parse-query state.number-submission-url .SET \LangID, language .to-string!
            | \mobi-one => parse-query state.number-submission-url .SET \language, language-iso-code .to-string!

        err, {status, keyword, short-code, next-url} <- submit-number domain, number-submission-url, number
        trigger <<< {number}
        match status
            | \MO =>  set-state {name: \mo, container-id: \mo, keyword, short-code}, trigger
            | \AlreadySub =>
                record-event \already-subscribed, {number}
                set-state {number-entry-error: \already-subscribed-error}, trigger
                [subscriber-id, service-url] <- get-service-url domain, next-url
                set-state {name: \service-page, next-url: service-url, subscriber-id}
            | \InvalidNumber =>
                record-event \invalid-number, {number}
                set-state do 
                    {
                        number-entry-error: \invalid-number-error
                    } <<< if jsonp-api-type == \mobi-one then {number-submission-url: next-url} else {}
                    trigger
            | \ServiceUnAvailable =>
                record-event \service-unavailable, {number}
                set-state {number-entry-error: \service-unavailable-error}, trigger
            | \None =>
                set-state do 
                    {
                        name: \pin-entry
                        container-id: \pin-entry
                        pin: ""
                        pin-entry-error: null
                        pin-submission-url: next-url
                    }
                    trigger
            | _ => 
                record-event \unexpected-condition, {request: \number-submission}
                console.error "We don't know what to do here?"

    add-click-listener $$.submit-pin, (e, trigger) ->
        pin = $$.pin.value

        if (validate-pin pin)

            # the language can be changed any time from the page by making a call to page.change-language 
            # therefore we update the url to ensure that the user gets subscribed with the correct language
            pin-submission-url = match jsonp-api-type
                | \mobi-wap => parse-query state.pin-submission-url .SET \LangID, language .to-string!
                | \mobi-one => parse-query state.pin-submission-url .SET \language, language-iso-code .to-string!

            err, {status, keyword, short-code, next-url, pin-entry-error-message}? <- submit-pin domain, pin-submission-url, pin
            trigger <<< {pin}
            match status
                | \MO =>  set-state {name: \mo, container-id: \mo, keyword, short-code}, trigger
                | \ValidPIN => 
                    set-state {name: \congrats, container-id: \congrats}, trigger
                    err, [subscriber-id, next-url]? <- poll-subscription-status domain, next-url
                    set-state {subscriber-id}
                    set-state {name: \service-page, next-url}, {action: \polling-complete}, {redirect-url: next-url}
                | \InvalidPIN =>
                    record-event \invalid-pin, {pin}
                    set-state do
                        {
                            pin: ""
                            pin-entry-error: \invalid-pin-error
                            pin-entry-error-message
                        } <<< if jsonp-api-type == \mobi-one then {pin-submission-url: next-url} else {}
                        trigger
                | \DisplayIframe =>
                    record-event \display-iframe, {}
                    set-state do 
                        {name: \iframe-state, container-id: \iframe-state, next-url}
                        trigger
                | _ =>
                    record-event \unexpected-condition, {request: \pin-submission}
                    console.error "We don't know what to do here?"
                    set-state do 
                        {
                            name: \number-entry
                            container-id: \number-entry
                            number: initial-state.number
                            number-entry-error: null
                        }
                        trigger

        else
            set-state do 
                pin-entry-error: true, pin-entry-error-message: "invalid pin"

    # react equivalent of mount-component
    mount-page = ->

        t0 = Date.now!

        # not pattern matching language as it is already available in closure from above
        [platform, country, operator, , postfix ]:suffix-components = suffix.split \- 

        # make the request to get all the sub-method details & whether or not the user is already subscribed
        error, sub-method-response <- get-sub-method do
            {
                server-redirection
                protocol
                domain
                path
                campaign-id
                page-id
                language: if jsonp-api-type == \mobi-one then suffix-components.3 else language
                query-params
                creative
                platform
                country
                operator
                postfix 
            }

        # hide preloader (if any)
        if state.waiting-for-sub-method-details
            clear-timeout state.waiting-for-sub-method-details
            set-state waiting-for-sub-method-details: undefined

        # add the original response from the mobi-one-api for customizing the page
        set-state original-response: {} <<< (sub-method-response?.original-response ? {})

        # when state=try-subscribe is passed in the query-string to the api call then the response.state
        # is set to congrats (if  the user subscribed successfully), in this case we must poll the next-url
        # for the service page url & redirect the user there
        if sub-method-response?.state == \congrats and !!sub-method-response?.next-url
            return show-subscription-preloader sub-method-response?.next-url, {}

        # for google RTB we only support DirectWAP, onlyDirectWAP parameter must be a valid URL
        sub-method-list = (
            if query-params.only-direct-WAP
                sub-method-response.sub-method-list |> map ({method}:item) -> match method
                    | "DirectWAP" => item
                    | "DirectMSISDN" => item
                    | _ => method: \ExternalPageUrl, next-url: query-params.only-direct-WAP

            else
                sub-method-response?.sub-method-list ? []
        )

        # add visit-id to the state immediately for as the following code will invoke record-event method
        # which reads the visit-id from state for associating it with the corresponding events
        set-state visit-id: sub-method-response?.visit-id

        redirect-on-click = (url) ->
            {
                name: \default-state
                container-id: \default-state
                next-url: url
                sub-method-list:
                    *   method: \RedirectOnClick
                        next-url: url
                    ...
            }

        # this method is used in the preceding if - else
        # :: State -> ()
        process-new-state = (new-state) !->

            {operator-id, selected-sub-method, sub-method-names, next-url} = new-state

            # record the get-sub-method event before transitioning to the next state
            set-state {operator-id, selected-sub-method, sub-method-names}
            record-event \get-sub-method, {time-taken: Date.now! - t0}

            # transition to the next computed state
            set-state new-state, {action: \auto}, {redirect-url: next-url}

            # if the user clicked subscribe before getting the sub-method details,
            # then trigger the click on the subscribe button
            if state.auto-subscribe and state.name == \default-state
                subscribe state.auto-subscription-trigger

        if !!error
            record-event do 
                \get-sub-method-error
                error: error 
                time-taken: Date.now! - t0

            # similar to RedirectOnClick
            if sub-method-detection-failure-fallback-url
                process-new-state do
                    {
                        operator-id: null
                        selected-sub-method: \-
                        name: \default-state
                        container-id: \default-state
                        next-url: sub-method-detection-failure-fallback-url
                        sub-method-list: [{next-url: sub-method-detection-failure-fallback-url}]
                    }

            else
                set-state do 
                    container-id: \error
                    name: \error
                    error: error
        else

            process-new-state (

                if sub-method-response.status == \AlreadySub
                    {
                        name: \service-page
                        next-url: sub-method-response.redirect-url
                        selected-sub-method: \AlreadySubscribed
                    }

                else if sub-method-list.length > 1
                    sub-method-names = sub-method-list 
                        |> map ({method}?)-> method
                        |> unique
                    {
                        name: \operator-selection
                        container-id: \operator-selection
                        sub-method-list
                        selected-sub-method: if sub-method-names.length == 1 then sub-method-names.0 else \-
                    } <<< (if sub-method-names.length > 1 then {sub-method-names} else {})

                else
                    {operator-id, method, next-url, keyword, short-code}? = sub-method-list.0

                    {operator-id, selected-sub-method: method} <<< (

                        if non-direct-wap-fallback-url and !(method in <[DirectMSISDN DirectWAP]>)
                            redirect-on-click non-direct-wap-fallback-url

                        else if supported-sub-methods and unsupported-sub-method-fallback-url and !(method in supported-sub-methods)
                            redirect-on-click unsupported-sub-method-fallback-url

                        else
                            if method == \WAPPIN
                                {
                                    name: \number-entry
                                    container-id: \number-entry
                                    number-submission-url: next-url
                                    sub-method-list
                                } <<< (
                                    if !!sub-method-response.msisdn and !!props.fill-number-entry-with-msisdn
                                        number: sub-method-response.msisdn
                                    else 
                                        {}
                                )

                            # automatically redirect the user to next-url
                            if method == \LinkClick
                                {
                                    name: \external-page-url
                                    container-id: \default-state
                                    next-url
                                }

                            else if method == \RedirectOnClick
                                {
                                    name: \default-state
                                    container-id: \default-state
                                    next-url
                                    sub-method-list: [{next-url}]
                                }

                            else if method == \Iframe
                                {
                                    name: \iframe-state
                                    container-id: \iframe-state
                                    iframe-confirmation-url: next-url
                                }

                            else
                                name = if method == \MO then \mo else \default-state
                                {
                                    name: name
                                    container-id: name
                                    sub-method-list
                                    keyword
                                    short-code
                                }
                    )
            )

    populate = (how) ->
        landing-page.populate how
        start-recording-tap -> {} <<< get-extra-event-args! <<< {creative, suffix, campaign-id, state: state.name}

    {

        get-ready: (callback) ->
            <- window.add-event-listener \load
            populate!
            mount-page!
            callback! if !!callback
            
        get-ready-without-mount: (callback) ->
            <- window.add-event-listener \load
            populate!
            callback! if !!callback
        get-state: -> {} <<< state
        mount-page
        populate
        props
        record-event
        set-state
        switch-state: (state, parameters)-> set-state {name: state, container-id: state} <<< parameters, action: \switch-state-function
        change-language: (iso-code) ->
            language-iso-code := iso-code
            language := window.utils.untechify-language iso-code

        api-instance

    }
