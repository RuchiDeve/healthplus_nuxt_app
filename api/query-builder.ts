export default function makeQueryString(params: string | string[][] | Record<string, string> | URLSearchParams | undefined) {
  return new URLSearchParams(params)
      .toString();
}
