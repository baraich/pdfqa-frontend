function isHTML(blocks: string[]) {
  return blocks
    .flatMap((block) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(block, "text/html");

      return Array.from(doc.body.childNodes).filter(
        (node) => node instanceof Text || node instanceof HTMLAnchorElement,
      );
    })
    .map((element) => {
      if (element instanceof Text) {
        return {
          type: "text",
          content: element.data,
        };
      }

      if (element instanceof HTMLAnchorElement) {
        return {
          type: "link",
          content: element.getAttribute("href"),
        };
      }
    });
}

export default function renderLinks(text: string) {
  const dangerousString = text.replace(
    /(https?:\/\/\S+)/gm,
    "$URL: <a href='$1'>$1</a> :$URLEND",
  );

  const blocks = dangerousString.split(/\$URL:|:\$URLEND/gm);
  return isHTML(blocks);
}
