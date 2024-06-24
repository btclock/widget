<script setup>
import BTClock from './components/BTClock.vue'

import { ref, onMounted } from 'vue'
import { WsConnection } from "./ws_connection";
//import "toastify-js/src/toastify.css"
// import { defineComponent } from 'vue';

//   export default defineComponent({
//     name: 'Widget',
//   });

const blockHeight = ref();
blockHeight.value = 843401;
const feeRate = ref();
feeRate.value = 15;
const currentPrice = ref();
currentPrice.value = 60000;
const ignoreDataSource = ref();
let btccMethod = ref();
let btccParams = ref();
let currentScreen = ref();
let visible = ref(true);


currentScreen.value = 0;
const url = new URL(window.location.href);
const queryParams = new URLSearchParams(url.search);

function connectWebSocket() {
    const websocketProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const websocketUrl = 'wss://ws.btclock.dev/ws?prices=bitcoin&currency=usd';
    const socket = new WsConnection(websocketUrl);

    let lastMessages = [];
    let currentBlockHeight = 840001;
    // Event handler for WebSocket open

    let isOpen = false;

    socket.on('open', (event) => {
        isOpen = true;
    })

    socket.on('message', (eventData) => {
        const data = JSON.parse(eventData);
        storeAndDisplayData(data);
    })

    socket.on('close', (event) => {
    })

    socket.on('error', (event) => {
        console.error('WebSocket error:', event);
    })

    socket.open();

    function storeAndDisplayData(data) {
        if (ignoreDataSource.value)
            return;

        if (data["block"]) {

            if (currentBlockHeight != 840000 && currentBlockHeight != data.block.height) {
                const elements = document.querySelectorAll('.widget-container .btclock > div');
                elements.forEach(element => {
                    element.classList.add('animate');
                    element.addEventListener('animationend', () => {
                        element.classList.remove('animate');
                    });
                });
            }

            currentBlockHeight = data.block.height;
            blockHeight.value = currentBlockHeight;

        } else if (data['bitcoin']) {
            currentPrice.value = data['bitcoin'];
        } else if (data["mempool-blocks"]) {
            feeRate.value = data["mempool-blocks"][0].medianFee;
        }
    }
}

let options = [{
    data: blockHeight,
    method: 'parseBlockHeight',
    params: [],
}, {
    data: currentPrice,
    method: 'parseSatsPerCurrency',
    params: ['$', false],
}, {
    data: currentPrice,
    method: 'parsePriceData',
    params: ['$', false],
}, {
    data: blockHeight,
    method: 'parseHalvingCountdown',
    params: [true],
}
]

const closeWidget = () => {
    visible.value = false;
};



onMounted(() => {
    connectWebSocket();

    // setInterval(() => {
    //     currentScreen.value = (currentScreen.value + 1) % options.length;
    // }, 5000);
})

</script>

<template>
    <div class="widget-container" v-if="visible">
        <button class="close-button" @click="closeWidget">&#10006;</button>

        <BTClock :data="options[currentScreen].data.value" :method="options[currentScreen].method"
            :params="options[currentScreen].params"></BTClock>
    </div>
</template>


<style lang="scss" scoped>


.widget-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #000;
    overflow: hidden;
    padding: 0px;
    border-radius: 5px;
}
</style>