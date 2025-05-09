import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async ({ params }) => {
  // Load course data from localStorage
  const courses = JSON.parse(localStorage.getItem('courses') || '[]');
  const course = courses.find((c: any) => c.id === params.id);

  return {
    course: course || null
  };
}; 