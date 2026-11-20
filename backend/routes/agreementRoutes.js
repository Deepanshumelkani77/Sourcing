const express = require('express');
const router = express.Router();
const {
  getAllAgreements,
  getAgreementStats,
  getAgreementById,
  createAgreement,
  updateAgreement,
  updateAgreementStatus,
  downloadAgreementPdf,
  sendAgreement,
  signAgreement,
  deleteAgreement
} = require('../controllers/agreementController');
const { protectAdmin, authorize } = require('../middleware/authMiddleware');

router.use(protectAdmin, authorize('admin', 'main_admin', 'employee'));

router.get('/', getAllAgreements);
router.get('/stats', getAgreementStats);
router.get('/:id/pdf', downloadAgreementPdf);
router.get('/:id', getAgreementById);
router.post('/', createAgreement);
router.put('/:id', updateAgreement);
router.patch('/:id/status', updateAgreementStatus);
router.post('/:id/send', sendAgreement);
router.post('/:id/sign', signAgreement);
router.delete('/:id', deleteAgreement);

module.exports = router;
