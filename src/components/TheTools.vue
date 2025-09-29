<script setup>
import ToolItem from './ToolItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import MissmatchIcon from './icons/IconMissmatch.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
<RouterLink to="/hladoc">
  <ToolItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>HLA Document Processor</template>

      This tool allows you to process HLA documents efficiently. You can upload your HLA PNG images and
      get digitalized reports on HLA for patients and donors. For more information,
      <a href="https://example.com">click here</a>.
    </ToolItem>
  </RouterLink>

  <RouterLink to="/hlacalc">
  <ToolItem>
    <template #icon>
      <MissmatchIcon />
    </template>
    <template #heading>HLA Missmatch Calculator</template>

    With the HLA Missmatch Calculator, you can calculate the missmatch between HLA types of patients and donors.
    This tool is essential for ensuring compatibility in transplants. For more information,
    <a href="https://hla.alleles.org/">click here</a>.
  </ToolItem>
</RouterLink>

  <RouterLink to="/pivot">
  <ToolItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Pivot Tool</template>

    Use the Pivot Tool to analyze and visualize your data effectively. This tool helps you create pivot tables
    and perform complex data analysis with ease. For more information,
    <a href="https://example.com">click here</a>.
  </ToolItem>
</RouterLink>
</template>
