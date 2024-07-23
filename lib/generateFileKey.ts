export default function generateFileKey(fileName: string | undefined) {
  return (
    (fileName || "") +
    "__" +
    Date.now().toString().toLowerCase()
  ).replace(/[\s-\.]/gm, "_");
}
