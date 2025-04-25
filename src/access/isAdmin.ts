import { Access } from 'payload';

// Access control function to check if user is an admin
export const isAdmin: Access = ({ req: { user } }) => {
  // Check if user exists and has admin role
  return Boolean(user && user.role === 'admin');
};