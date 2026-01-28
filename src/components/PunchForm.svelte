<!--
  PunchForm Component - Punch-In Page
  -----------------------------------
  Purpose:
    Provides a sign-in form for employees to punch in/out by:
      - Selecting their name (with dropdown + autocomplete)
      - Entering a password (with visibility toggle)
      - Choosing a punch status (from predefined options)
      - Submitting to the backend API

  Features:
    - Autocomplete dropdown for employee names
    - Password visibility toggle (eye icon)
    - Dropdown for punch statuses (In, Out, Break, etc.)
    - Inline validation with error messages
    - Submission to `/api/punch.php` with async error handling

  Dependencies:
    - Stores: OptionsStore, EmployeeStore (Dropdown data)
    - Components: Dropdown.svelte, VBox.svelte, HBox.svelte (UI layout & inputs)
    - Assets: openedEye.png, closedEye.png (toggle icons for password field)

  Notes:
    - Validates all inputs before submission
    - Resets fields after successful punch
    - Displays error message if backend rejects credentials
-->

<script>
    // Store imports: hold employee list and punch options
    import { OptionsStore, EmployeeStore, InfoStore } from "../stores/Stores.js";
    import { postPunch } from "../../punch.js";
    
    // UI components
    import Dropdown from "./Dropdown.svelte";
    import VBox from "./VBox.svelte";
    import HBox from "./HBox.svelte";
    
    // Assets: eye icons for password visibility toggle
    import openedEye from "../lib/opened-eye.png";
    import closedEye from "../lib/closed-eye.png";
    
    // Form state
    let name = "";                  // Selected employee name
    let passw = "";                 // Employee password
    let status = "SELECT STATUS";   // Selected punch status

    // Validation and error handling
    let submitted = false;          // Tracks whether form has been submitted
    let errors = {                  // Field-level validation flags
        name: false,
        passw: false,
        status: false
    }
    $: errorMsg = "";               // Backend/server error message

    // UI behavior
    let focusedOnName = false;      // Whether name input is focused (controls dropdown)
    let focusedOnStatus = false;    // Whether status dropdown is open
    $: isVisible = false;           // Toggles password visibility
    // Reactive values for dropdown data
    $: filteredEmployees = $EmployeeStore ? [...$EmployeeStore].map((e) => e.displayname) : [];
    $: statuses = $OptionsStore ? $OptionsStore.punch_options.map((e) => e.text.toUpperCase()) : [];

    // Filter employees by name input (case-insensitive search)
    $: filterChange = () => {
        if (!name) filteredEmployees = $EmployeeStore ? [...$EmployeeStore].map((e) => e.displayname) : [];
        else filteredEmployees = $EmployeeStore ? [...$EmployeeStore].map((e) => e.displayname).filter((e) => e.toLowerCase().includes(name.toLowerCase())) : [];
    }

    // Submit handler: validate form, send request, handle errors
    const handleSubmit = async () => {
        // Reset validation state
        errors = {name: false, passw: false, status: false};
        submitted = true;
        errorMsg = "";

        // Validate inputs
        if (!name) errors.name = true;
        if (!passw) errors.passw = true;
        if (status === "SELECT STATUS") errors.status = true;

        // If no validation errors, send data to API
        if(Object.values(errors).every(v => v === false)) {
            try {
                await postPunch({
                        password: passw,
                        status,
                        displayname: name,
                });

                // Reset form on success
                name = "";
                passw = "";
                status = "SELECT STATUS";

            } catch (e) {
                // Show error returned from backend
                errorMsg = e.message;
            }
        }
    } 

</script>

<!-- Main form container -->
<VBox class="gap-7 m-4 bg-md-lightgrey sm:p-12 p-7">
    <h1 class="text-bs-primary text-[28px] font-medium">Please sign in below:</h1>

    <!-- Punch form -->
    <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-10 text-[17.5px]">
        
        <!-- NAME input + autocomplete dropdown -->
        <VBox>
            <div class={`flex bg-md-mediumgrey p-3 ${focusedOnName ? "rounded-t-md" : "rounded-md"}  gap-2`}>
                <label for="name" class="font-medium">Name:</label>
                <input bind:value={name} on:input={filterChange} on:focus={() => focusedOnName = true} on:blur={() => setTimeout(() => focusedOnName = false, 300)} id="name" type="text" autocomplete="off" spellcheck="false" placeholder="John Doe" class="w-full outline-0">            
            </div>

            <!-- Show dropdown only when input is focused -->
            {#if focusedOnName}
                <Dropdown filteredInfo={filteredEmployees} on:select={(e) => name = e.detail} btnClasses="bg-md-mediumgrey hover:bg-gray-200" />
            {/if}

            <!-- Validation error -->
            {#if submitted && errors.name}
                <div class="text-red-500">Please input your name</div>
            {/if}
        </VBox>

        <!-- PASSWORD input + visibility toggle -->
        <VBox>
            <HBox class="gap-2 bg-md-mediumgrey p-3 rounded-md">
                <label for="pw" class="font-medium">Password:</label>
                <input bind:value={passw} id="pw" type={isVisible ? "text" : "password"} placeholder={isVisible? "Password" : "********"} class="grow outline-0">
                
                <!-- Toggle visibility with eye icons -->
                <button type="button" on:click={()=> isVisible = !isVisible}><img src={isVisible ? closedEye : openedEye} alt="opened eye" class="w-6 cursor-pointer"></button>
            </HBox>

            <!-- Validation error -->
            {#if submitted && errors.passw}
                <div class="text-red-500">Please input your password</div>
            {/if}
        </VBox>
        
        <!-- STATUS dropdown -->
        <VBox>
            <button type="button" on:click={() => focusedOnStatus = !focusedOnStatus} class="bg-bs-gray btn {focusedOnStatus && "rounded-b-none"}">{status}</button>
            
            <!-- Show dropdown only when status menu is open -->
            {#if focusedOnStatus}
                    <Dropdown filteredInfo={statuses} on:select={(e)=> {status = e.detail; focusedOnStatus = false}} btnClasses="bg-bs-gray text-white hover:bg-[rgba(0,0,0,0.6)]" />
            {/if}

            <!-- Validation error -->
            {#if submitted && errors.status}
                <div class="text-red-500">Please select a punch status</div>
            {/if}
        </VBox>

        <!-- SUBMIT button -->
        <button type="submit" class="bg-bs-primary btn">PUNCH</button>
        
        <!-- Server-side error message -->
        {#if errorMsg}
            <div class="text-red-500 text-center">{errorMsg}, please check and try again</div>
        {/if}
    </form>
</VBox>
