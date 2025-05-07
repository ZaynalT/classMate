<script>
  import UserProfile from '../../components/UserProfile.svelte';
  
  let currentUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    major: 'Computer Science',
    year: 'Junior',
    gpa: 3.8
  };
</script>

<div class="max-w-2xl mx-auto">
  <h1 class="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>
  <UserProfile user={currentUser} />
</div> 