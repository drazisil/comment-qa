export function get(url: string, options: {}, cb: any) {
  if (url === "moo") {
    return cb(
      "",
      "",
      JSON.stringify({ results: [{ id: 1 }], next_page: "foo" }),
    );
  } else {
    return cb("", "", JSON.stringify({ results: [{ id: 1 }] }));
  }
}
