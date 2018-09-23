'use strict';

const yelp = require('yelp-fusion');

const apiKey = 'u7IGu_9imvSNXhcFF8SL2bezzy9ktJy3MowyKCcp9-JZ3Gc1ew_NfmGuPqTK4koxAGv63qYbXZTeI_LNcdjArC7IcXDTzKotaUc81a53sf6tHX0cTJlgdYG4i2ekW3Yx';

const searchRequest = {
  term: 'Tourists Must See List',
  raduis: 0.5,
  latitude: req.body.lat,
  longitude: req.body.long,
  sort_by: 'distance',
  limit: 5,
};

const client = yelp.client(apiKey);

client
  .search(searchRequest)
  .then(response => {
    const result = response.jsonBody.businesses;
    //   const prettyJson = JSON.stringify(firstResult, null, 4);
    console.log(result);
  })
  .catch(e => {
    console.log(e);
  });
