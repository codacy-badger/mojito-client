<template>
    <widget>
        <template v-slot:content>
            <b-button class="btn add-widget">
                <b-icon style="width: 75%; height: 75%;" icon="plus"/>
            </b-button>
        </template>
    </widget>
</template>

<script>
import Widget from "@/components/home/Widget.vue";

export default {
    name: "add-widget",

    components: {
        Widget,
    },
}
</script>

<style>
.add-widget {
    width: 100%;
    height: 100%;
    color: gray;
    background-color: transparent;
    border: none;
}

.add-widget:hover {
    color: white;
}
</style>
