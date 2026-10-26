
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 5555, hash: 'd0034efdbede9cc6182b24e6b72729aab047461b3878c1e0753425c2b00fd09c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1055, hash: 'a221139e7808de6c1d2bf2fff340539d9a7983b1f822fd6d8124b6d47b663662', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 309, hash: '3983a94f489cd8ff89c7da9a885dc0188f9ba5d058c8809d15bf19728249e5e8', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'index.html': {size: 15222, hash: 'bed0a7213b6c52eb01fc019e2589275d8eac2bbc6da70d5c21f25726aa128b06', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 15222, hash: 'bed0a7213b6c52eb01fc019e2589275d8eac2bbc6da70d5c21f25726aa128b06', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-64VY7OZM.css': {size: 425937, hash: 'aOYR+xowgGU', text: () => import('./assets-chunks/styles-64VY7OZM_css.mjs').then(m => m.default)}
  },
};
