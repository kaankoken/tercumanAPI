const express = require('express');
const router = express.Router();

const LangaugesController = require('../controllers/languages');

router.get('/', LangaugesController.languages_get_all);
router.post('/', LangaugesController.languages_create_lang);
router.put('/:languageId', LangaugesController.languages_update_lang);
router.delete('/:languageId', LangaugesController.languages_delete_lang);

module.exports = router;
