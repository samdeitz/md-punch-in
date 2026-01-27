<!--
  TableButton Component
  --------------------
  Purpose:
    A generic button wrapper with hover styles, flexible classes, 
    and slot-based content. Used for table option buttons.

  Features:
    - Accepts arbitrary props via $$restProps (for styling or attributes)
    - Calls a provided click handler on button press
    - Uses <slot> for flexible button content (icons/text)

  Props:
    - clickHandler (function) - Called when button is clicked

  Notes:
    - Always renders as type="button" (prevents accidental form submit)
    - Merges external classes with default styling
-->

<script>
    // --- Props ---
    export let clickHandler;
</script>

<!-- Button Wrapper -->
<button {...$$restProps} on:click={clickHandler} type="button" class="flex hover:bg-[rgba(0,0,0,0.3)] transition-colors duration-300 p-2 gap-2 {$$restProps.class}">
    <slot></slot>
</button>