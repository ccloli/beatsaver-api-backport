const Router = require('express').Router;
const detail = require('../services/detail');
const uploader = require('../services/uploader');
const search = require('../services/search');
const download = require('../services/download');
const stats = require('../services/stats');

const router = Router();
router.use('/api/maps/detail/:id', detail);
router.use('/api/maps/uploader/:id/:page', uploader);
router.use('/api/search/text/:page', search);
router.use('/api/download/key/:id', download);
router.use('/api/stats/key/:id', detail); 

module.exports = router;