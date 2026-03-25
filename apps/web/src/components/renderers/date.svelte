<script lang="ts">
  import Generic from "./generic.svelte";

  let props: { date: string } = $props();
  let date = $derived(
    new Date(props.date).toLocaleDateString("nl-NL", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).toLocaleUpperCase(),
  );
</script>

<Generic color="neutral">{date}</Generic>
