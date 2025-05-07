<script>
  import { onMount } from 'svelte';

  let userName = '';
  
  onMount(() => {
    // Here we'll add authentication check later
  });
</script>

<div class="home">
  <div class="home__header">
    <h1>Welcome to ClassMate</h1>
    <p class="home__subtitle">Track your academic progress and stay organized</p>
  </div>

  <div class="grid">
    <div class="card">
      <h2>Track Progress</h2>
      <p>Monitor your grades, assignments, and academic achievements in one place.</p>
    </div>

    <div class="card">
      <h2>Set Goals</h2>
      <p>Set and track academic goals to stay motivated and focused.</p>
    </div>

    <div class="card">
      <h2>Stay Organized</h2>
      <p>Keep all your academic information organized and easily accessible.</p>
    </div>
  </div>
</div>

<style lang="scss">
  @import '../styles/variables';
  
  .home {
    text-align: center;
    margin-top: $spacing-8;
    
    &__header {
      margin-bottom: $spacing-8;
    }
    
    &__subtitle {
      font-size: $font-size-xl;
      color: $text-color-light;
    }
  }
</style> 