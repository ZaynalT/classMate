<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let courseId: string;

  const dispatch = createEventDispatcher<{
    add: { name: string; dueDate: string; description: string };
  }>();

  let name = '';
  let dueDate = '';
  let description = '';
  let showForm = false;

  function handleSubmit() {
    if (!name || !dueDate) return;

    dispatch('add', {
      name,
      dueDate,
      description
    });

    // Reset form
    name = '';
    dueDate = '';
    description = '';
    showForm = false;
  }
</script>

<div class="add-assignment">
  {#if !showForm}
    <button class="button" on:click={() => showForm = true}>
      Add Assignment
    </button>
  {:else}
    <form on:submit|preventDefault={handleSubmit} class="form">
      <div class="form__group">
        <label for="name">Assignment Name</label>
        <input
          type="text"
          id="name"
          bind:value={name}
          required
          placeholder="Enter assignment name"
        />
      </div>

      <div class="form__group">
        <label for="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          bind:value={dueDate}
          required
        />
      </div>

      <div class="form__group">
        <label for="description">Description (optional)</label>
        <textarea
          id="description"
          bind:value={description}
          placeholder="Enter assignment description"
          rows="3"
        ></textarea>
      </div>

      <div class="form__actions">
        <button type="submit" class="button">Add Assignment</button>
        <button type="button" class="button button--secondary" on:click={() => showForm = false}>
          Cancel
        </button>
      </div>
    </form>
  {/if}
</div>

<style lang="scss">
  @use '../../styles/_variables' as *;

  .add-assignment {
    margin-bottom: $spacing-6;
  }

  .form {
    background: $white;
    padding: $spacing-6;
    border-radius: $border-radius;
    box-shadow: $shadow-md;

    &__group {
      margin-bottom: $spacing-4;

      label {
        display: block;
        margin-bottom: $spacing-2;
        color: $text-color;
        font-weight: 500;
      }

      input, textarea {
        width: 100%;
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
      gap: $spacing-4;
      margin-top: $spacing-6;
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