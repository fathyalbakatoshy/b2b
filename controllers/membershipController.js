const Membership = require('../models/membership');
const Company = require('../models/company');

// دالة لإنشاء اشتراك جديد
const createMembership = async (req, res) => {
  const { name, description, price, company } = req.body;
  try {
    const newMembership = new Membership({ name, description, price, company });
    await newMembership.save();

    // تحديث جميع الشركات بإضافة الاشتراك الجديد
    await Company.updateMany({}, { $push: { membership: newMembership._id } });

    res.status(201).json({ message: 'Membership created successfully', membership: newMembership });
  } catch (error) {
    console.error('Membership creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// دالة للحصول على جميع الاشتراكات
const getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.status(200).json(memberships);
  } catch (error) {
    console.error('Membership retrieval error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// دالة للحصول على اشتراك بواسطة الـ ID
const getMembershipById = async (req, res) => {
  const { id } = req.params;
  try {
    const membership = await Membership.findById(id);
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }
    res.status(200).json(membership);
  } catch (error) {
    console.error('Membership retrieval error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// دالة لتحديث معلومات الاشتراك
const updateMembership = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  try {
    const membership = await Membership.findById(id);
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    membership.name = name || membership.name;
    membership.description = description || membership.description;
    membership.price = price || membership.price;

    await membership.save();

    // تحديث جميع الشركات بمعلومات الاشتراك المحدثة
    res.status(200).json({ message: 'Membership updated successfully', membership });
  } catch (error) {
    console.error('Membership update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// دالة لحذف اشتراك
const deleteMembership = async (req, res) => {
  const { id } = req.params;
  try {
    const membership = await Membership.findById(id);
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    // حذف الاشتراك
    await membership.remove();

    // إزالة الاشتراك من جميع الشركات
    await Company.updateMany({}, { $pull: { membership: id } });

    res.status(200).json({ message: 'Membership deleted successfully' });
  } catch (error) {
    console.error('Membership deletion error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addCompanyToMembership = async (req, res) => {
  const { membershipId, companyId } = req.body;
  try {
    const membership = await Membership.findById(membershipId);
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // التحقق من أن الشركة ليست مرتبطة بعضوية أخرى
    const existingMembership = await Membership.findOne({ company: companyId });
    if (existingMembership) {
      return res.status(400).json({ message: 'Company already has a membership' });
    }

    if (membership.company.includes(companyId)) {
      return res.status(400).json({ message: 'Company already added to membership' });
    }

    membership.company.push(companyId);
    await membership.save();
    res.status(200).json({ message: 'Company added to membership successfully' });
  } catch (error) {
    console.error('Error adding company to membership:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const removeCompanyFromMembership = async (req, res) => {
  const { membershipId, companyId } = req.body;
  try {
    const membership = await Membership.findById(membershipId);
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // التحقق من أن الشركة ليست مرتبطة بعضوية أخرى
    const existingMembership = await Membership.findOne({ company: companyId });
    if (!existingMembership) {
      return res.status(400).json({ message: 'Company does not have a membership' });
    }

    if (!membership.company.includes(companyId)) {
      return res.status(400).json({ message: 'Company not found in membership' });
    }

    membership.company.pull(companyId);
    await membership.save();
    res.status(200).json({ message: 'Company removed from membership successfully' });
  } catch (error) {
    console.error('Error removing company from membership:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { createMembership, getAllMemberships, getMembershipById, updateMembership, deleteMembership, addCompanyToMembership, removeCompanyFromMembership };
