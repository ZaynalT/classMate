<script lang="ts">
  import type { PageData } from './$types';
  import CourseNavigation from '$lib/components/CourseNavigation.svelte';
  import AddAssignmentForm from '$lib/components/AddAssignmentForm.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import { onMount } from 'svelte';

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
    grade?: string;
  }

  const course: Course | null = data.course;
  let assignments: Assignment[] = [];
  let showGradeInput: string | null = null;
  let gradeInput = '';

  const validGrades = ['A', 'B', 'C', 'D', 'E', 'F'];

  onMount(() => {
    // Load assignments from localStorage
    const savedAssignments = localStorage.getItem(`assignments-${course?.id}`);
    if (savedAssignments) {
      assignments = JSON.parse(savedAssignments);
    }
  });

  function handleAddAssignment(event: CustomEvent<{ name: string; dueDate: string; description: string }>) {
    const newAssignment: Assignment = {
      id: crypto.randomUUID(),
      name: event.detail.name,
      dueDate: event.detail.dueDate,
      description: event.detail.description,
      courseId: course!.id
    };

    assignments = [...assignments, newAssignment];
    localStorage.setItem(`assignments-${course?.id}`, JSON.stringify(assignments));
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

  function handleComplete(assignmentId: string) {
    showGradeInput = assignmentId;
  }

  function handleGradeSubmit(assignmentId: string) {
    const grade = gradeInput.toUpperCase();
    if (!validGrades.includes(grade)) return;

    assignments = assignments.map(assignment => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          completed: true,
          grade
        };
      }
      return assignment;
    });

    localStorage.setItem(`assignments-${course?.id}`, JSON.stringify(assignments));
    showGradeInput = null;
    gradeInput = '';
  }

  function cancelGradeInput() {
    showGradeInput = null;
    gradeInput = '';
  }

  function getGradeColor(grade: string): string {
    switch (grade) {
      case 'A': return '#16a34a'; // green-600
      case 'B': return '#22c55e'; // green-500
      case 'C': return '#ca8a04'; // yellow-600
      case 'D': return '#f59e0b'; // yellow-500
      case 'E': return '#ef4444'; // red-500
      case 'F': return '#dc2626'; // red-600
      default: return '#6b7280'; // gray-500
    }
  }
</script>

<div class="container">
  {#if !course}
    <div class="error">
      <h1>Course Not Found</h1>
      <p>The course you're looking for doesn't exist.</p>
      <a href="/courses" class="button">Back to Courses</a>
    </div>
  {:else}
    <div class="course">
      <a href="/courses" class="button button--secondary back-button">Back to Courses</a>
      <div class="course__header">
        <h1 class="text-center">{course.name}</h1>
        <CourseNavigation activeItem="assignments" />
        <Breadcrumbs />
      </div>

      <div class="course__content">
        <h2>Assignments</h2>
        
        <AddAssignmentForm courseId={course.id} on:add={handleAddAssignment} />

        {#if assignments.length === 0}
          <p class="no-assignments">No assignments yet. Add your first assignment to get started!</p>
        {:else}
          <div class="assignments">
            {#each assignments as assignment (assignment.id)}
              <div class="assignment">
                <a href="/courses/{course.id}/assignments/{assignment.id}" class="assignment__content">
                  <div class="assignment__info">
                    <h3>{assignment.name}</h3>
                    <p class="due-date">Due: {formatDate(assignment.dueDate)}</p>
                  </div>
                  <div class="assignment__status">
                    {#if assignment.completed}
                      <span class="status-badge completed" style="background-color: {getGradeColor(assignment.grade || '')}">
                        Grade: {assignment.grade}
                      </span>
                    {:else}
                      <span class="status-badge pending">Pending</span>
                    {/if}
                  </div>
                </a>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @import '../../../../styles/_variables';

  .container {
    margin-top: $spacing-8;
  }

  .text-center {
    text-align: center;
  }

  .error {
    text-align: center;
    padding: $spacing-8;

    h1 {
      color: $text-color;
      margin-bottom: $spacing-4;
    }

    p {
      color: $text-color-light;
      margin-bottom: $spacing-6;
    }
  }

  .course {
    position: relative;

    .back-button {
      position: absolute;
      left: 0;
      top: 0;
    }

    &__header {
      margin-bottom: $spacing-8;
      padding-top: $spacing-8;

      h1 {
        color: $text-color;
        margin: 0;
        margin-bottom: $spacing-6;
      }

      :global(.breadcrumbs) {
        margin-top: $spacing-4;
        padding-left: 0;
      }
    }

    &__content {
      background: $white;
      padding: $spacing-6;
      border-radius: $border-radius;
      box-shadow: $shadow-md;

      h2 {
        color: $text-color;
        margin-bottom: $spacing-6;
      }
    }
  }

  .no-assignments {
    text-align: center;
    color: $text-color-light;
    padding: $spacing-8;
  }

  .assignments {
    display: grid;
    gap: $spacing-4;
  }

  .assignment {
    &__content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-4;
      background: $white;
      border-radius: $border-radius;
      box-shadow: $shadow-sm;
      text-decoration: none;
      color: inherit;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

      &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-md;
      }
    }

    &__info {
      h3 {
        color: $text-color;
        margin: 0;
        margin-bottom: $spacing-1;
      }

      .due-date {
        color: $text-color-light;
        margin: 0;
        font-size: $font-size-sm;
      }
    }
  }

  .status-badge {
    padding: $spacing-1 $spacing-2;
    border-radius: $border-radius;
    font-size: $font-size-base;
    font-weight: 500;

    &.completed {
      background: #16a34a; // green-600
      color: white;
    }

    &.pending {
      background: #ca8a04; // yellow-600
      color: white;
    }
  }

  .grade-input {
    display: flex;
    flex-direction: column;
    gap: $spacing-2;

    .grade-select {
      padding: $spacing-2;
      border: 1px solid $gray-300;
      border-radius: $border-radius;
      font-size: $font-size-base;
      min-width: 120px;

      &:focus {
        outline: none;
        border-color: $primary-color;
      }
    }

    &__actions {
      display: flex;
      gap: $spacing-2;
    }
  }

  .button {
    display: inline-block;
    padding: $spacing-2 $spacing-4;
    background: $primary-color;
    color: $white;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    text-decoration: none;
    font-size: $font-size-base;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background: $primary-color-dark;
    }

    &--secondary {
      background: $gray-300;
      color: $text-color;

      &:hover {
        background: $gray-400;
      }
    }
  }

  .grade-select {
    padding: $spacing-2;
    border: 1px solid $gray-300;
    border-radius: $border-radius;
    font-size: $font-size-base;
    min-width: 120px;

    &:focus {
      outline: none;
      border-color: $primary-color;
    }
  }

  .completed-badge {
    font-weight: 600;
  }
</style> 