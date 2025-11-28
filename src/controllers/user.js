import User from '../models/User.js';
import { hashPassword } from '../utils/password.js';
import { success } from '../utils/response.js';

const createUser = async () => {
  try {
    const password = await hashPassword("Admin123!")

    const user = await User.create({
        role: 'admin',
        email: 'admin@gmail.com',
        firstName: 'Super',
        lastName: 'Admin',
        passwordHash:  password, // hash for Admin123!
        status: 'active',
        refreshTokens: []
      });
      console.log("Added Admin User");
      
  } catch (error) {
    console.log("Error Adding Admin User", error);
    
  }
};

export default createUser;