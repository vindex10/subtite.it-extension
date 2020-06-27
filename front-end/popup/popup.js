import * as Router from './router.js'  // {initRouter}
import * as Actions from './actions.js'  // {initSignIn}

window.onload = async () => {
  await Router.initRouter();
  await Actions.initSignIn();
};
