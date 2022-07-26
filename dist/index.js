/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 938:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 175:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(938);
const github = __nccwpck_require__(175);

async function run() {
  try {
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const token = core.getInput('token');
    const octokit = github.getOctokit(token);
    const changedColumnId = github.context.payload.changes && github.context.payload.changes.column_id;

    if (changedColumnId) {
      if (github.context.payload.project_card.content_url) {
          const issueResponse = await octokit.request(github.context.payload.project_card.content_url);

          const assigneeFilter = core.getInput('assigneeFilter').length > 0 ? core.getInput('assigneeFilter').split(',') : [];
          const assignees = issueResponse.data.assignees.filter((assignee) => {
            if(assigneeFilter.length == 0) {
              return true;
            }
            return assigneeFilter.findIndex((filterItem) => {
              console.log(`Comparing filter ${filterItem.toLowerCase()} to assignee ${assignee.login.replace(/\s/g, '').toLowerCase()}`);
              return filterItem.toLowerCase() == assignee.login.replace(/\s/g, '').toLowerCase();
            }) > -1;
          });

          if(assignees.length > 0) {
            const comment = `Heads up - this issue was moved between project columns. cc ${assignees.map((assignee) => { return '@' + assignee.login }).join(', ')}`;

            const createCommentResponse = await octokit.issues.createComment({
              owner,
              repo,
              issue_number: issueResponse.data.number,
              body: comment
            });
          } else {
            console.log("No issue assignee that matches filter (if set) - doing nothing.");
          }
      }

    }

  } catch (error) {
    console.error(error);
    core.setFailed(`The action failed with ${error}`);
  }
}

run();

})();

module.exports = __webpack_exports__;
/******/ })()
;