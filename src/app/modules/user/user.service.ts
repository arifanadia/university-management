import mongoose from 'mongoose';
import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //create a user object
  let userData: Partial<TUser> = {};

  //if password is not given, use default password

  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );
  if (!admissionSemester) {
    throw new Error('Admission semester not found');
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set generated id
    userData.id = await generateStudentId(admissionSemester);

    //create a user (transaction-1) Note* transaction data array hisabe dite hoy
    const newUser = await User.create([userData], { session });

    //create a student
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed To Create User');
    }
    // set id,_id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // create a student (transaction-2)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const UserServices = {
  createStudentIntoDB,
};
