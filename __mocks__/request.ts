export function get(url: string, options: {}, cb: any) {
  switch (url) {
    case "goodUrlPage2":
      return cb(
        "",
        "",
        JSON.stringify({ results: [{ id: 1 }], next_page: "foo" }),
      );
    case "badUrl":
      return cb(
        "fail",
        "",
        JSON.stringify({ results: [{ id: 1 }], next_page: "foo" }),
      );

    case "badRequest":
      return cb(
        "",
        "",
        JSON.stringify({ error: "invalid", description: "bad request" }),
      );

    default:
      return cb("", "", JSON.stringify({ results: [{ id: 1 }] }));
  }
}
