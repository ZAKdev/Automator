# require prelude
# require utils
# require url-parser

window.jsonp-api = (parameters) ->

    {camelize, each, filter, map, obj-to-pairs} = window.prelude
    {composeURL, getJSONP} = window.utils
    {parse-query} = window.url-parser

    is-falsy = (str) ->
        typeof str == \undefined or str == null or str === NaN or str?.length == 0

    JSONPRequest = (url, success-callback, error-callback) ->
        parsed-url = parse-query url

        parsed-url .SET "q42", window.mobi-one-constants.q42
        
        ({} <<< parameters <<< window.mobi-one-constants)
            |> obj-to-pairs
            |> filter ([key]) -> key in (<[campaign-id creative suffix user-id session-id client-session-id]> |> map camelize)
            |> each ([key, value]) -> parsed-url .SET "xm-#{key}", value

        getJSONP do 
            parsed-url.to-string!
            success-callback
            error-callback

    # domain -> url -> (service-page-url -> Void)
    poll-subscription-status = (domain, url, callback) ->
        url = "#{parse-query url .REMOVE \jsonp .REMOVE \_ .REMOVE \skipgoogleplay .to-string!}"
        JSONPRequest do 
            url
            ({redirect, redirect-url, error-message, next-url, subscriber-id, interval}:response?)->

                # SUCCESS
                if !!redirect-url and redirect-url.length > 0
                    callback null, [subscriber-id, redirect-url]

                # ERROR
                else if !!error-message
                    callback error-message, null

                # CONTINUE BASED ON REDIRECT FLAG
                else

                    if !!redirect
                        set-timeout do 
                            -> poll-subscription-status null, next-url, callback
                            interval * 1000

                    # STOP REDIRECTION
                    else
                        callback \exhausted, null

    {

        # String -> String -> ([String, String] -> Void)
        get-service-url: (domain, congrats-url, callback)->
            return callback [, congrats-url] if (congrats-url.index-of \http) == 0
            JSONPRequest do
                "#{congrats-url}"
                ({subscriber-id, redirect-url}?)->
                    callback [subscriber-id, redirect-url]

        # domain -> path -> campaign-id -> page-id -> language -> query-params -> (err -> [{method, keyword, short-code, next-url, operator-id}, ...] -> Void)
        get-sub-method: ({protocol, domain, path, campaign-id, page-id, language, query-params, creative, platform, postfix, country, operator, server-redirection}?, callback)->
            JSONPRequest do 
                composeURL do 
                    "#{protocol ? 'http'}://#{domain}/#{path}/#{creative}/#{platform}/#{country}/#{operator}/#{language}/#{postfix}/#{campaign-id}"
                    {
                        ForcedPage: page-id,
                        LangID: language,
                        skipgoogleplay:1,
                        server-redirection
                    } <<< query-params <<< (parse-query document.location.href).keys
                ({oc-id, visit-id, sub-method, next-url, redirect-url, keyword, short-code, msisdn, state, error}:response?)->
                    callback do
                        error
                        {
                            visit-id
                            status: if sub-method == \AlreadySubscribed then \AlreadySub else ""
                            redirect-url
                            state
                            next-url
                            sub-method-list: [
                                keyword: keyword
                                method: sub-method
                                next-url: if next-url then "#{next-url}" else ""
                                operator-id: oc-id
                                short-code: short-code
                            ]
                            msisdn
                            original-response: response
                        }
                (err) -> callback "unable to load page", null
                    

        poll-subscription-status

        # domain -> number-submission-url -> number -> (err -> {status, keyword, short-code, next-url} -> Void)
        submit-number: (domain, number-submission-url, number, callback)->
            return callback null, {status: "InvalidNumber", next-url: number-submission-url} if number.trim!.length == 0
            JSONPRequest do 
                "#{parse-query number-submission-url .REMOVE \jsonp .SET \phone, number .to-string!}"
                ({submission-status}:response)-> callback null, {status: submission-status} <<< response

        # domain -> pin-submission-url -> pin -> (err -> {status, keyword, short-code, next-url} -> Void)
        submit-pin: (domain, pin-submission-url, pin, callback)->
            return callback null, {status: \InvalidPIN, next-url: pin-submission-url} if pin.length == 0
            JSONPRequest do 
                "#{parse-query pin-submission-url .REMOVE \jsonp .SET \pin, pin .to-string!}"
                ({submission-status}:response)-> callback null, {status: submission-status} <<< response

        JSONPRequest
        
        type: 'mobi-one'

    }  

