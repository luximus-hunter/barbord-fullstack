<script lang="ts">
  import { UserRound } from "lucide-svelte";
  import Button from "../../components/button.svelte";
</script>

BAckoffice

<div class="card max-w-md">
  <Button href="/backoffice/users" variant="secondary">
    Users
    <UserRound />
  </Button>
</div>
