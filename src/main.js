import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/assets/base.css';
import '@/assets/index.css';

const app = createApp(App);

app.directive('focus', {
    mounted (el) {
        el.focus();
    },
    updated (el, binding) {
        if (binding.value) {
            el.focus();
        }
    }
});

app.use(store).use(router).mount('#app');