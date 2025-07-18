export const getPartsFromImage = async image => {

  const formData = new FormData();
  formData.append('vinImage', image);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/parts-from-image`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data;
};

export const getPartsFromVin = async vin => {
  const res = fetch(`${import.meta.env.VITE_API_URL}/api/parts?vin=${vin}`);
  const data = await res.json();
  return data;
};