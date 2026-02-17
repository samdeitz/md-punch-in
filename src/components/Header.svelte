<!--
  Header Component - Punch-In Page
  --------------------------------
  Purpose:
    Displays a dynamic greeting ("Good Morning/Afternoon/Evening")
    alongside the current time and date. Serves as the header for
    the Punch-In page in the time tracking system.

  Features:
    - Updates displayed time every 5 seconds
    - Greeting adjusts based on current hour
    - Uses HBox layout wrapper for styling consistency

  Dependencies:
    - Imports: date-fns-tz (used for formatting the date and time)
    - Components: HBox.svelte (custom layout component for horizontal flex)
    - Svelte: onMount

  Notes:
    - `onMount` sets up an interval to refresh the time, and cleans it up
      when the component unmounts
    - Time format example: "14:23PM - September 12, 2025"
-->
    
<script>
  // @ts-nocheck
    // Imports
    import { OptionsStore } from "../stores/Stores.js";
    import { onMount } from "svelte";
    import { formatInTimeZone, format } from 'date-fns-tz'; // format date/time in specific patterns
    import HBox from "./HBox.svelte"; // Layout wrapper component (horizontal flex box)

    // Reactive state
    let interval            // Will hold reference to our update interval
    let date = new Date();  // Initialize with current date/time

    // Lifecycle: run once when component mounts
    onMount(() => {
        // Update `date` every 5 seconds to keep displayed time current
        interval = setInterval(()=> date = new Date(), 5000);
        
        // Cleanup: clear interval when component unmounts
        return () => clearInterval(interval);
    })

    // Reactive declarations:
    // Automatically recalculate these whenever `date` changes

    // Extract current hour
    $: hour = date.getHours();
    
    // Decide greeting based on hour of day
    $: timeOfDay = (hour >= 17 ? "Evening" :    // 5pm+
                    hour >= 12 ? "Afternoon" :  // 12pm–4:59pm
                    "Morning")                  // Before 12pm

    // Format date into readable string (e.g., "14:23PM - September 12, 2025")
    $: time = format(date, 'HH:mmaaa - MMMM dd, yyyy')
    
</script>

<!-- 
    UI Layout:
    - Left side: greeting based on current time of day
    - Right side: formatted current time and date
-->
<HBox class="flex justify-between bg-bs-primary p-3 text-sm sm:text-xl text-white font-semibold items-center">
     <div class="flex items-center gap-2">
      {#if $OptionsStore && $OptionsStore.logo && $OptionsStore.app_name && $OptionsStore.logo !== "none"}
        <img src={$OptionsStore.logo} alt="{$OptionsStore.app_name}">
      {/if}
      <h1>Good {timeOfDay}!</h1>
    </div>
    <h1>Employee Punch-In</h1>
    <h1>{time}</h1>
</HBox>