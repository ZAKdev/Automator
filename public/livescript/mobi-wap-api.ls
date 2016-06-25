# require prelude
# require utils
# require url-parser

window.jsonp-api = (parameters) ->

    {camelize, each, filter, map, obj-to-pairs} = window.prelude
    {composeURL, getJSONP} = window.utils
    {parse-query} = window.url-parser

    JSONPRequest = (url, callback) ->
        parsed-url = parse-query url

        # TODO: replace the tag parameters to pid & siteid instead of replacing here (retire the old tags)
        # pubid = parsed-url .GET \pubid
        # publisher-id = parsed-url .GET \publisherId
        # if !!pubid
        #     parsed-url .REMOVE \pubid .SET \pid, pubid
        # if !!publisher-id
        #     parsed-url .REMOVE \publisherId .SET \siteid, publisher-id
        
        parsed-url .SET "q42", window.mobi-one-constants.q42

        ({} <<< parameters <<< window.mobi-one-constants)
            |> obj-to-pairs
            |> filter ([key]) -> key in (<[campaign-id creative suffix user-id session-id client-session-id]> |> map camelize)
            |> each ([key, value]) -> parsed-url .SET "xm-#{key}", value        
        getJSONP do 
            parsed-url.to-string!
            callback

    # domain -> url -> (service-page-url -> Void)
    poll-subscription-status = (domain, url, callback)->
        if (url.index-of \http) == 0
            callback null, [, url]
        else
            redirection-cycle = parse-int (parse-query url .GET \RedirectionCycle) + 1
            JSONPRequest do 
                "http://#{domain}#{parse-query url .REMOVE \jsonp .REMOVE \_ .REMOVE \skipgoogleplay .SET \RedirectionCycle redirection-cycle .to-string!}"
                ({redirect-url}?)->
                    poll-subscription-status domain, (if !!redirect-url and redirect-url.length > 0 then redirect-url else url), callback

    {

        # domain -> congrats-url -> (service-page-url -> Void)
        get-service-url: (domain, congrats-url, callback)->
            return callback [,congrats-url] if (congrats-url.index-of \http) == 0
            JSONPRequest do
                "http://#{domain}#{congrats-url}"
                ({redirect-url}?)->
                    callback [, redirect-url]

        # domain -> path -> campaign-id -> page-id -> language -> query-params -> (err -> [{method, keyword, short-code, next-url, operator-id}, ...] -> Void)
        get-sub-method: ({domain, path, campaign-id, page-id, language, query-params}, callback)->
            JSONPRequest do 
                composeURL do 
                    "http://#{domain}/#{path}"
                    {
                        Campaignid: campaign-id,
                        ForcedPage: page-id,
                        LangID: language,
                        skipgoogleplay:1
                    } <<< query-params <<< (parse-query document.location.href).keys
                ({OC, VisitId, Status, SubMethod, SubMethodList, redirect-url}:response)->
                    sub-method-list = 
                        | !SubMethod and !SubMethodList => []
                        | !!SubMethod and (SubMethodList?.length or 0) == 0 => [SubMethod <<< {OperatorID: parse-int OC}]
                        | _ => SubMethodList
                    callback do
                        null
                        {
                            visit-id: VisitId
                            redirect-url
                            status: Status
                            sub-method-list: sub-method-list
                                |> map ({Method, URL, OperatorID, MOKeyword, MOShortCode, OC}?)->
                                    {
                                        keyword: MOKeyword
                                        method: Method
                                        next-url: URL
                                        operator: OC
                                        operator-id: OperatorID
                                        short-code: MOShortCode
                                    }
                        }

        poll-subscription-status

        # domain -> number-submission-url -> number -> (err -> {status, keyword, short-code, next-url} -> Void)
        submit-number: (domain, number-submission-url, number, callback)->
            url = if (number-submission-url.index-of domain) > -1 then number-submission-url else "http://#{domain}/#{number-submission-url}"
            JSONPRequest do 
                "#{parse-query url .REMOVE \jsonp .SET \phone, number .to-string!}"
                ({Status, SubMethod, redirect-url})->
                    callback null, {
                        status: if SubMethod?.Method == \MO then \MO else Status
                        keyword: SubMethod?.MOKeyword
                        short-code: SubMethod?.MOShortCode
                        next-url: SubMethod?.URL or redirect-url
                    }

        # domain -> pin-submission-url -> pin -> (err -> {status, keyword, short-code, next-url} -> Void)
        submit-pin: (domain, pin-submission-url, pin, callback)->
            url = if (pin-submission-url.index-of domain) > -1 then pin-submission-url else "http://#{domain}/#{pin-submission-url}"
            JSONPRequest do 
                "#{parse-query url .REMOVE \jsonp .SET \pin, pin .to-string!}"
                ({redirect-url, Status, SubMethod})->
                    callback null, {
                        status: 
                            | !!redirect-url and SubMethod == null => \ValidPIN
                            | Status == \InvalidPIN => Status
                            | SubMethod?.Method == \MO => \MO
                            | _ => \Unknown
                        keyword: SubMethod?.MOKeyword
                        short-code: SubMethod?.MOShortCode
                        next-url: redirect-url
                    }

        type: 'mobi-wap'


    }  

