<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  interface Course {
    id: string;
    name: string;
  }

  const course: Course | null = data.course;
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
      </div>

      <div class="course__content">
        <!-- Add course content here -->
        <p>Course details coming soon...</p>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @import '../../../styles/variables';

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
      }
    }

    &__content {
      background: $white;
      padding: $spacing-6;
      border-radius: $border-radius;
      box-shadow: $shadow-md;
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