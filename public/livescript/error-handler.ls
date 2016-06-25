_record-error  = ({message, url, line-number, stack}, type) ->
    try
        query-string-obj = { message, type } 
        query-string-obj <<< { url } if !!url
        query-string-obj <<< { stack } if !!stack
        query-string-obj <<< { line-number } if !!line-number

        if typeof page != \undefined
            { suffix, creative, page-id, campaign-id } = page.props
            query-string-obj <<< {  suffix, creative, page-id, campaign-id }

        query-string = Object.keys(query-string-obj ).map (a) -> a + '=' + escape query-string-obj[a]
        (new Image!).src = "/unhandled-error.gif?#{query-string.join('&')}"
    catch err
        console.log \Error_logging.

window.onerror = (message, url, line-number) -> _record-error {message, url, line-number }, \global
window.record-error =  (err, type-arg) ->
    _record-error do
       {
        message: if !err or !err.message then err.to-string! else err.message
        stack: if !err or !err.stack then err.to-string! else err.stack
       }
       err.type || type-arg || \local