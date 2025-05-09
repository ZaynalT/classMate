<script lang="ts">
  import type { PageData } from './$types';
  import CourseNavigation from '$lib/components/CourseNavigation.svelte';
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
  let completedAssignments: Assignment[] = [];

  const gradeValues = {
    'A': 100,
    'B': 80,
    'C': 70,
    'D': 60,
    'E': 50,
    'F': 0
  } as const;

  type Grade = keyof typeof gradeValues;

  onMount(() => {
    // Load assignments from localStorage
    const savedAssignments = localStorage.getItem(`assignments-${course?.id}`);
    if (savedAssignments) {
      assignments = JSON.parse(savedAssignments);
      completedAssignments = assignments
        .filter(a => a.completed === true && a.grade && Object.keys(gradeValues).includes(a.grade))
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }
  });

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  function getAverageGrade(): { letter: string; percentage: number } {
    if (completedAssignments.length === 0) return { letter: 'N/A', percentage: 0 };
    const validGrades = completedAssignments.filter(a => a.grade && Object.keys(gradeValues).includes(a.grade));
    if (validGrades.length === 0) return { letter: 'N/A', percentage: 0 };
    
    const sum = validGrades.reduce((acc, curr) => acc + (gradeValues[curr.grade as Grade] || 0), 0);
    const average = Math.round(sum / validGrades.length);
    
    // Convert numeric average to letter grade
    let letter = 'F';
    if (average >= 90) letter = 'A';
    else if (average >= 80) letter = 'B';
    else if (average >= 70) letter = 'C';
    else if (average >= 60) letter = 'D';
    else if (average >= 50) letter = 'E';
    
    return { letter, percentage: average };
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

  function getGradePercentage(grade: string): number {
    return gradeValues[grade as Grade] || 0;
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
        <CourseNavigation activeItem="grade-graph" />
        <Breadcrumbs />
      </div>

      <div class="course__content">
        <div class="grade-graph">
          <div class="grade-graph__header">
            <h2>Grade Progress</h2>
            <div class="average-grade">
              <span class="average-grade__label">Average Grade:</span>
              <div class="average-grade__value">
                <span style="color: {getGradeColor(getAverageGrade().letter)}">
                  {getAverageGrade().letter}
                </span>
                {#if getAverageGrade().percentage > 0}
                  <span class="average-grade__percentage">
                    ({getAverageGrade().percentage}%)
                  </span>
                {/if}
              </div>
            </div>
          </div>

          {#if completedAssignments.length === 0}
            <p class="no-grades">No completed assignments with grades yet.</p>
          {:else}
            <div class="progress-container">
              {#each completedAssignments as assignment}
                <div class="assignment-progress">
                  <div class="assignment-info">
                    <span class="assignment-name">{assignment.name}</span>
                    <span class="assignment-date">{formatDate(assignment.dueDate)}</span>
                  </div>
                  <div class="progress-bar">
                    <div 
                      class="progress-fill"
                      style="width: {getGradePercentage(assignment.grade || 'F')}%; background-color: {getGradeColor(assignment.grade || 'F')}"
                    ></div>
                    <span class="grade-label" style="color: {getGradeColor(assignment.grade || 'F')}">
                      {assignment.grade}
                    </span>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../../styles/_variables' as *;

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
    }
  }

  .grade-graph {
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-6;

      h2 {
        color: $text-color;
        margin: 0;
      }
    }
  }

  .average-grade {
    display: flex;
    align-items: center;
    gap: $spacing-2;

    &__label {
      color: $text-color-light;
      font-size: $font-size-base;
    }

    &__value {
      font-size: $font-size-xl;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: $spacing-1;
    }

    &__percentage {
      color: $text-color-light;
      font-size: $font-size-base;
      font-weight: normal;
    }
  }

  .no-grades {
    text-align: center;
    color: $text-color-light;
    padding: $spacing-8;
  }

  .progress-container {
    display: grid;
    gap: $spacing-4;
  }

  .assignment-progress {
    .assignment-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: $spacing-2;

      .assignment-name {
        font-weight: 500;
        color: $text-color;
      }

      .assignment-date {
        color: $text-color-light;
        font-size: $font-size-sm;
      }
    }

    .progress-bar {
      position: relative;
      height: 24px;
      background-color: $gray-100;
      border-radius: $border-radius;
      overflow: visible;

      .progress-fill {
        height: 100%;
        transition: width 0.3s ease-in-out;
        border-radius: $border-radius;
      }

      .grade-label {
        position: absolute;
        right: $spacing-2;
        top: 50%;
        transform: translateY(-50%);
        font-weight: 600;
        font-size: $font-size-sm;
        background-color: $white;
        padding: 0 $spacing-1;
        border-radius: $border-radius;
        z-index: 1;
      }
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
</style> 