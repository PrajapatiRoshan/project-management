// Import the UserDocument interface from the user model.
// This interface typically contains the shape of a user document in your database.
import { UserDocument } from '../models/user.model';
declare global {
  namespace Express {
    // Extending the Express User interface to include custom properties from UserDocument.
    // This allows you to access user properties in the req.user object throughout your application.
    interface User extends UserDocument {
      // Adding an optional _id property of any type.
      // This is useful because Mongoose ObjectIds are not strictly typed as strings.
      _id?: any;
    }
    interface Request {
      jwt?: string;
    }
  }
}

