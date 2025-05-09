<script lang="ts">
  import { onMount } from 'svelte';

  export let assignmentId: string;

  interface Memo {
    id: string;
    date: string;
    content: string;
    hours: number;
    minutes: number;
  }

  let memos: Memo[] = [];
  let newMemo = '';
  let hours = 0;
  let minutes = 0;

  onMount(() => {
    // Load memos from localStorage
    const savedMemos = localStorage.getItem(`memos-${assignmentId}`);
    if (savedMemos) {
      memos = JSON.parse(savedMemos);
    }
  });

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function formatTime(hours: number, minutes: number): string {
    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} hours`;
    return `${hours} hours and ${minutes} minutes`;
  }

  function handleSubmit() {
    if (!newMemo.trim()) return;

    const memo: Memo = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      content: newMemo.trim(),
      hours,
      minutes
    };

    memos = [memo, ...memos]; // Add new memo at the beginning
    localStorage.setItem(`memos-${assignmentId}`, JSON.stringify(memos));
    newMemo = '';
    hours = 0;
    minutes = 0;
  }
</script>

<div class="daily-memo">
  <h3>Daily Memo</h3>
  <p class="question">What did you do today in order to achieve your goals for this assignment?</p>
  
  <form on:submit|preventDefault={handleSubmit} class="memo-form">
    <textarea
      bind:value={newMemo}
      placeholder="Write your daily progress here..."
      rows="3"
    ></textarea>
    
    <div class="time-input">
      <div class="time-field">
        <label for="hours">Hours:</label>
        <input
          type="number"
          id="hours"
          bind:value={hours}
          min="0"
          max="24"
          class="time-input__field"
        />
      </div>
      <div class="time-field">
        <label for="minutes">Minutes:</label>
        <input
          type="number"
          id="minutes"
          bind:value={minutes}
          min="0"
          max="59"
          class="time-input__field"
        />
      </div>
    </div>

    <button type="submit" class="button" disabled={!newMemo.trim()}>
      Add Memo
    </button>
  </form>

  {#if memos.length === 0}
    <p class="no-memos">No memos yet. Start tracking your progress!</p>
  {:else}
    <div class="memo-list">
      {#each memos as memo (memo.id)}
        <div class="memo-item">
          <div class="memo-header">
            <span class="memo-date">{formatDate(memo.date)}</span>
            <span class="memo-time">Time spent: {formatTime(memo.hours, memo.minutes)}</span>
          </div>
          <p class="memo-content">{memo.content}</p>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../styles/_variables' as *;

  .daily-memo {
    margin-top: $spacing-8;
    padding-top: $spacing-6;
    border-top: 1px solid $gray-200;

    h3 {
      color: $text-color;
      margin: 0;
      margin-bottom: $spacing-2;
    }

    .question {
      color: $text-color-light;
      margin-bottom: $spacing-4;
    }
  }

  .memo-form {
    display: flex;
    flex-direction: column;
    gap: $spacing-4;
    margin-bottom: $spacing-6;

    textarea {
      width: 100%;
      padding: $spacing-3;
      border: 1px solid $gray-300;
      border-radius: $border-radius;
      font-size: $font-size-base;
      resize: vertical;
      min-height: 100px;

      &:focus {
        outline: none;
        border-color: $primary-color;
      }
    }
  }

  .time-input {
    display: flex;
    gap: $spacing-4;
    align-items: flex-end;
  }

  .time-field {
    display: flex;
    flex-direction: column;
    gap: $spacing-1;

    label {
      color: $text-color-light;
      font-size: $font-size-sm;
    }
  }

  .time-input__field {
    width: 80px;
    padding: $spacing-2;
    border: 1px solid $gray-300;
    border-radius: $border-radius;
    font-size: $font-size-base;

    &:focus {
      outline: none;
      border-color: $primary-color;
    }

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      opacity: 1;
    }
  }

  .no-memos {
    text-align: center;
    color: $text-color-light;
    padding: $spacing-8;
    background: $gray-50;
    border-radius: $border-radius;
  }

  .memo-list {
    display: grid;
    gap: $spacing-4;
  }

  .memo-item {
    background: $white;
    border: 1px solid $gray-200;
    border-radius: $border-radius;
    padding: $spacing-4;
    box-shadow: $shadow-sm;

    .memo-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-2;
    }

    .memo-date {
      color: $text-color-light;
      font-size: $font-size-sm;
      font-weight: 500;
    }

    .memo-time {
      color: $text-color-light;
      font-size: $font-size-sm;
      font-weight: 500;
    }

    .memo-content {
      color: $text-color;
      margin: 0;
      white-space: pre-wrap;
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
    align-self: flex-end;

    &:hover:not(:disabled) {
      background: $primary-color-dark;
    }

    &:disabled {
      background: $gray-300;
      cursor: not-allowed;
    }
  }
</style> 