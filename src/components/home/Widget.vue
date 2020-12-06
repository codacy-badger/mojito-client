<template>
    <!-- use a column to determine the horizontal size and position -->
    <b-col class="mt-4" cols="12" md="4">
        <!-- use a div to determine the vertical size -->
        <div class="widget">
            <!-- widget content will be displayed in a card -->
            <b-card class="widget-content" bg-variant="dark" text-variant="light">
                <slot name="content"></slot>
            </b-card>
        </div>
    </b-col>
</template>

<script>
export default {
    name: "widget",
}
</script>

<style scoped>
.widget {
    padding-top: 50%;
    position: relative;
}

.widget-content {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
