# require prelude
# require url-parse

window.utils = do ->

    {find, fold, obj-to-pairs} = window.prelude
    {parse-query} = window.url-parser

    composeURL = (url, json)->
        result = json
            |> obj-to-pairs
            |> fold do 
                (memo, [key, value])-> memo.SET key, value
                parse-query url
        result.to-string!

    # generated using JS2Coffee
    debounce = (func, wait, immediate)->
        args = undefined
        context = undefined
        result = undefined
        timeout = undefined
        timestamp = undefined

        later = ->
            last = Date.now! - timestamp
            if last < wait and last > 0
                timeout := set-timeout later, wait - last
            else
                timeout := null
                if !immediate
                    result := func.apply(context, args)
                    context := args := null if !timeout
            return

        ->
            args := arguments
            callNow = immediate and !timeout
            context := this
            timestamp := Date.now!
            timeout := set-timeout later, wait if !timeout
            if callNow
                result := func.apply context, args
                context := args := null
            result

    dispatch-event = (event-type, event-args) ->
        try
            window.dispatch-event <| (window.CustomEvent || window.Event) |> -> new it do
                event-type
                event-args
        catch error
            console.log "Error in dispatching event", error

    getJSONP = (url, success-callback, error-callback)->
        script = document.create-element \script
        function-name = "_jsonp#{Date.now!}"

        window[function-name] = (data)->
            console?.log "response: #{JSON.stringify data, null, 4}"
            document.head.remove-child script
            success-callback data if !!success-callback

        script.src = composeURL url, {jsonp: function-name, _: Math.floor Math.random! * 10000}
        script.onerror = (err) ->
            console.log "script.onerror"
            error-callback err if !!error-callback
        document.head.append-child script

    param = (object)->

      build-param = (prefix, object)->
        match typeof! object
        | \Array =>
          [0 til object.length]
            |> map (index)->
              build-param (if !!prefix then "#{prefix}[#{index}]" else index), object[index]
        | \Object =>
          object 
            |> obj-to-pairs
            |> map ([key, value])->
              build-param (if !!prefix then "#{prefix}[#{key}]" else key), value
        | _ => "#{encodeURIComponent prefix}=#{encodeURIComponent object}"

      result = build-param undefined, object
        |> flatten
        |> Str.join \&

      result.replace /%20/g, \+
       

    # DOM manipulation functions
    cancel-event = -> 
        it.prevent-default!
        it.stop-propagation!
        false                

    add-click-listener = (element, listener)->
        element.add-event-listener \click, (e)->
            listener e, {action: \click, element: e.current-target.id}
            cancel-event e

    focus-on-input-field = ({id, value:{length}}?)!->
        input-field = document.get-element-by-id id

        return if !input-field
        
        if length == 0
            input-field.focus!

        else if !!input-field.create-text-range
            field-range = input-field.create-text-range!
                ..move-start \character, length
                ..collapse!
                ..select!

        else if !!input-field.selection-start
            input-field.selection-start = input-field.selection-end = length
            input-field.focus!

    add-class = (element, class-name) ->
        return element.classList.add class-name if !!element.classList

        return null if !class-name or class-name.length == 0
        if !element.get-attribute \class .split " " .some (== class-name)
            element.set-attribute \class, (element.get-attribute \class) + " " + class-name

    remove-class = (element, class-name) ->
        return element.classList.remove class-name if !!element.classList
        
        return null if !class-name or class-name.length == 0
        element.set-attribute do 
            \class
            element.get-attribute \class .split " " .filter (!= class-name) .reduce do 
                (a, b) -> if a.length == 0 then b else "#{a} #{b}"
                ""

    has-class = (element, class-name) ->
        return element.classList.contains class-name if !!element.classList and !!element.classList.contains
        element.get-attribute \class .split " " .some (== class-name)

    languages-hash = {
        "ar": "Arabic",
        "en": "English",
        "ru": "Russian_Translit",
        "uk": "Ukrainian",
        "fr": "French",
        "sw": "Swahili",
        "th": "Thai",
        "az": "Azerbaijanian",
        "id": "Indonesian",
        "ms": "Malay",
        "de": "German",
        "el": "Greek",
        "vi": "Vietnamese",
        "pl": "Polish",
        "bn": "Bengali",
        "nl": "Dutch",
        "ur": "Urdu",
        "hi": "Hindi",
        "fil": "Tagalog",
        "zh": "Mandarin",
        "sv": "Swedish",
        "fi": "Finnish",
        "lk": "Sinhala",
        "tr": "Turkish"
    }

    {
        add-click-listener
        cancel-event
        composeURL
        debounce
        dispatch-event
        focus-on-input-field
        getJSONP
        param
        add-class
        remove-class
        has-class
        languages-hash

        # convert a language (coming from main.js to a tech team's LangID)
        # check mraid-google-landing-page.ls
        techify-language: (language) ->
            return language if language.length > 3
            languages-hash[language]

        untechify-language: (language) ->
            return null if !language or !language.toLowerCase
            return language if language.length < 3
            [iso, tech]? = languages-hash |> obj-to-pairs |> find ([a, b]) -> b.toLowerCase! == language.toLowerCase!
            iso ? null
    }
