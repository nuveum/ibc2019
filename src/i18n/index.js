import _ from 'lodash';

let languageMap = {};

const ls = (key, defaultValue) => _.get(languageMap, key, defaultValue);

export const setLanguageMap = (map) => {
    languageMap = map
}

export const getLanguageMap = () => languageMap;

export default ls;
