import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = ({ params }) => {
  // Load courses from localStorage
  const savedCourses = localStorage.getItem('courses');
  let course = null;
  
  if (savedCourses) {
    const courses = JSON.parse(savedCourses);
    course = courses.find((c: { id: string }) => c.id === params.id) || null;
  }

  return {
    course
  };
}; 