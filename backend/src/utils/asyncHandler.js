// const asyncHandler = (requestHandler) => {
//  return (req,res,next) => {
//         Promise
//         .resolve(requestHandler(res,req,next))
//         .catch((err) => next(err))
//     }
// }


// export {asyncHandler}


const asyncHandler = (handler) => {
    return async (req, res, next) => {
      try {
        await handler(req, res, next);
      } catch (error) {
        next(error); // Pass any errors to Express error handling middleware
      }
    };
  };
  
  export { asyncHandler };