<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface Course {
    id: string;
    name: string;
  }

  const dispatch = createEventDispatcher<{
    add: Course;
    cancel: void;
  }>();

  let newCourse = {
    name: ''
  };

  function generateUrlId(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  function handleSubmit() {
    if (!newCourse.name) return;

    const course: Course = {
      id: generateUrlId(newCourse.name),
      name: newCourse.name
    };

    dispatch('add', course);
    
    // Reset form
    newCourse = {
      name: ''
    };
  }
</script>

<div class="form-container">
  <form on:submit|preventDefault={handleSubmit} class="form">
    <div class="form__group">
      <label for="name">Course Name</label>
      <input
        type="text"
        id="name"
        bind:value={newCourse.name}
        placeholder="Enter course name"
        required
      />
    </div>

    <div class="form__actions">
      <button type="submit" class="button">Add Course</button>
      <button type="button" class="button button--secondary" on:click={() => dispatch('cancel')}>
        Cancel
      </button>
    </div>
  </form>
</div>

<style lang="scss">
  @import '../../styles/variables';

  .form-container {
    background: $white;
    padding: $spacing-6;
    border-radius: $border-radius;
    box-shadow: $shadow-md;
    margin-bottom: $spacing-6;
  }

  .form {
    display: grid;
    gap: $spacing-4;
    max-width: 500px;
    margin: 0 auto;

    &__group {
      display: flex;
      flex-direction: column;
      gap: $spacing-2;

      label {
        font-weight: 500;
        color: $text-color;
      }

      input {
        padding: $spacing-2;
        border: 1px solid $gray-300;
        border-radius: $border-radius;
        font-size: $font-size-base;

        &:focus {
          outline: none;
          border-color: $primary-color;
        }
      }
    }

    &__actions {
      display: flex;
      gap: $spacing-2;
      justify-content: flex-end;
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