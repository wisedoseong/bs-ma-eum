<script lang="ts">
  import { onMount } from 'svelte';
  import 'swagger-ui-dist/swagger-ui.css';
  import SwaggerUI from 'swagger-ui-dist/swagger-ui-bundle.js';

  onMount(() => {
    SwaggerUI({
      url: '/swagger.json',
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUI.presets.apis,
      ],
      layout: 'BaseLayout',
    });
  });
</script>

<svelte:head>
  <title>Ma-eum API</title>
</svelte:head>

<div id="swagger-ui"></div>