const Router = require('express').Router;
const detail = require('../services/detail');
const uploader = require('../services/uploader');
const search = require('../services/search');
const download = require('../services/download');
const latest = require('../services/latest');
const plays = require('../services/plays');

const router = Router();
router.use('/api/maps/detail/:id', detail);
router.use('/api/maps/by-hash/:hash', detail);
router.use('/api/maps/uploader/:id/:page', uploader);
router.use('/api/search/text/:page', search);
router.use('/api/download/key/:id', download);
router.use('/api/stats/key/:id', detail);
router.use('/api/maps/latest/:page', latest);
router.use('/api/maps/rating/:page', rating);
router.use('/api/maps/plays/:page', plays);

module.exports = router;