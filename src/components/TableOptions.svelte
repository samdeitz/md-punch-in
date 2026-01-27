<!--
  TableOptions Component
  ----------------------
  Purpose:
    Provides a toolbar of action buttons for the punch table, allowing
    the user to:
      - Toggle Office column visibility
      - Toggle Group column visibility
      - Print the table

  Features:
    - Dispatches toggle/print events to parent component
    - Uses TableButton for consistent button styling
    - Responsive layout via HBox

  Dependencies:
    - Components: TableButton.svelte, HBox.svelte
    - Assets: printer.png
    - Svelte: createEventDispatcher

  Notes:
    - Each button dispatches a distinct event ("toggleOffice", "toggleGroup", "printTable")
    - Parent component (PunchTable) listens for and handles these events
-->

<script>
    // --- Imports ---
    import PrintIcon from "../lib/printer.png";
    import TableButton from "./TableButton.svelte";
    import HBox from "./HBox.svelte";
    import { createEventDispatcher } from 'svelte';

    // --- Dispatcher ---
    const dispatch = createEventDispatcher();

</script>

<!-- Options Row -->
<HBox class=" @max-[32rem]:justify-between bg-bs-primary w-full text-white">
    <!-- Toggle Office Button -->
    <TableButton clickHandler={() => dispatch("toggleOffice")}>
        <h1 class="font-semibold">DISPLAY OFFICE</h1>
    </TableButton>

    <!-- Toggle Group Button -->
    <TableButton clickHandler={() => dispatch("toggleGroup")}>
        <h1 class="font-semibold">DISPLAY GROUP</h1>
    </TableButton>

    <!-- Print Button -->
    <TableButton class="@min-[32rem]:ml-auto" clickHandler={() => dispatch("printTable")}>
        <h1 class="font-semibold">PRINT TABLE</h1>
        <img alt="Print Icon" src={PrintIcon} class="self-center w-5 h-5">
    </TableButton>
</HBox>