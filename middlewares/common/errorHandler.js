const errorHandler = (err, req, res, next) => {
  // console.error(err);

  let statusCode = err.status || 500;

  switch (statusCode) {
    case 404:
      return res.render('common/error/404.ejs', { layout: false });
    case 500:
      return res.render('common/error/404.ejs', { layout: false });
  }
};

export default errorHandler;
