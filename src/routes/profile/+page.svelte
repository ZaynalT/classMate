<script>
  import UserProfile from '../../components/UserProfile.svelte';
  
  let currentUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    major: 'Computer Science',
    year: 'Junior'
  };
</script>

<div class="container">
  <div class="profile">
    <div class="profile__header">
      <h1 class="text-center">Your Profile</h1>
    </div>

    <div class="profile__content">
      <UserProfile user={currentUser} />
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../styles/_variables' as *;

  .container {
    margin-top: $spacing-8;
  }

  .profile {
    &__header {
      margin-bottom: $spacing-8;
      padding-top: $spacing-8;

      h1 {
        color: $text-color;
        margin: 0;
        margin-bottom: $spacing-6;
      }
    }

    &__content {
      background: $white;
      padding: $spacing-6;
      border-radius: $border-radius;
      box-shadow: $shadow-md;
    }
  }

  .text-center {
    text-align: center;
  }
</style> 