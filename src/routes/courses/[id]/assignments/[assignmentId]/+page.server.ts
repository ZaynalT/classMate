import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const courseId = params.id;
  const assignmentId = params.assignmentId;

  // Load course data from localStorage (simulated server-side)
  const course = {
    id: courseId,
    name: 'Course ' + courseId
  };

  return {
    course,
    assignmentId
  };
}; 