<template>
  <table class="api-table">
    <thead>
      <tr>
        <th>Parameter</th>
        <th>Type</th>
        <th>Required</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="param in params" :key="param.name">
        <td><code class="api-table__param">{{ param.name }}</code></td>
        <td><span class="api-table__type">{{ param.type }}</span></td>
        <td>
          <span v-if="param.required" class="api-table__required">Required</span>
          <span v-else>Optional</span>
        </td>
        <td>{{ param.description }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Props {
  params: ApiParam[];
}

defineProps<Props>();
</script>
