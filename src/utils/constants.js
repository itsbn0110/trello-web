let apiRoot = '';
// import.meta.env là của Vite
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8386';
}

if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-wcmn.onrender.com';
}

export const API_ROOT = apiRoot;
