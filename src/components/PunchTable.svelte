<!--
  PunchTable Component
  --------------------
  Purpose:
    Displays the employee punch table along with options to:
      - Toggle display of office and group names
      - Trigger table printing 

  Features:
    - Table view (via Table.svelte)
    - Table options bar (via TableOptions.svelte)
    - Reactivity to OptionsStore settings
    - Event dispatch for print action

  Dependencies:
    - Stores: OptionsStore (for office/group display to toggle on table)
    - Components: Table.svelte, TableOptions.svelte, VBox.svelte
    - Svelte: createEventDispatcher (for event communication)

  Notes:
    - `printing` prop is passed down to Table
    - Local state mirrors OptionsStore values (reactively)
-->

<script>
// @ts-nocheck

    // --- Imports ---
    import { OptionsStore } from "../stores/Stores.js";
    import { createEventDispatcher } from 'svelte';
    import Table from "./Table.svelte";
    import TableOptions from "./TableOptions.svelte";
    import VBox from "./VBox.svelte";

    // --- Props ---
    export let printing;
    
    // --- Dispatcher ---
    const dispatch = createEventDispatcher();

    // --- Reactive Store Values ---
    $: displayOffice = $OptionsStore ? $OptionsStore.display_office_name : false;
    $: displayGroup = $OptionsStore ? $OptionsStore.display_group_name : false;


</script>
<!-- Main Container -->
<VBox class="m-4 grow bg-md-lightgrey overflow-x-auto">
    <!-- The Table (names and info) -->
    <Table {printing} {displayOffice} {displayGroup}/>

    <!-- Options Below the Table (toggle options and print) -->
    <TableOptions 
        on:printTable={() => dispatch("printTable")} 
        on:toggleOffice={()=> displayOffice = !displayOffice} 
        on:toggleGroup={()=> displayGroup = !displayGroup}
    />
</VBox>