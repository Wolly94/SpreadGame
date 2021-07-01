let findAndMapi = (mapi: ('a, int) => option<'b>, l: array<'a>): option<'b> => {
  let result = ref(None)
  let _ = Js.Array.findi((val, index) => {
    switch mapi(val, index) {
    | Some(b) => {
        result := Some(b)
        true
      }
    | _ => false
    }
  }, l)
  result.contents
}

let findAndMap = (map: 'a => option<'b>, l: array<'a>): option<'b> => {
  let result = ref(None)
  let _ = Js.Array.find(val => {
    switch map(val) {
    | Some(b) => {
        result := Some(b)
        true
      }
    | _ => false
    }
  }, l)
  result.contents
}
