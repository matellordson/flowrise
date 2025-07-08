export default async function getCryptoNews() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-KEY": "M1LcmBkTjPWwQ/4bhewecHWONNpSyw1PD26nlJzAx0Y=",
    },
  };

  //   fetch("https://openapiv1.coinstats.app/news", options)
  //     .then((res) => res.json())
  //     .then((res) => console.log(res))
  //     .catch((err) => console.error(err));
  const res = await fetch("https://openapiv1.coinstats.app/news", options);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    if (!res.ok) {
      console.log();
    }
  }
}
