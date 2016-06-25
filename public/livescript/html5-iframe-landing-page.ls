# require landing-page

window.html5-iframe-landing-page = ({
    domain
    path
    page-id
    forced-page
    campaign-id or window?.mobiOneConstants?.campaignId
    suffix
    creative
    language
    get-extra-event-args or (-> {})
})->

    {record-event, record-error}:landing-page = window.landing-page do 
        {
            get-extra-event-args: -> {} <<< {
                campaign-id: parse-int campaign-id
                creative
                domain
                page-id: parse-int page-id
                page-language: language
                path                
                suffix
            } <<<  get-extra-event-args!
        }

    getURL = (language) ->
        returnUrl = "http://#{domain}/#{path}?q42=#{mobi-one-constants.q42}&campaignid=#{campaign-id}&forcedPage=#{if (typeof forced-page == \undefined) then page-id else forced-page}"
        returnUrl += if !!language then "&LangID=#{language}" else ""
        returnUrl += "&xm-userId=#{mobi-one-constants.user-id}" 
        returnUrl += "&xm-creative=#creative&xm-suffix=#suffix" 
        returnUrl += "&xm-sessionId=#{mobi-one-constants.session-id}" 
        returnUrl += "&xm-clientSessionId=#{mobi-one-constants.client-session-id}&x-iframe=1" 
        parent-query-string = "?#{decode-URI-component (window?.mobi-one-constants?.query-tokens ? {})}"
        parsed-url = url-parser.parse-query parent-query-string
            ..keys
            |> prelude.obj-to-pairs
            |> prelude.each ([key, value]) ->
                returnUrl += "&#{key}=#{value}"
        returnUrl

    mount-page = ->
        iframe-container = document.get-element-by-id \iframe-container
        throw "iframe-container not found" if (typeof iframe-container == \undefined) or iframe-container == null 

        iframe = document.create-element \iframe
            ..onload = ->
                record-event do
                    \iframe-loaded
                    {
                        offset-width: iframe.offset-width
                        offset-height: iframe.offset-height
                    }
            ..id = \iframe
            ..src = getURL!
            ..scrolling = \yes

        existing-iframe-element = document.get-element-by-id \iframe

        if undefined == existing-iframe-element or existing-iframe-element?.parent-element != iframe-container
            iframe-container.append-child iframe

    populate = (how) ->
        landing-page.populate how
        start-recording-tap -> {creative, suffix, campaign-id} <<< get-extra-event-args!

    change-language = (language) ->
        document.get-element-by-id \iframe .src = getURL language

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

        mount-page
        populate
        change-language
        record-event
    }