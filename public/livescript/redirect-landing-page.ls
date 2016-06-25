# require prelude
# require utils
# require url-parser
# require landing-page
# require jsonp-api (defined in mobi-wap-api)
# require spy

window.redirect-landing-page = (
    {
        creative
        suffix
        domain
        double-confirmation or (-> false)
        campaign-id or window?.mobiOneConstants?.campaignId
        get-extra-event-args or (-> {})
        language
        navigate-to-url or (-> window.location.href = it)
        on-will-transition or (-> true)
        page-id
        path
        query-params or {}
    }:props
)-> 

    query-params = {} <<< (window?.mobi-one-constants?.query-params or {}) <<< query-params

    if typeof! double-confirmation == \Boolean
        double-confirmation = -> true

    {camelize, filter, find, each, map, pairs-to-obj} = window.prelude
    {add-click-listener, dispatch-event} = window.utils
    {parse-query} = window.url-parser
    {get-sub-method} =  window.jsonp-api {creative, suffix}

    elements = 
        * id: \container
        * id: \default-state

    $$ = elements
        |> map ({id, required})->
            element = document.get-element-by-id id
            return [(camelize id), element] if !!element
            is-required = if !!required then required! else true
            throw "#{id} not found" if is-required
        |> filter -> !!it
        |> pairs-to-obj

    state = {
        container-id: \default-state
        name: \start-state
    }

    initial-state = {} <<< state

    {record-event}:landing-page = window.landing-page {
        get-extra-event-args: -> 
            {visit-id, selected-sub-method, operator-id, name}? = state
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
                operator-id
            }
    }

    render = !->

        {
            container-id
            err
            name
            next-url
        }? = state

        return console.error err if !!err
        
        if !!(<[external-page-url]> |> find (== name))
            dispatch-event \x-mobi-one-subscription, {}
            return navigate-to-url next-url 

        # show the current state container and hide the rest
        containers = <[default-state]>     
        if !!(containers |> find (== container-id))
            new-class ="show-#{container-id}"
            $$.container.class-name = if ($$.container.class-name.index-of \show-) == -1 then "#{$$.container.class-name} #{new-class}" else ($$.container.class-name.replace /show-[a-z\-]*/g, new-class)
            containers
                |> map -> [it, $$[camelize it]]        
                |> each ([id, element])-> element?.style?.display = if id == container-id then "" else \none

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

    (document.get-elements-by-class-name \subscribe) |> map (element)->
        e, trigger <- add-click-listener element
        return if !state?.sub-method-list
        {keyword, method, next-url, operator-id, short-code}:sub-method? = state.sub-method-list.0
        return if !sub-method
        {name, next-url}:new-state = switch method
            | \ExternalPageUrl, \ExternalLink =>
                {
                    name: \external-page-url
                    next-url: if (next-url.index-of \http) == 0 then next-url else "http://#{domain}#{if (next-url.index-of '/') == 0 then '' else '/'}#{next-url}"
                }
            | _ => throw "unexpected subscription method: #{method}, the page only works with the sub-method: ExternalPageUrl"
        console.log \url, next-url
        set-state do 
            {} <<< new-state <<< {container-id: name}
            {} <<< trigger

    # react equivalent of mount-component    
    populate = (how) ->
        
        landing-page.populate how
        
        [platform, country, operator, language, postfix] = suffix.split \-
        
        error, {visit-id, sub-method-list, status, redirect-url}? <- get-sub-method  do
            { 
                domain
                path
                campaign-id
                page-id
                language
                creative
                platform
                country
                operator
                postfix
                query-params
            }

        # for legacy event recording consistency
        set-state {visit-id}
        return record-event \get-sub-method-error, {error} if !!error

        {method, operator-id} = sub-method-list.0        

        # for get-sub-method event
        set-state {operator-id, selected-sub-method: method}
        record-event \get-sub-method, {}

        set-state do 
            {
                name: \default-state
                container-id: \default-state
                operator-id
                sub-method-list
            }
            {action: \auto}

    {

        get-ready: ->
          <- window.add-event-listener \load
          populate!
        get-state: -> {} <<< state
        props
        populate
        record-event
        set-state
        switch-state: (state, parameters)-> set-state {name: state, container-id: state} <<< parameters, action: \switch-state-function
        change-language: (language-iso-code) -> 


    }
























