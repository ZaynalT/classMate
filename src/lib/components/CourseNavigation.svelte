<script lang="ts">
  import { page } from '$app/stores';
  
  export let activeItem: 'overview' | 'assignments' | 'grade-graph';

  // Get the current course ID from the URL
  $: courseId = $page.params.id;
</script>

<nav class="submenu">
  <a href="/courses/{courseId}/overview" class="submenu__item" class:active={activeItem === 'overview'}>
    Overview
  </a>
  <a href="/courses/{courseId}/assignments" class="submenu__item" class:active={activeItem === 'assignments'}>
    Assignments
  </a>
  <a href="/courses/{courseId}/grade-graph" class="submenu__item" class:active={activeItem === 'grade-graph'}>
    Grade Overview
  </a>
</nav>

<style lang="scss">
  @use '../../styles/_variables' as *;

  .submenu {
    display: flex;
    justify-content: center;
    gap: $spacing-4;
    margin-bottom: $spacing-8;
    border-bottom: 1px solid $gray-200;
    padding-bottom: $spacing-4;

    &__item {
      color: $text-color-light;
      text-decoration: none;
      padding: $spacing-2 $spacing-4;
      border-radius: $border-radius;
      transition: all 0.2s ease-in-out;

      &:hover {
        color: $text-color;
        background: $gray-100;
      }

      &.active {
        color: $primary-color;
        font-weight: 600;
        border-bottom: 2px solid $primary-color;
      }
    }
  }
</style> 