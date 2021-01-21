import localForage from 'localforage';
import { debounce, isEmpty, kebabCase } from 'lodash';
import insertCss from './misc/insert-css';
import { findReactComponent, updateProps, getDistance } from './misc/helper';

const markers = [
  { name: 'planet fitness', icon: 'https://i.imgur.com/vKC4am1.png' },
  {
    name: 'snap fitness',
    icon: 'https://pbs.twimg.com/profile_images/632298145146400768/ENAW4nwo_400x400.jpg',
    required: 5 // require to be within 5 miles
  },
  { name: 'walmart', icon: 'https://i.imgur.com/5nLBm2v.png?1' }
];

let geoLocationForRoom = {};
const constantMock = window.fetch;
window.fetch = function () {
  return new Promise((resolve, reject) => {
    constantMock
      .apply(this, arguments)
      .then((response) => {
        if (response.url.includes('api/v3/PdpPlatformSections') > -1 && response.type != 'cors') {
          response
            .clone()
            .json()
            .then((r) => {
              const hasLat = r?.data?.merlin?.pdpSections?.sections;
              if (hasLat) {
                const k = hasLat.find((a) => a.id.includes('LOCATION_DETAIL_MODAL'));
                if (k?.section?.lng && k?.section?.lat && !geoLocationForRoom.lat) {
                  geoLocationForRoom = { lat: k?.section?.lat, lng: k?.section?.lng };
                }
              }
            })
            .catch((e) => {
              reject(e);
            });
        }
        resolve(response);
      })
      .catch((error) => {
        reject(response);
      });
  });
};
class AirbnbAssistant {
  // Places to open when you click a listing address
  terms = markers.map(({ name }) => name);

  constructor() {
    const findGeo = setInterval(() => {
      if (geoLocationForRoom.lat) {
        console.log(geoLocationForRoom);
        clearInterval(findGeo);
        this.start();
      }
    }, 200);
  }

  start = async () => {
    console.log('starting');
    const latitude = geoLocationForRoom.lat;
    const longitude = geoLocationForRoom.lng;
    this.terms.forEach((term) => {
      const url = `https://www.google.com/maps/search/${term}/@${latitude},${longitude},10z/data=!3m1!4b1!4m7!2m6!3m5!1s${term}!2s${latitude},${longitude}!4m2!1d${longitude}!2d${latitude}`;
      window.open(url);
    });
  };
}

if (window.location.href.includes('/rooms/')) {
  new AirbnbAssistant();
}
