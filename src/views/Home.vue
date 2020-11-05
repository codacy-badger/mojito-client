<template>
    <div>
        <!-- display widgets -->
        <b-row ref="widgets" class="ml-4 mr-4"></b-row>
    </div>
</template>

<script>
import Widgets from "@/components/home/Widgets.js";
import Vue from "vue";

export default {
    mounted() {
        // create buttonto add new widgets
        this.addWidget("AddWidget");
    },

    methods: {

        addWidget(widgetType, props = {}) {
            let WidgetClass;

            // get the widget type by name
            if (widgetType in Widgets) {
                WidgetClass = Vue.extend(Widgets.AddWidget);
            } else {
                console.error("No such widget '"+ widgetType +"'");
                return;
            }

            // instantiate the widget as an object
            let widgetInstance = new WidgetClass({
                propsData: props,
            });
            widgetInstance.$mount();

            // add widget to the document
            this.$refs.widgets.appendChild(widgetInstance.$el);
        },

    },
}
</script>
