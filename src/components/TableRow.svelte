<!--
  TableRow Component
  ------------------
  Purpose:
    Represents a single row in the punch table. Displays:
      - Employee name
      - Optional Office / Group columns
      - Status (colored by api option)
      - Time
      - Date

  Features:
    - Alternating background colors for rows (odd/even)
    - Status text color pulled from OptionsStore punch options
    - Responsive width adjustments via Tailwind breakpoints

  Props:
    - name (string) - Employee name to display
    - office (string, default "g1") - Employee office
    - group (string, default "hello") - Employee group
    - displayOffice (bool) - Whether to render office column
    - displayGroup (bool) - Whether to render group column
    - status (string) - Punch status text
    - date (string) - Punch date
    - time (string) - Punch time

  Dependencies:
    - Stores: OptionsStore (for punch option colors)
    - Components: HBox.svelte
-->

<script>
    // --- Imports ---
    import { OptionsStore } from "../stores/Stores.js";
    import HBox from "./HBox.svelte";

    // --- Props ---
    export let name;
    export let office = "office";
    export let group = "group";
    export let displayOffice;
    export let displayGroup;
    export let status;
    export let date;
    export let time;
    
    // --- Get Status Color ---
    let statusColor = "#f15d22"
    $: {
        let punchOptions = $OptionsStore ? {...$OptionsStore}.punch_options : [];
        for (let option of punchOptions) {
            if (option.text.toUpperCase() == status) statusColor = option.color;
        }
    }
</script>

<!-- Row Container -->
<HBox class="justify-between odd:bg-gray-300 even:bg-gray-200 px-2 py-1 font-medium @max-[72rem]:min-w-[75vw] @max-[60rem]:min-w-[120vw] @max-[36rem]:min-w-[200vw]">
    
    <!-- Items -->
    <div class="table-item name-col">{name}</div>

    <!-- Office Item (optional) -->
    {#if displayOffice}
        <div class="table-item text-center">{office}</div>
    {/if}

    <!-- Group Item (optional) -->
    {#if displayGroup}
        <div class="table-item text-center">{group}</div>
    {/if}

    <div class="table-item text-center " style="color: {statusColor}">{status}</div>
    <div class="table-item text-center">{time}</div>
    <div class="table-item text-right">{date}</div>
</HBox>



