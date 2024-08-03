const express = require('express');
const router = express.Router();
const { createMembership, getAllMemberships, getMembershipById, updateMembership, deleteMembership, addCompanyToMembership, removeCompanyFromMembership } = require('../controllers/membershipController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/',  createMembership);
router.get('/',  getAllMemberships);
router.get('/:id',  getMembershipById);
router.put('/:id',  updateMembership);
router.delete('/:id',  deleteMembership);

router.post('/add-company', authMiddleware, addCompanyToMembership);
router.post('/remove-company', authMiddleware, removeCompanyFromMembership);

module.exports = router