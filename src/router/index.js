const Router = require('express').Router;
const detail = require('../services/detail');

const router = Router();
router.use('/api/maps/detail/:id', detail);

module.exports = router;