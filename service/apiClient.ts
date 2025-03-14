

export const fetchSuggestions = async (query:string) => {
  const response = await fetch(query);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

