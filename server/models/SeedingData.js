import User from './UserModel.js'; // Adjust the path to your User model
import roles from './roles.js'; // Adjust the path to your roles

// Connection to MongoDB

// Function to seed admin user
export async function seedAdminUser() {
  try {
    // Check if an admin user already exists
    const existingAdmin = await User.findOne({ role: roles.ADMIN });
    debugger;
    if (!existingAdmin) {
      // Create new admin user
      const admin = new User({
        username: 'admin', // Replace with desired username
        email: 'admin@gmail.com', // Replace with desired email
        password: 'admin@1234', // Replace with desired password
        role: roles.ADMIN // Assuming roles.ADMIN corresponds to the admin role
      });

      // Save the new admin user to the database
      await admin.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    // Close the database connection (if needed)
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}
