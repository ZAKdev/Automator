# abstract mraid landing page definition
# require utils
# require prelude
window.mraid-landing-page = ->

    {any, camelize, each, filter, find, map, fold, pairs-to-obj, obj-to-pairs, unique} = window.prelude

    elements = [{id: \container}]

    $$ = elements
        |> map ({id, required})->
            element = document.get-element-by-id id
            return [(camelize id), element] if !!element
            is-required = if !!required then required! else true
            throw "#{id} not found" if is-required
        |> filter -> !!it
        |> pairs-to-obj
    

    current-language = null

    get-mraid-state = -> if !!window?.mraid then window.mraid.get-state! else \mraid-is-undefined
    
    # MRAID 1.0 uses getViewable(), MRAID 2.0 uses isViewable()
    get-mraid-viewable = -> if !!window?.mraid then (if !!window.mraid.is-viewable then window.mraid.is-viewable! else window.mraid.get-viewable!) else \mraid-is-undefined
   
    get-extra-event-args = -> 
        format: \mraid
        mraid-defined: !!window?.mraid
        mraid-placement-type: if !!window?.mraid then window.mraid.get-placement-type! else \mraid-is-undefined
        mraid-state: get-mraid-state!
        mraid-version: if !!window?.mraid then window.mraid.get-version! else \mraid-is-undefined
        mraid-support-sms: if !!window.mraid and !!window.mraid.supports then window.mraid.supports \sms else false


    mraid-page-becomes-visible-callbacks = []
    mraid-page-becomes-visible = ->
        each (-> it!), mraid-page-becomes-visible-callbacks

    mraid-page-becomes-hidden-callbacks = []
    mraid-page-becomes-hidden = ->
        each (-> it!), mraid-page-becomes-hidden-callbacks


    {

        get-extra-event-args

        get-mraid-state

        get-ready: ({record-event, state-change-listener}, callback) ->
            do-populate = do ->
                is-populated = false
                (how)->
                    return if is-populated
                    is-populated = true
                    try
                        mraid-close = document.get-element-by-id \mraid-close
                        if !mraid-close
                            console.error "mraid-close not found"
                        else
                            mraid-close.add-event-listener \click, -> 
                                record-event \mraid-close, {}
                                window.mraid.close!                        
                    catch ex
                        console.log "unhandled error:"
                        console.log ex
                    callback how

            if !!window?.mraid

                if window.mraid.get-state! == \loading
                    set-timeout (-> do-populate \mraid-populated-on-timeout), 2000
                    window.mraid.add-event-listener \ready, -> do-populate \mraid-populated-on-ready
                    window.mraid.add-event-listener \stateChange, -> do-populate \mraid-populated-on-state-change

                else
                    do-populate \mraid-populated-on-ready


                # MRAID interstitial can either becomes visible later
                window.mraid.add-event-listener \viewableChange, (state) ->
                    record-event \mraid-viewable-changed, {mraid-viewable: get-mraid-viewable!, state: state}
                    if state or get-mraid-viewable!
                        mraid-page-becomes-visible!
                    else
                        mraid-page-becomes-hidden!
                # or it is visible right now
                mraid-page-becomes-visible! if true == get-mraid-viewable!

                window.mraid.add-event-listener \stateChange, (state) ->
                    record-event \mraid-state-changed, {mraid-state: get-mraid-state!}
                    state-change-listener state if !!state-change-listener

            else
                console.log "mraid.js is missing"
                do-populate \mraid-populated-on-undefined                    

        navigate-to-url: (url)->  
            if !!window?.mraid 
                window.mraid.open url
            else
                console.log "mraid is undefined"
                window.location.href = url

        # updates the css class of the container element by suffixing it with a 2 letter language iso code
        change-language: (iso-code) ->
            if !!current-language
                window.utils.remove-class $$.container, current-language
            window.utils.add-class $$.container, iso-code
            current-language := iso-code

        add-on-mraid-page-becomes-visible: (callback) ->
            mraid-page-becomes-visible-callbacks.push callback

        add-on-mraid-page-becomes-hidden: (callback) ->
            mraid-page-becomes-hidden-callbacks.push callback

    }    