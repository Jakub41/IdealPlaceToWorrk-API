const FilterPlacesHelper = (req) => {
  const match = {};

  const { wifi } = req.query;

  if (wifi) {
    match.wifi = wifi === 'true';
  }

  console.log(wifi);
};

export default FilterPlacesHelper;
