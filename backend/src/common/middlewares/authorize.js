'use strict';

const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../exceptions/app-error');
const Permission = require('../../api/users/models/permission-model');
const RolePermission = require('../../api/users/models/role-permission-model');

/**
 * Authorize Middleware
 */

const authorize = async (req, res, next) => {
  try {
    const { user } = req;

    if (!user || !user.role) {
      throw new AppError('User role not found', StatusCodes.UNAUTHORIZED);
    }

    const requestUrl = req.baseUrl + req.route.path;

    // Find permission for the route
    const permission = await Permission.findOne({
      apiUrl: requestUrl,
      isActive: true,
    });

    if (!permission) {
      throw new AppError('No permission entry for this route', StatusCodes.FORBIDDEN);
    }

    // Check if user role has this permission
    const rolePermission = await RolePermission.findOne({
      roleId: user.role,
      permissionId: permission._id,
      isActive: true,
    });

    if (!rolePermission) {
      throw new AppError('Access denied: insufficient permission', StatusCodes.FORBIDDEN);
    }

    // User is authorized
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authorize };
