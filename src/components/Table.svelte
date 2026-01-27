<!--
  Table Component
  ---------------
  Purpose:
    Renders the main punch table with user rows, column headers, and 
    optional office/group columns.

  Features:
    - Displays punch data from InfoStore (name, status, time, date)
    - Dynamically includes Office/Group columns (based on OptionsStore settings)
    - Option to filter only "current" users (hide old entries)
    - Name formatting toggle (displayname vs fullname)

  Dependencies:
    - Stores: EmployeeStore, InfoStore, OptionsStore
    - Components: TableRow.svelte, VBox.svelte, HBox.svelte
    - Library: date-fns-tz (for formatting and date checks)

  Props:
    - printing (bool) - Whether table is in print mode (styling adjustment)
    - displayOffice (bool) - Show/hide Office column
    - displayGroup (bool) - Show/hide Group column

  Notes:
    - Uses keyed {#each} block on row.id for stable list rendering
    - Employee data is matched to rows by displayname (case-insensitive)
    - Falls back to empty string if office/group missing
-->

<script>

    // --- Imports ---
    import { EmployeeStore, InfoStore, OptionsStore } from "../stores/Stores.js";
    import TableRow from "./TableRow.svelte";
    import VBox from "./VBox.svelte";
    import HBox from "./HBox.svelte";
    import { format } from 'date-fns-tz';

    // --- Props ---
    export let printing;
    export let displayOffice;
    export let displayGroup;

    // --- Reactive Store Data (For what to show on table) ---
    $: displayCurrentUsers = $OptionsStore ? $OptionsStore.display_current_users : false;
    $: showDisplayName = $OptionsStore ? $OptionsStore.show_display_name : false;

</script>

<!-- Table Container -->
<div class:printed={printing} class="flex flex-col grow bg-md-lightgrey overflow-x-auto no-scroll">

    <!-- Header Row  -->
    <HBox class="justify-between bg-bs-primary p-2 px-3 text-white font-semibold text-md @max-[72rem]:min-w-[75vw] @max-[60rem]:min-w-[120vw] @max-[36rem]:min-w-[200vw] ">
        
        <!-- Columns -->
        <div class="table-item name-col">NAME</div>

        <!-- Office Column (optional) -->
        {#if displayOffice}
            <div class="table-item text-center">OFFICE</div>
        {/if}

        <!-- Group Column (optional) -->
        {#if displayGroup}
            <div class="table-item text-center">GROUP</div>
        {/if}

        <div class="table-item text-center">STATUS</div>
        <div class="table-item text-center">TIME</div>
        <div class="table-item text-right">DATE</div>
    </HBox>

    <!-- Table Body -->
    <VBox class="bg-gray-300 no-scroll">
        {#each $InfoStore as row, i (row.id)}

            <!-- Ignore a user if their status has not been changed TODAY and displayCurrentUsers is true (config option) -->
            {#if !(format(new Date(), 'yyyy-M-dd') != row.date && displayCurrentUsers)}
                {@const emp = $EmployeeStore.find(
                    (e) => e.displayname.toLowerCase() === row.displayname.toLowerCase()
                )}

                <!-- Render Table Row -->
                <TableRow 
                name={showDisplayName ? row.displayname.toUpperCase() : row.fullname.toUpperCase()} 
                status={row.status.toUpperCase()} 
                time={row.time} 
                date={row.date}
                group={emp?.groups ?? ""} 
                office={emp?.office ?? ""} 
                {displayGroup} 
                {displayOffice}
                />
            {/if}
        {/each}
    </VBox>
</div>