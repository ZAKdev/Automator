# encapsulates behaviour of expandable mraid landing pages (standalone)
window.mraid-expandable-landing-page = ({
    language
}:parameters) ->

    {add-click-listener, dispatch-event, techify-language, add-class, remove-class} = window.utils
    {get-mraid-state, change-language, navigate-to-url}:mraid-landing-page = window.mraid-landing-page!
    
    # calling page.changeLanguage is not necessary at load time
    if language.length == 2
        change-language language

    # tech team's LangID is different from ISO Codes
    language := techify-language language

    show-container = (container) ->
        {each, map} = window.prelude
        <[container preview-container]>
            |> map -> [it, document.get-element-by-id it]
            |> each ([id, element]) -> element.style.display = if id == container then '' else 'none'                    
                        
    {
        get-extra-event-args: -> {} <<< mraid-landing-page.get-extra-event-args! <<< {
            format: \expmraid      
            page-language: language 
        }

        get-ready: ({record-event, state-change-listener, expand-click-listener}, callback) -> 
            <- mraid-landing-page.get-ready do 
                {
                    record-event
                    state-change-listener: (state) ->
                        match state 
                            | \expanded => show-container \container
                            | \default => show-container \preview-container
                        state-change-listener state if !!state-change-listener
                }
            mraid-expand = document.get-element-by-id \mraid-expand
            throw "mraid-expand not found" if !mraid-expand
            mraid-expand.add-event-listener \click, ->
                expand-click-listener! if !!expand-click-listener
                window.utils.dispatchEvent "x-mobi-one-expand", {}
                window?.mraid.use-custom-close true
                window?.mraid.expand!
            callback ... if !!callback        

        navigate-to-url

        change-language: (iso-code) ->
            change-language iso-code
            # LangID query string parameter in MobiWAP pages is not the standard ISO Code
            # mapping if ISO codes to LangID is defined utils.ls
            language := window.utils.techify-language iso-code
    }    