const errorMiddleware = (err, req, res, next) => {
    console.error(err); // Log de fout naar de console (je kunt dit uitbreiden met een logging-library)
  
    // Als de fout een specifieke status heeft (bijv. 400 of 500), gebruik die, anders stuur 500
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message || 'Er is iets misgegaan.',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Toon stack trace alleen in de ontwikkelomgeving
    });
  };
  
  export default errorMiddleware;
  