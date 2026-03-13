export const OG_SIZE = {
  width: 1200,
  height: 630,
};

export const OG_CONTENT_TYPE = "image/png";

export async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  );

  if (resource?.[1]) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export function loadOgFonts(allText: string) {
  return Promise.all([
    loadGoogleFont("Inter", allText).then((data) => ({
      name: "Inter",
      data,
    })),
    loadGoogleFont("Inter:wght@500", allText).then((data) => ({
      name: "Inter Medium",
      data,
    })),
    loadGoogleFont("Inter:wght@700", allText).then((data) => ({
      name: "Inter Bold",
      data,
    })),
  ]);
}
