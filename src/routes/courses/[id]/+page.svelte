<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import CourseNavigation from '$lib/components/CourseNavigation.svelte';

  export let data: PageData;

  interface Course {
    id: string;
    name: string;
  }

  interface Assignment {
    id: string;
    name: string;
    dueDate: string;
    description: string;
    courseId: string;
    completed?: boolean;
    grade?: number;
  }

  const course: Course | null = data.course;
  let assignments: Assignment[] = [];
  let upcomingAssignments: Assignment[] = [];

  onMount(() => {
    goto(`/courses/${data.course?.id}/overview`);
  });

  function getUpcomingAssignments(assignments: Assignment[]): Assignment[] {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return assignments
      .filter(assignment => {
        if (assignment.completed) return false;
        const dueDate = new Date(assignment.dueDate);
        return dueDate <= oneWeekFromNow && dueDate >= now;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function getTimeRemaining(dueDate: string) {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();

    if (diff < 0) return { text: 'Overdue', status: 'overdue' };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let status = 'normal';
    if (days <= 3) status = 'urgent';
    else if (days <= 7) status = 'warning';

    return {
      text: `${days} days, ${hours} hours, ${minutes} minutes remaining`,
      status
    };
  }
</script>

<div class="loading">
  <p>Loading course...</p>
</div>

<style lang="scss">
  @import '../../../styles/_variables';

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
    color: $text-color-light;
  }
</style> 