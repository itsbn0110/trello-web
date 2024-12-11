let apiRoot = '';
// import.meta.env là của Vite
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8386';
}

if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-wcmn.onrender.com';
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_ITEMS_PER_PAGE = 12;
export const API_ROOT = apiRoot;

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
};
