<template>
    <div class="container-lg">
        <h1>Page Not Found</h1>
        <div>
            Click 
            <span class="link-btn" 
                  @click="$router.push('/')">
                here
            </span>
            to go to profile page.
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.link-btn {
    cursor: pointer;
    color: blue;
}

.link-btn:hover {
    text-decoration: underline;
    color: black;
}
</style>