<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    search: string;
  }>();

  let searchQuery = '';

  function handleSearch() {
    dispatch('search', searchQuery);
  }
</script>

<div class="search-container">
  <div class="search-input">
    <input
      type="text"
      bind:value={searchQuery}
      on:input={handleSearch}
      placeholder="Search courses..."
      aria-label="Search courses"
    />
    <svg
      class="search-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  </div>
</div>

<style lang="scss">
  @import '../../styles/_variables';

  .search-container {
    margin-bottom: $spacing-4;
  }

  .search-input {
    position: relative;
    max-width: 400px;
    margin: 0;

    input {
      width: 100%;
      padding: $spacing-2 $spacing-10;
      border: 1px solid $gray-300;
      border-radius: $border-radius;
      font-size: $font-size-base;
      transition: all 0.2s ease-in-out;

      &:focus {
        outline: none;
        border-color: $primary-color;
        box-shadow: 0 0 0 2px rgba($primary-color, 0.1);
      }

      &::placeholder {
        color: $text-color-light;
      }
    }

    .search-icon {
      position: absolute;
      left: $spacing-3;
      top: 50%;
      transform: translateY(-50%);
      color: $text-color-light;
      pointer-events: none;
    }
  }
</style> 