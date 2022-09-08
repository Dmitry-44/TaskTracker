<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { useTaskStore } from "@/stores/task";
import { useRouter } from "vue-router";

const router = useRouter()

</script>
<template>
    <div>OPERATIONS</div>
</template>


<style lang="sass" scoped>
.kanban-background
    background:#f9f8f8
    width:100%
    height:100%
    padding: 50px
    display: flex
    flex-direction: row
    &>div
        flex: 0 0 auto
.kanban-column
    display: flex
    flex-direction: column
    border-radius: 6px
    position: relative
    flex: 0 0 304px
    width: 304px
    height: 100%
    max-width: 304px
    padding: 0 12px
    transition: box-shadow 250ms
    &:hover
        box-shadow: 0 0 0 1px #edeae9
    .title 
        align-items: center
        border-radius: 6px
        // cursor: pointer;
        display: flex
        position: relative
        h3
            font-size: 16px
            line-height: 20px
            // font-weight: 500
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            margin-right: auto
            display: inline-block
            position: relative
.kanban-column .column-button-footer
    background-color: inherit
    margin: 0 auto
    display: flex
    border: none

</style>

