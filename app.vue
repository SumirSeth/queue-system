<template>

  <!-- Meta section -->
  <Link rel="icon" href="/favicon.png" />
  <Title>Queue System</Title>
  <Meta name="description" content="Queue System with custom Redis Implementation" />
  <Body class="bg-black text-white font-[Geist]"/>
  <!-- End of Meta section -->


  <!-- Main div -->
  <div class="bg-black min-h-screen text-white">

    <!--FIXED BLOCKS:  Icons - Help and Close with Tooltip -->
    <Icon class="fixed top-3 right-3 hover:cursor-help size-8"  name="carbon:information-square-filled" @click="tooltip = !tooltip" v-if="!intro"/>
    <div v-if="tooltip" class="fixed flex flex-col h-screen w-screen items-center justify-center backdrop-blur-lg">
      <button>
        <Icon name="line-md:close-circle-filled" class="fixed top-3 right-6 size-8" @click="tooltip = !tooltip" />
      </button>
      <p class="text-xl shadow-xl">This project is a visualisation of a queue system using Redis as the backend. The Redis implementation is custom and does not use any external libraries.</p>
      <br>
      <p class="text-lg shadow-xl"><span class="underline">Bundle:</span> The term bundle is used to refer to 'tasks' that are added to the queue system. A bundle can be a single task or a group of tasks. Though, this functionality is not exposed to the frontend here.</p>
    </div>
    <!-- FIXED BLOCKS:  End of Icons - Help and Close with Tooltip -->


    <!-- Intro section -->
    <Transition name="fade" mode="out-in">
      <div key="intro" class="flex flex-col items-center justify-center h-screen" v-if="intro">
        <h1 class="text-6xl font-bold">
          <ClientOnly>
            <TextGenerateEffect words="Queue System" :duration=0.5 :delay=500 class=""/>
          </ClientOnly>
        </h1>
        <p class="text-xl">
          <ClientOnly>
            <TextGenerateEffect words="A backend visualised by frontend project." :duration=0.1 :delay=1000 :filter=false class="" />
          </ClientOnly>
        </p>
      </div>
      <div key="main" v-else class="">
        <div class="flex flex-col items-center justify-center p-4">
          <p class="text-5xl font-bold">Queue System</p>
          <p class="text-2xl font-thin">with custom Redis Implementation</p>
        </div>
        <div>
          <B text="Add Bundle" />
          <!-- fetch tasks from api does not need a button -->
          <B text="Process Bundle" bg="bg-green-400" />
          <B text="Health Check" />
          <B text="Clear Queue" />
          <B text="stats" />
        </div>
      </div>
    </Transition>
    <!-- End of Intro section -->







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

//main logic
const tasks = ref<{ key: string; data: any; }[]>([])
const queueSize = ref(0)
const oldestTask = ref()
const batchSize = ref()

type healthStatus = {
  status: number,
  message: string,
  data: {
    taskCount: number,
    message: string,
    redisConnectionStatus: boolean
  },
  error?: Error
}
const healthStatus = ref()

//fetch tasks
const fetchTasks = async () => {
  try {
    const response = await $fetch<{ success: boolean; tasks: { key: string; data: any; }[]; oldestTask: { taskId: string; taskData: string; }; queueSize: number; }>('/api/queue/fetch')
    tasks.value = (response.tasks || []).map(task => ({ key: task.key, data: task.data }))
    queueSize.value = response.queueSize
    oldestTask.value = response.oldestTask
  } catch (error) {
    console.error(error)
  }
}


//add task
const addTask = async () => {
  const taskData = {
    taskId: Date.now().toString(),
    taskData: `This is a task with id ${Date.now().toString()}`
  }
  try {
    await $fetch('/api/queue/add', {
      method: 'POST',
      body: taskData
    })
    fetchTasks()
  } catch (error) {
    console.error(error)
  }
}

//process tasks
const processTasks = async () => {
  try {
    const response = await $fetch('/api/queue/process', {
      method: 'POST',
      body: {
        batchSize: batchSize.value
      }
    })
    fetchTasks()
  } catch (error) {
    console.error(error)
  }
}

const healthCheck = async () => {
  try {
    const response = await $fetch('/api/health')
    if (response.status !== 200) {
      console.error(response.message)
      healthStatus.value.error = new Error(response.message)
      return
    }
    healthStatus.value = response.data

  } catch (error) {
    
  }
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
.fade-enter-to,
.fade-leave-from {
  transition: opacity 0.5s ease;
  opacity: 1;
}

.fade-move {
  transition: transform 0.5s ease;
}
</style>

<style>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #000000;
}

::-webkit-scrollbar-thumb {
  background: #313131;
  border-radius: 3px;
}
</style>