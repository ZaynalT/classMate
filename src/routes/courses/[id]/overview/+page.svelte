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
    grade?: number;
  }

  const course: Course | null = data.course;
  let assignments: Assignment[] = [];
  let upcomingAssignments: Assignment[] = [];

  onMount(() => {
    // Load assignments from localStorage
    const savedAssignments = localStorage.getItem(`assignments-${course?.id}`);
    if (savedAssignments) {
      assignments = JSON.parse(savedAssignments);
      upcomingAssignments = getUpcomingAssignments(assignments);
    }
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
        <CourseNavigation activeItem="overview" />
        <Breadcrumbs />
      </div>

      <div class="course__content">
        <div class="overview-grid">
          <div class="overview-card">
            <h2>Upcoming Assignments</h2>
            {#if upcomingAssignments.length === 0}
              <p class="no-items">No upcoming assignments due within a week.</p>
            {:else}
              <div class="upcoming-list">
                {#each upcomingAssignments as assignment}
                  {@const timeRemaining = getTimeRemaining(assignment.dueDate)}
                  <div class="upcoming-item">
                    <div class="upcoming-item__header">
                      <h3>{assignment.name}</h3>
                      <span class="time-remaining" class:urgent={timeRemaining.status === 'urgent'} class:warning={timeRemaining.status === 'warning'} class:overdue={timeRemaining.status === 'overdue'}>
                        {timeRemaining.text}
                      </span>
                    </div>
                    <div class="upcoming-item__details">
                      <span class="due-date">Due: {formatDate(assignment.dueDate)}</span>
                      {#if assignment.description}
                        <p class="description">{assignment.description}</p>
                      {/if}
                    </div>
                    <a href="/courses/{course.id}/assignments" class="button button--secondary">View Assignment</a>
                  </div>
                {/each}
              </div>
            {/if}
          </div>

          <div class="overview-card">
            <h2>Course Progress</h2>
            <div class="progress-stats">
              <div class="stat">
                <span class="stat__value">{assignments.filter(a => a.completed).length}</span>
                <span class="stat__label">Completed</span>
              </div>
              <div class="stat">
                <span class="stat__value">{assignments.filter(a => !a.completed).length}</span>
                <span class="stat__label">Pending</span>
              </div>
              <div class="stat">
                <span class="stat__value">
                  {#if assignments.length > 0}
                    {Math.round((assignments.filter(a => a.completed).length / assignments.length) * 100)}%
                  {:else}
                    0%
                  {/if}
                </span>
                <span class="stat__label">Completion Rate</span>
              </div>
            </div>
          </div>
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

  .overview-grid {
    display: grid;
    gap: $spacing-6;
    grid-template-columns: 2fr 1fr;
  }

  .overview-card {
    background: $gray-100;
    padding: $spacing-6;
    border-radius: $border-radius;
    border: 1px solid $gray-200;

    h2 {
      color: $text-color;
      margin: 0;
      margin-bottom: $spacing-4;
    }
  }

  .no-items {
    text-align: center;
    color: $text-color-light;
    padding: $spacing-4;
  }

  .upcoming-list {
    display: grid;
    gap: $spacing-4;
  }

  .upcoming-item {
    background: $white;
    padding: $spacing-4;
    border-radius: $border-radius;
    border: 1px solid $gray-200;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: $spacing-2;

      h3 {
        margin: 0;
        color: $text-color;
      }
    }

    &__details {
      margin-bottom: $spacing-4;

      .due-date {
        color: $text-color-light;
        font-size: $font-size-base;
      }

      .description {
        color: $text-color;
        margin: $spacing-2 0 0;
        font-size: $font-size-base;
      }
    }
  }

  .time-remaining {
    font-size: $font-size-base;
    font-weight: 500;
    color: #16a34a; // green-600

    &.warning {
      color: #ca8a04; // yellow-600
    }

    &.urgent {
      color: #dc2626; // red-600
    }

    &.overdue {
      color: #dc2626; // red-600
      font-weight: 600;
    }
  }

  .progress-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-4;
    text-align: center;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: $spacing-1;

    &__value {
      font-size: $font-size-2xl;
      font-weight: 600;
      color: $text-color;
    }

    &__label {
      color: $text-color-light;
      font-size: $font-size-base;
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