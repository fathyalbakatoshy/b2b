const Role = require('../models/roles');

const createRole = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newRole = new Role({ name, description });
    await newRole.save();
    res.status(201).json({ message: 'Role created successfully' });
  } catch (error) {
    console.error('Role creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    console.error('Role retrieval error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getRoleById = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (error) {
    console.error('Role retrieval error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    role.name = name;
    role.description = description;
    await role.save();
    res.status(200).json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Role update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    await role.remove();
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Role deletion error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole
}