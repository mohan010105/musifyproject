const BASE_URL = "https://api.openopus.org";

export const fetchPopularComposers = async () => {
  const res = await fetch(`${BASE_URL}/composer/list/pop.json`);
  const data = await res.json();
  return data.composers;
};

export const fetchComposerWorks = async (composerId) => {
  const res = await fetch(
    `${BASE_URL}/work/list/composer/${composerId}.json`
  );
  const data = await res.json();
  return data.works;
};
