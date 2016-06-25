window.prelude = {
    any: (f, xs) -->
      for x in xs when f x
        return true
      false
    camelize: (.replace /[-_]+(.)?/g, (, c) -> (c ? '').to-upper-case!)
    each: (f, xs) -->
        for x in xs
            f x
        xs
    filter: (f, xs) --> [x for x in xs when f x]
    find: (f, xs) -->
      for x in xs when f x
        return x
      void
    fold: (f, memo, xs) -->
      for x in xs
        memo = f memo, x
      memo 
    map: (f, xs) --> [f x for x in xs]
    obj-to-pairs: (object) ->
        [[key, value] for key, value of object]
    pairs-to-obj: (object) -> {[x.0, x.1] for x in object}
    unique: (xs) ->
      result = []
      for x in xs when x not in result
        result.push x
      result
}
