import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';
import { academicSemesterNameCodeMapper } from './academicSemester.constants';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {

  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(StatusCodes.BAD_REQUEST,'Invalid Semester code');
  }
  const result = await AcademicSemester.create(payload);
  return result;
};
export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
};
