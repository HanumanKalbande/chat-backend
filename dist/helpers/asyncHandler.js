"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
/** Express 4 does not catch rejected promises, so forward them to the error handler. */
const asyncHandler = (handler) => (req, res, next) => {
    handler(req, res).catch(next);
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=asyncHandler.js.map