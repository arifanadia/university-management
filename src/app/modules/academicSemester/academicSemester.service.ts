import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';
import { academicSemesterNameCodeMapper } from './academicSemester.constants';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {

  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester code');
  }
  const result = await AcademicSemester.create(payload);
  return result;
};
export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
};
