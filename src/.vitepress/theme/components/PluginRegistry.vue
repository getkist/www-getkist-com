<script setup>
import { computed, ref } from 'vue'
import plugins from '../../data/plugins.json'

const query = ref('')
const category = ref('all')

const categories = computed(() => {
  const seen = new Map()
  for (const p of plugins) seen.set(p.category, (seen.get(p.category) ?? 0) + 1)
  return [{ id: 'all', label: 'All', count: plugins.length }].concat(
    [...seen.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([id, count]) => ({ id, label: id, count })),
  )
})

// Actions are searched alongside the package name and summary because the name
// a pipeline step references is usually what someone arrives here knowing —
// they have seen `StyleProcessingAction` in a config and want to know which
// package provides it.
const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  return plugins.filter((p) => {
    if (category.value !== 'all' && p.category !== category.value) return false
    if (!q) return true
    return (
      p.name.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.actions.some((a) => a.toLowerCase().includes(q)) ||
      p.keywords.some((k) => k.toLowerCase().includes(q))
    )
  })
})
</script>

<template>
  <div class="registry">
    <div class="registry-controls">
      <input
        v-model="query"
        class="registry-search"
        type="search"
        placeholder="Search by package, action, or keyword…"
        aria-label="Search plugins"
      />
      <div class="registry-filters" role="group" aria-label="Filter by category">
        <button
          v-for="c in categories"
          :key="c.id"
          class="registry-filter"
          :class="{ 'is-active': category === c.id }"
          :aria-pressed="category === c.id"
          type="button"
          @click="category = c.id"
        >
          {{ c.label }} <span class="registry-count">{{ c.count }}</span>
        </button>
      </div>
    </div>

    <p class="registry-status" role="status">
      {{ results.length }} of {{ plugins.length }} plugins
    </p>

    <ul v-if="results.length" class="registry-list">
      <li v-for="p in results" :key="p.name" class="registry-item">
        <div class="registry-head">
          <a class="registry-name" :href="p.docs">{{ p.name }}</a>
          <span class="registry-badge">{{ p.category }}</span>
        </div>
        <p class="registry-summary">{{ p.summary }}</p>
        <p class="registry-actions">
          <code v-for="a in p.actions" :key="a">{{ a }}</code>
        </p>
        <p class="registry-links">
          <a :href="p.npm" target="_blank" rel="noreferrer">npm</a>
          <span aria-hidden="true">·</span>
          <a :href="p.repo" target="_blank" rel="noreferrer">source</a>
        </p>
      </li>
    </ul>

    <p v-else class="registry-empty">
      Nothing matches “{{ query }}”. Plugins are plain npm packages — if none of
      these wrap the tool you need, <a href="/guide/plugin-development">write one</a>,
      or call the tool from a script with <code>RunScriptAction</code>.
    </p>
  </div>
</template>

<style scoped>
.registry-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1.5rem 0 1rem;
}
.registry-search {
  width: 100%;
  padding: 0.6rem 0.75rem;
  font: inherit;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.registry-search:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}
.registry-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.registry-filter {
  padding: 0.3rem 0.65rem;
  font-size: 0.85em;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  cursor: pointer;
}
.registry-filter.is-active {
  color: var(--vp-c-bg);
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
.registry-count {
  opacity: 0.7;
  font-variant-numeric: tabular-nums;
}
.registry-status {
  margin: 0 0 1rem;
  font-size: 0.85em;
  color: var(--vp-c-text-3);
}
.registry-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
.registry-item {
  padding: 0.9rem 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
}
.registry-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}
.registry-name {
  font-weight: 600;
  word-break: break-word;
}
.registry-badge {
  flex: none;
  font-size: 0.72em;
  text-transform: lowercase;
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  padding: 0.05rem 0.5rem;
}
.registry-summary {
  margin: 0.4rem 0 0.6rem;
  font-size: 0.9em;
  color: var(--vp-c-text-2);
}
.registry-actions {
  margin: 0 0 0.6rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.registry-actions code {
  font-size: 0.78em;
}
.registry-links {
  margin: 0;
  font-size: 0.82em;
  display: flex;
  gap: 0.4rem;
}
.registry-empty {
  padding: 1.25rem;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-2);
}
</style>
