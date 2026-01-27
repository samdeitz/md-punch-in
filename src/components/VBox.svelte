<!--
  VBox Component
  --------------
  Purpose:
    Provides a reusable vertical flexbox container.
    Automatically applies `flex flex-col` while allowing
    extra props and classes to be passed in.

  Features:
    - Wraps children in a vertical flex layout
    - Accepts and forwards additional props (`$$restProps`)
    - Allows custom styling via `class` attribute
-->

<script></script>

<div {...$$restProps} class="flex flex-col {$$restProps.class}">
    <slot></slot>
</div>