const BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const getPartsFromImage = async image => {
  const formData = new FormData();
  formData.append('vinImage', image);
  const res = await fetch(`${BASE_URL}/parts/image`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data;
};

export const getPartsFromVin = async vin => {
  const res = await fetch(`${BASE_URL}/parts?vin=${vin}`);
  const data = await res.json();
  return data;
};