const bcrypt = require('bcrypt');
const User = require('../models/user');
const Role = require('../models/roles');

// دالة لإنشاء مستخدم جديد
const createUser = async (req, res) => {
  const { name, email, password, roleId } = req.body;
  try {
    // التحقق من وجود مستخدم بنفس البريد الإلكتروني
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // العثور على الدور المرتبط بـ roleId
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // إنشاء مستخدم جديد
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: {
        roleId: role._id,
        roleName: role.name
      }
    });

    // حفظ المستخدم في قاعدة البيانات
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// دالة للحصول على جميع المستخدمين
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('User retrieval error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// دالة للحصول على مستخدم بواسطة الـ ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('User retrieval error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// دالة لتحديث معلومات مستخدم
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, roleId } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // تحديث معلومات المستخدم
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // تحديث الدور إذا تم توفيره
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      user.role = {
        roleId: role._id,
        roleName: role.name
      };
    }

    // حفظ التغييرات
    await user.save();
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// دالة لحذف مستخدم
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // إزالة المستخدم من الأدوار المرتبطة
    await Role.updateMany({ users: user._id }, { $pull: { users: user._id } });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
