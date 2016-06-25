window.customizations = do -> 
    
    {each, filter} = window.prelude
    {add-click-listener} = window.utils

    {

        prevent-auto-operator-selection: ({set-state}, current-state, next-state, on-subscription-link-click = (-> {}))->
            if current-state.name == \start-state and next-state.name == \operator-selection
                (document.get-elements-by-class-name \subscribe) 
                    |> filter (button)-> (button.get-attribute \data-operator-id) == null
                    |> each -> add-click-listener it, (e, trigger)->
                        set-state next-state, trigger, (on-subscription-link-click e)
                        false
                set-state do 
                    {} <<< current-state  <<< {name: \default-state, container-id: \default-state}
                    {
                        action: \customization
                        customization: \prevent-auto-operator-selection
                        initial-target: next-state.name
                    }
                return false
            true

        prevent-auto-number-entry: ({set-state}, current-state, next-state)->
            if current-state.name == \start-state and next-state.name == \number-entry
                set-state do 
                    {} <<< next-state <<< {name: \default-state, container-id: \default-state}
                    {
                        action: \customization
                        customization: \prevent-auto-number-entry
                        initial-target: next-state.name
                    }
                return false
            true

        # prevent auto redirection to the service page from congrats page
        service-page-link: ({set-state}, current-state, next-state) ->
            if current-state.name == \congrats and next-state.name == \service-page and !next-state.forced
                (document.get-elements-by-class-name \service-page-link)                    
                    |> each -> add-click-listener it, (e, trigger)->
                        set-state do 
                            {} <<< next-state <<< {forced: true}
                            {
                                action: \customization
                                customization: \service-page-link
                                initial-target: next-state.name
                            }
                            {redirect-url: next-state.next-url}
                        false
                return false
            true
        
        only-directWAP: (page, current-state, next-state) ->
            next-state.name != "number-entry" and
            (current-state.name != \default-state or \DirectWAP == next-state.selected-sub-method)

    }
