import { parentSignupService, loginService, refreshTokenService } from '../services/auth.service.js';
import { success } from '../utils/response.js';

export const parentSignup = async (req, res, next) => {
  try {
    const result = await parentSignupService(req.body);
    return success(res, result, 201);
  } catch (error) {
    if (error.message === 'An account with this email already exists') {
      return res.status(409).json({ success: false, error: { message: error.message } });
    }
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginService(req.body);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return success(res, { accessToken: result.accessToken, user: result.user });
  } catch (error) {
    return next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    const result = await refreshTokenService({ token });
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return success(res, { accessToken: result.accessToken });
  } catch (error) {
    return next(error);
  }
};
