<script>
  export let user = {
    name: '',
    email: '',
    major: '',
    year: ''
  };
</script>

<div class="profile-card card">
  <div class="profile-card__content">
    <div class="profile-card__header">
      <div class="profile-card__avatar">
        <span>{user.name ? user.name[0].toUpperCase() : '?'}</span>
      </div>
      <div class="profile-card__info">
        <h2>{user.name || 'Not Set'}</h2>
        <p>{user.email || 'No email provided'}</p>
      </div>
    </div>

    <div class="profile-card__details">
      <div class="profile-card__field">
        <span class="profile-card__label">Major</span>
        <p>{user.major || 'Not Set'}</p>
      </div>
      <div class="profile-card__field">
        <span class="profile-card__label">Year</span>
        <p>{user.year || 'Not Set'}</p>
      </div>
    </div>

    <button class="button">Edit Profile</button>
  </div>
</div>

<style lang="scss">
  @use '../styles/_variables' as *;
  @use '../styles/mixins' as *;

  .profile-card {
    &__content {
      display: flex;
      flex-direction: column;
      gap: $spacing-6;
    }

    &__header {
      @include flex-center;
      gap: $spacing-4;
    }

    &__avatar {
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      background-color: $gray-200;
      @include flex-center;

      span {
        font-size: $font-size-2xl;
        color: $text-color-light;
      }
    }

    &__info {
      h2 {
        margin-bottom: $spacing-1;
      }

      p {
        color: $text-color-light;
      }
    }

    &__details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-4;
    }

    &__field {
      .profile-card__label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: $text-color-light;
        margin-bottom: $spacing-1;
      }

      p {
        color: $text-color;
      }
    }
  }
</style> 