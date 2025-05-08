<script lang="ts">
  import { page } from '$app/stores';

  interface Breadcrumb {
    label: string;
    href: string;
  }

  $: breadcrumbs = getBreadcrumbs($page.url.pathname);

  function getBreadcrumbs(pathname: string): Breadcrumb[] {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: Breadcrumb[] = [];
    let currentPath = '';

    // Always add home
    breadcrumbs.push({ label: 'Home', href: '/' });

    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      
      // Format the label
      let label = path;
      if (path === 'courses') {
        label = 'Courses';
      } else if (path === 'overview') {
        label = 'Overview';
      } else if (path === 'assignments') {
        label = 'Assignments';
      } else if (path === 'grade-graph') {
        label = 'Grade Overview';
      } else {
        // Capitalize and replace hyphens with spaces
        label = path
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

      breadcrumbs.push({
        label,
        href: currentPath
      });
    });

    return breadcrumbs;
  }
</script>

<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol>
    {#each breadcrumbs as breadcrumb, i}
      <li>
        {#if i === breadcrumbs.length - 1}
          <span class="current">{breadcrumb.label}</span>
        {:else}
          <a href={breadcrumb.href}>{breadcrumb.label}</a>
          <span class="separator">/</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<style lang="scss">
  @import '../../styles/_variables';

  .breadcrumbs {
    margin-bottom: $spacing-4;
    padding: $spacing-2 0;

    ol {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }

    li {
      display: flex;
      align-items: center;
      color: $text-color-light;
      font-size: $font-size-sm;

      &:not(:last-child) {
        margin-right: $spacing-2;
      }
    }

    a {
      color: $text-color-light;
      text-decoration: none;
      transition: color 0.2s ease-in-out;

      &:hover {
        color: $primary-color;
      }
    }

    .current {
      color: $text-color;
      font-weight: 500;
    }

    .separator {
      margin-left: $spacing-2;
      color: $gray-400;
    }
  }
</style> 