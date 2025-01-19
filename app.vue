<template>
  <Link rel="icon" href="/favicon.png" />
  <Title>Queue System</Title>
  <Meta name="description" content="Queue System with custom Redis Implementation" />

  <div class="bg-black min-h-screen text-white font-[Geist]">
    <Icon class="fixed top-3 right-3 hover:cursor-help size-8"  name="carbon:information-square-filled" @click="tooltip = !tooltip" v-if="!intro"/>
    <div v-if="tooltip" class="fixed flex flex-col h-screen w-screen items-center justify-center backdrop-blur-lg text-white rounded-md p-2 text-sm">
      <button>
        <Icon name="line-md:close-circle-filled" class="fixed top-3 right-6 size-9" @click="tooltip = !tooltip" />
      </button>
      <p class="text-xl shadow-xl">This project is a visualisation of a queue system using Redis as the backend. The redis implementation is custom and does not use any external libraries.</p>
      <p class="text-xl shadow-xl"></p>
    </div>
    <Transition name="fade">
      <div class="flex flex-col items-center justify-center h-screen" v-if="intro">
        <h1 class="text-6xl font-bold">
          <TextGenerateEffect words="Queue System" :duration=0.5 :delay=500 class=""/>
        </h1>
        <p class="text-xl">
          <TextGenerateEffect words="A backend visualised by frontend project." :duration=0.1 :delay=1000 :filter=false class="" />
        </p>
      </div>

      <div v-else class="flex flex-col items-center justify-center">
        <p class="text-5xl font-thin">Queue System with custom Redis Implementation</p>
      </div>

    </Transition>


    <div class="gap-2 grid grid-cols-2 items-center justify-center place-items-center h-screen">
      <div>
        <button @click="getAllTasks" class="bg-white p-2 text-black rounded-md">Get All Tasks</button>
        <p>Queue Tasks:</p>
        <p v-for="task in tasks" :key="task.key">
          {{ task.key }} - {{ task.data }}
          <br>
        </p>
      </div>
      <div class="flex flex-col">
        <button @click="addTask" class="bg-white p-2 text-black rounded-md">Add Task</button>
        <input v-model="taskId" type="text" placeholder="Task ID" class="bg-gray-950">
        <input v-model="taskData" type="text" placeholder="Task Data" class="bg-gray-950">
      </div>
    </div>



  </div>
</template>


<script setup lang="ts">

const intro = ref(true)
const tooltip = ref(false)

onMounted(() => {
  setTimeout(() => {
    intro.value = false
  }, 3500)
})

const tasks = ref()

const getAllTasks = async () => {
  const response = await fetch('api/queue/fetch')
  const data = await response.json()
  tasks.value = data.tasks
}

const taskId = ref()
const taskData = ref()

const addTask = async () => {
  const response = await fetch('api/queue/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      taskId: taskId.value,
      taskData: taskData.value,
    })
  })
}

</script>




<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>