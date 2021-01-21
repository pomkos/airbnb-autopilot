import { isNumber } from 'lodash';

const generateRandomNumber = (min = 800, max = 1500) => {
  return Math.random() * (max - min) + min;
};

const randomDelay = async () => {
  const rand = generateRandomNumber(350, 600);
  return new Promise((resolve) => setTimeout(resolve, rand));
};

const logger = (v) => {
  console.log(v);
  const now = new Date();
  const txt = document.querySelector('.txt');
  const message = /* html */ `<p class="settings__bottomSubtitle Px(12px)--s Px(17px)--ml Lts(0) Fw($regular) C($c-secondary) Fz($xs) Ta(s)"><span>
  ${`0${now.getHours()}`.slice(-2)}:${`0${now.getMinutes()}`.slice(
    -2
  )}:${`0${now.getSeconds()}`.slice(-2)}.</span>
  ${v}</span></p>`;
  txt.innerHTML = message + txt.innerHTML;
};

const waitUntilElementExists = (selector, callback) => {
  const el = document.querySelector(selector);
  if (el) {
    callback(el);
  }
  setTimeout(() => waitUntilElementExists(selector, callback), 500);
};

const findReactComponent = (el) => {
  for (const key in el) {
    if (key.startsWith('__reactInternalInstance$')) {
      const fiberNode = el[key];

      return fiberNode && fiberNode.return && fiberNode.return.stateNode;
    }
  }
  return null;
};

const updateProps = (domElement, newProps) => {
  if (!domElement) return {};
  const keys = Object.keys(domElement);
  const instanceKey = keys.filter((prop) => /__reactInternalInstance/.test(prop))[0];
  const instance = domElement[instanceKey];
  if (!instance) return {};

  for (const prop in newProps) {
    if (newProps.hasOwnProperty(prop)) {
      instance.return.stateNode.props[prop] = newProps[prop];
    }
  }
  instance.return.stateNode.updater.enqueueForceUpdate(instance.return.stateNode);
};

const rad = (x) => {
  return (x * Math.PI) / 180;
};

const getDistance = (p1, p2) => {
  const R = 6378137;
  const dLat = rad((isNumber(p2.lat) ? p2.lat : p2.lat()) - (isNumber(p1.lat) ? p1.lat : p1.lat()));
  const dLong = rad(
    (isNumber(p2.lng) ? p2.lng : p2.lng()) - (isNumber(p1.lng) ? p1.lng : p1.lng())
  );
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(isNumber(p1.lat) ? p1.lat : p1.lat())) *
      Math.cos(rad(isNumber(p2.lat) ? p2.lat : p2.lat())) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d / 1609.34);
};

export {
  getDistance,
  updateProps,
  findReactComponent,
  logger,
  randomDelay,
  generateRandomNumber,
  waitUntilElementExists
};
