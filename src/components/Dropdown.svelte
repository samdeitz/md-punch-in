<!--
  Dropdown Component
  ------------------
  Purpose:
    Displays a vertical list of selectable options (dropdown menu).
    Used in PunchForm for employee name search and punch status selection.

  Features:
    - Renders a list of options from `filteredInfo`
    - Dispatches a "select" event when an option is clicked
    - Smooth slide-down transition when appearing
    - Converts displayed text to Title Case for readability
    - Customizable button styles via `btnClasses` prop

  Props:
    - filteredInfo: array of option strings to display
    - btnClasses:   string of CSS classes applied to each option button

  Events:
    - select: emitted with the clicked option value (`row`) as detail

  Dependencies:
    - Svelte: transitions (`slide`), EventDispatcher
-->

<script>
    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition";
   
    // Props
    export let filteredInfo;    // List of items to render
    export let btnClasses;      // Extra styling classes for option buttons

    // Event dispatcher for sending selection events to parent
    const dispatch = createEventDispatcher();
    
    // Handle click on option: send "select" event with row value
    const handleClick = (row) => {
        dispatch("select", row)
    }

    // Utility: convert a phrase into Title Case (for display)
    const toTitleCase = (phrase) => {
        return phrase
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
</script>

<!--
  Container:
  - Flex column layout
  - Scrollable if options exceed max height
  - Rounded bottom for dropdown styling
  - Slide-in animation when shown
-->
<div class="flex flex-col max-h-43 overflow-auto scrollbar-style rounded-b-md" transition:slide={{ duration: 300 }}>
    {#each filteredInfo as row}
        <!-- Each option is a button -->
        <button type="button" class="p-2 transition-all duration-300 cursor-pointer {btnClasses}" on:click={() => handleClick(row)}>{toTitleCase(row)}</button>
    {/each}
</div>