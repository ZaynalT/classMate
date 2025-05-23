<script lang="ts">
    import { onMount } from 'svelte';
    import AddCourseForm from '$lib/components/AddCourseForm.svelte';
    import CourseSearch from '$lib/components/CourseSearch.svelte';
  
    interface Course {
      id: string;
      name: string;
    }

    let courses: Course[] = [];
    let filteredCourses: Course[] = [];
    let showForm = false;
    
    function generateUrlId(name: string): string {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }

    function handleSearch(event: CustomEvent<string>) {
      const query = event.detail.toLowerCase();
      filteredCourses = courses.filter(course => 
        course.name.toLowerCase().includes(query)
      );
    }

    onMount(() => {
      // Load courses from localStorage
      const savedCourses = localStorage.getItem('courses');
      if (savedCourses) {
        try {
          const oldCourses = JSON.parse(savedCourses);
          // Check if we need to migrate old courses
          if (oldCourses.length > 0 && typeof oldCourses[0].id === 'number') {
            // Migrate old courses to new format
            courses = oldCourses.map((course: any) => ({
              id: generateUrlId(course.name),
              name: course.name
            })).sort((a: Course, b: Course) => a.name.localeCompare(b.name));
            localStorage.setItem('courses', JSON.stringify(courses));
          } else {
            courses = oldCourses.sort((a: Course, b: Course) => a.name.localeCompare(b.name));
          }
          filteredCourses = [...courses];
        } catch (e) {
          console.error('Error loading courses:', e);
          courses = [];
          filteredCourses = [];
        }
      }
    });

    function handleAddCourse(event: CustomEvent<Course>) {
      courses = [...courses, event.detail].sort((a, b) => a.name.localeCompare(b.name));
      filteredCourses = [...courses];
      localStorage.setItem('courses', JSON.stringify(courses));
      showForm = false;
    }
</script>

<div class="container">
  <h1 class="text-center">Courses</h1>
</div>

<div class="courses">
  <div class="courses__header">
    <h3 class="text-center">Your Courses</h3>
    <button class="button" on:click={() => showForm = !showForm}>
      {showForm ? 'Cancel' : 'Add New Course'}
    </button>
  </div>

  {#if showForm}
    <AddCourseForm 
      on:add={handleAddCourse}
      on:cancel={() => showForm = false}
    />
  {/if}
  
  <CourseSearch on:search={handleSearch} />
  
  <div class="courses__grid">
    {#each filteredCourses as course}
      <div class="card">
        <div class="card__content">
          <h2>{course.name}</h2>
          <div class="card__actions">
            <a href="/courses/{course.id}" class="button">View Course</a>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @use '../../styles/_variables' as vars;
  @use '../../styles/mixins' as mix;

  .text-center {
    text-align: center;
  }

  .container {
    margin-top: vars.$spacing-8;
  }

  .courses {
    margin-top: vars.$spacing-8;
    
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: vars.$spacing-6;
    }

    &__grid {
      display: grid;
      gap: vars.$spacing-6;
      margin-top: vars.$spacing-6;
      
      @include mix.responsive(md) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @include mix.responsive(lg) {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }

  .card {
    border-radius: vars.$border-radius;
    overflow: hidden;
    box-shadow: vars.$shadow-md;
    transition: transform 0.2s ease-in-out;
    background: vars.$white;

    &:hover {
      transform: translateY(-4px);
    }

    &__content {
      padding: vars.$spacing-4;
      text-align: center;

      h2 {
        margin-bottom: vars.$spacing-4;
        color: vars.$text-color;
      }
    }

    &__actions {
      display: flex;
      justify-content: center;
    }
  }

  .button {
    display: inline-block;
    padding: vars.$spacing-2 vars.$spacing-4;
    background: vars.$primary-color;
    color: vars.$white;
    border: none;
    border-radius: vars.$border-radius;
    cursor: pointer;
    text-decoration: none;
    font-size: vars.$font-size-base;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background: vars.$primary-color-dark;
    }
  }
</style>