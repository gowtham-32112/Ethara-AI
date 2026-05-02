const { ZodError } = require('zod');

/**
 * Validation middleware factory.
 * Pass a Zod schema and it validates req.body.
 */
function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = err.issues || err.errors || [];
        const messages = issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return res.status(400).json({ error: 'Validation failed', details: messages });
      }
      next(err);
    }
  };
}

module.exports = { validate };
