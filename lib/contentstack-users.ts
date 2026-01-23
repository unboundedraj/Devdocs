type FindOrCreateUserParams = {
  name: string;
  email: string;
};

const API_BASE = 'https://api.contentstack.io/v3';

export async function findOrCreateUser({
  name,
  email,
}: FindOrCreateUserParams) {
  const queryRes = await fetch(
    `${API_BASE}/content_types/users/entries?query=${encodeURIComponent(
      JSON.stringify({ email })
    )}`,
    {
      headers: {
        api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
        authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
      },
    }
  );

  const queryJson = await queryRes.json();

  if (queryJson.entries?.length > 0) {
    return queryJson.entries[0];
  }

  const createRes = await fetch(
    `${API_BASE}/content_types/users/entries`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
        authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
      },
      body: JSON.stringify({
        entry: {
          title: name,
          email,
        },
      }),
    }
  );

  const createJson = await createRes.json();

  if (!createRes.ok) {
    throw createJson;
  }

  return createJson.entry;
}
