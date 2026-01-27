<!--
  App.svelte (Root Component)
  ---------------------------
  Purpose:
    Entry point for the punch system application. 
    - Fetches and manages data from API (status, options, employees).
    - Stores data in Svelte stores (InfoStore, OptionsStore, EmployeeStore).
    - Applies dynamic CSS variables for theming.
    - Refreshes employee status periodically.
    - Provides print functionality for PunchTable.

  Features:
    - Data fetching from API endpoints
    - Auto-refresh every 5 seconds (employee status)
    - UUID assignment for status records
    - Global theme color injection via CSS variables
    - Print support

  Dependencies:
    - uuid (for unique IDs)
    - Svelte: onMount (for lifecycle handling)
    - Stores: InfoStore, OptionsStore, EmployeeStore
    - Components: Header, PunchForm, PunchTable

  Events:
    - printTable (from PunchTable) - triggers browser print
-->

<script>
// @ts-nocheck

  // --- Imports ---
  import { v4 as uuid4 } from "uuid";
  import { onMount } from "svelte";
  import { InfoStore, OptionsStore, EmployeeStore } from "./stores/Stores.js";

  // --- Assets ---
  import Header from "./components/Header.svelte";
  import PunchForm from "./components/PunchForm.svelte";
  import PunchTable from "./components/PunchTable.svelte";


  // --- Generic Fetch Wrapper (helper) ---
  const getFrom = async (endpoint) => {
      const response = await fetch(endpoint, {
        method: "GET"
      });
      if (!response.ok) console.log("err") // check that response is given
      return await response.json(); // return response
  }

  // --- Fetch the Status of Employees ---
  const fetchStatus = async () => {
    
    try {
      // fetch from API
      let data = await getFrom("/api/status.json"); // Evoke helper method

      // if there is no response set the store empty
      if (data.response === false) {
        InfoStore.set([]);
        return
      }

      // Add an ID for rendering
      data.forEach((e) => {
        e.id = uuid4();
      })

      InfoStore.set(data); // Store data in InfoStore

    } catch (error) {
      console.log(error) // Log the error if caught
    }
  }

  // --- Fetch Config Options ---
  const fetchOptions = async () => {

    try {
      let data = await getFrom("/api/settings.json"); // Evoke helper method
      
      // if there is no response set the store empty
      if (data.response === false) {
        OptionsStore.set({});
        return
      }

      OptionsStore.set(data); // Store data in OptionsStore


    } catch (error) {
      console.log(error); // Log error if caught
    }
  }

  // --- Fetch Employees ---
  const fetchEmployees = async () => {
    try {
      let data = await getFrom("/api/employees.json"); // Evoke helper method
      
      // if there is no response set the store empty
      if (data.response === false) {
        EmployeeStore.set({});
        return
      }

      EmployeeStore.set(data); // Store data in EmployeeStore


    } catch (error) {
      console.log(error); // log error if caught 
    }
  }


  // --- Initialization and Auto Refresh (for status fetch) ---
  let interval;
  fetchOptions();
  fetchEmployees();
  fetchStatus();

  // --- Color Scheme Processing ---
  $: {
    let colorScheme = $OptionsStore ? $OptionsStore.css : {};
    for (let color in colorScheme) {
      document.documentElement.style.setProperty("--" + color, colorScheme[color]);
    }
  }
  
  // --- Printing Mechanism ---
  let printing = false;
  const printTable = () => {

    // adds a class to Table component if printing --> Removes all components apart from the table
    printing = true; 
    setTimeout(() => window.print(), 1000); // delay to allow rerender
    setTimeout(() => printing = false, 1000); // reset printing state
  }
</script>

<svelte:head>
  <title>{$OptionsStore?.app_name || "Employee Punch-In"}</title>
</svelte:head>

<!-- Root Layout -->
<div class="@container flex flex-col bg-bs-bodybg">
  <Header />

  <!-- Main Content: Form and Table -->
  <div class="@container flex flex-col @min-[56rem]:flex-row justify-center m-auto w-full ">
    <PunchForm />
    <PunchTable {printing} on:printTable={printTable}/>
  </div>
</div>