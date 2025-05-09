<script lang="ts">
  import type { PageData } from './$types';
  import CourseNavigation from '$lib/components/CourseNavigation.svelte';
  import DailyMemo from '$lib/components/DailyMemo.svelte';
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
  let assignment: Assignment | null = null;
  let showGradeInput = false;
  let gradeInput = '';
  let totalTimeSpent = { hours: 0, minutes: 0 };

  const validGrades = ['A', 'B', 'C', 'D', 'E', 'F'];

  onMount(() => {
    // Load assignments from localStorage
    const savedAssignments = localStorage.getItem(`assignments-${course?.id}`);
    if (savedAssignments) {
      const assignments = JSON.parse(savedAssignments);
      assignment = assignments.find((a: Assignment) => a.id === data.assignmentId);
    }

    // Calculate total time spent from memos
    const savedMemos = localStorage.getItem(`memos-${data.assignmentId}`);
    if (savedMemos) {
      const memos = JSON.parse(savedMemos);
      const totalMinutes = memos.reduce((acc: number, memo: any) => {
        return acc + (memo.hours * 60) + memo.minutes;
      }, 0);
      
      totalTimeSpent = {
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60
      };
    }
  });

  function handleComplete() {
    showGradeInput = true;
  }

  function handleGradeSubmit() {
    const grade = gradeInput.toUpperCase();
    if (!validGrades.includes(grade)) return;

    // Update assignment in localStorage
    const savedAssignments = localStorage.getItem(`assignments-${course?.id}`);
    if (savedAssignments) {
      const assignments = JSON.parse(savedAssignments);
      const updatedAssignments = assignments.map((a: Assignment) => {
        if (a.id === assignment?.id) {
          return {
            ...a,
            completed: true,
            grade
          };
        }
        return a;
      });
      localStorage.setItem(`assignments-${course?.id}`, JSON.stringify(updatedAssignments));
      
      // Update local state
      if (assignment) {
        assignment = {
          ...assignment,
          completed: true,
          grade
        };
      }
    }

    showGradeInput = false;
    gradeInput = '';
  }

  function cancelGradeInput() {
    showGradeInput = false;
    gradeInput = '';
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function formatTimeSpent(hours: number, minutes: number): string {
    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} hours`;
    return `${hours} hours and ${minutes} minutes`;
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
  {#if !course || !assignment}
    <div class="error">
      <h1>Assignment Not Found</h1>
      <p>The assignment you're looking for doesn't exist.</p>
      <a href="/courses/{course?.id}/assignments" class="button">Back to Assignments</a>
    </div>
  {:else}
    <div class="course">
      <a href="/courses/{course.id}/assignments" class="button button--secondary back-button">Back to Assignments</a>
      <div class="course__header">
        <h1 class="text-center">{course.name}</h1>
        <CourseNavigation activeItem="assignments" />
      </div>

      <div class="course__content">
        <div class="assignment-details">
          <div class="assignment-details__header">
            <h2>{assignment.name}</h2>
            <div class="assignment-status">
              {#if assignment.completed}
                <span class="status-badge completed" style="background-color: {getGradeColor(assignment.grade || '')}">
                  Grade: {assignment.grade}
                </span>
              {:else}
                <span class="status-badge pending">Pending</span>
              {/if}
            </div>
          </div>

          <div class="assignment-details__info">
            <div class="info-item">
              <span class="info-label">Due Date:</span>
              <span class="info-value">{formatDate(assignment.dueDate)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Total Time Spent:</span>
              <span class="info-value time-spent">{formatTimeSpent(totalTimeSpent.hours, totalTimeSpent.minutes)}</span>
            </div>
            {#if assignment.description}
              <div class="info-item description">
                <span class="info-label">Description:</span>
                <p class="info-value">{assignment.description}</p>
              </div>
            {/if}

            <div class="assignment-details__actions">
              {#if !assignment.completed}
                {#if showGradeInput}
                  <div class="grade-input">
                    <select
                      bind:value={gradeInput}
                      class="grade-select"
                    >
                      <option value="">Select Grade</option>
                      {#each validGrades as grade}
                        <option value={grade}>{grade}</option>
                      {/each}
                    </select>
                    <div class="grade-input__actions">
                      <button class="button" on:click={handleGradeSubmit}>Submit</button>
                      <button class="button button--secondary" on:click={cancelGradeInput}>Cancel</button>
                    </div>
                  </div>
                {:else}
                  <button class="button" on:click={handleComplete}>
                    Mark as Completed
                  </button>
                {/if}
              {/if}
            </div>
          </div>

          {#if assignment}
            <DailyMemo assignmentId={assignment.id} />
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../../../styles/_variables' as *;

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
    }

    &__content {
      background: $white;
      padding: $spacing-6;
      border-radius: $border-radius;
      box-shadow: $shadow-md;
    }
  }

  .assignment-details {
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-6;
      padding-bottom: $spacing-4;
      border-bottom: 1px solid $gray-200;

      h2 {
        color: $text-color;
        margin: 0;
      }
    }

    &__info {
      display: grid;
      gap: $spacing-4;
    }

    &__actions {
      margin-top: $spacing-6;
      padding-top: $spacing-4;
      border-top: 1px solid $gray-200;
    }
  }

  .info-item {
    display: grid;
    gap: $spacing-2;

    .info-label {
      color: $text-color-light;
      font-weight: 500;
    }

    .info-value {
      color: $text-color;

      &.time-spent {
        font-weight: 600;
        color: $primary-color;
      }
    }

    &.description {
      .info-value {
        white-space: pre-wrap;
      }
    }
  }

  .status-badge {
    display: inline-block;
    padding: $spacing-1 $spacing-3;
    border-radius: $border-radius;
    font-weight: 600;
    color: $white;

    &.completed {
      background-color: $success-color;
    }

    &.pending {
      background-color: $warning-color;
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
</style> 