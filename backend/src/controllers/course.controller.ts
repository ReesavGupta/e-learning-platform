import { Request, Response, RequestHandler } from 'express'
const createCourse = async (req: Request, res: Response) => {
  res.send('Create course')
}
const deleteCourse = async (req: Request, res: Response) => {
  res.send('Delete course')
}
const getAllCourses: RequestHandler = async (req: Request, res: Response) => {
  res.send('Get all courses')
}
const getCourse = async (req: Request, res: Response) => {
  res.send('Get course')
}
const updateCourse = async (req: Request, res: Response) => {
  res.send('Update course')
}
export { createCourse, deleteCourse, getAllCourses, getCourse, updateCourse }
