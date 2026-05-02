const userService = require('../services/userService');

const userController = {
  async search(req, res, next) {
    try {
      const users = await userService.search(req.query.q);
      res.json(users);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
