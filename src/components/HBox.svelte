<!--
  HBox Component
  --------------
  Purpose:
    Provides a reusable horizontal flexbox container.
    Automatically applies `flex flex-row` while allowing
    extra props and classes to be passed in.

  Features:
    - Wraps children in a horizontal flex layout
    - Accepts and forwards additional props (`$$restProps`)
    - Allows custom styling via `class` attribute
-->

<script></script>

<div {...$$restProps} class="flex flex-row {$$restProps.class}">
    <slot></slot>
</div>