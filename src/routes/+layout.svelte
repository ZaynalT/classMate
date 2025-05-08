<script>
  import '../styles/app.scss';
</script>

<div class="app">
  <nav class="nav">
    <div class="nav__container">
      <a href="/" class="nav__logo">ClassMate</a>
      <div class="nav__menu">
        <a href="/">Home</a>
        <a href="/courses">Courses</a>
        <a href="/profile">Profile</a>
      </div>
    </div>
  </nav>

  <main class="container">
    <slot />
  </main>
</div> 