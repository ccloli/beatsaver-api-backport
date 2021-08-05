const Router = require('express').Router;
const detail = require('../services/detail');
const uploader = require('../services/uploader');

const router = Router();
router.use('/api/maps/detail/:id', detail);
router.use('/api/maps/uploader/:id/:page', uploader);

module.exports = router;