const Company = require("../models/company");
const User = require("../models/user");
const Membership = require("../models/membership");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// دالة التسجيل لإنشاء شركة جديدة
const register = async (req, res) => {
  const { name, email, password, membership } = req.body;
  try {
    // التحقق مما إذا كانت الشركة موجودة بالفعل
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: "Company already exists" });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء شركة جديدة
    const newCompany = new Company({ name, email, password: hashedPassword, membership });
    await Membership.updateMany({ _id: { $in: membership }}, { $push: { company: newCompany } });
    await newCompany.save();

    res.status(201).json({ message: "Company created successfully", company: newCompany });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// دالة تسجيل الدخول للشركات والمستخدمين
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // التحقق مما إذا كان البريد الإلكتروني ينتمي لشركة
    let company = await Company.findOne({ email });
    if (company) {
      // مقارنة كلمات المرور
      const passwordMatch = await bcrypt.compare(password, company.password);
      if (passwordMatch) {
        // توليد رمز مميز JWT للشركة
        const token = jwt.sign(
          { companyId: company._id, role: "company", name: company.name, email: company.email, membership: company.membership.membershipName  },
          process.env.JWT_SECRET,
          { expiresIn: "3d" }
        );
        return res.status(200).json({ token, role: "company" });
      }
    }

    // التحقق مما إذا كان البريد الإلكتروني ينتمي لمستخدم
    let user = await User.findOne({ email });
    if (user) {
      // مقارنة كلمات المرور
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // توليد رمز مميز JWT للمستخدم
        const token = jwt.sign({ userId: user._id, role: user.role.roleName }, process.env.JWT_SECRET, {
          expiresIn: "3d",
        });
        return res.status(200).json({ token});
      }
    }

    // إذا لم يتم العثور على شركة أو مستخدم أو كلمة المرور غير صحيحة
    return res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { register, login };