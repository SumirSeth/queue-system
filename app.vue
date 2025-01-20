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
    <Icon class="absolute top-3 right-3 hover:cursor-help size-8"  name="carbon:information-square-filled" @click="tooltip = !tooltip" v-if="!intro"/>
    <div v-if="tooltip" class="absolute z-50 flex flex-col h-screen w-screen items-center justify-center backdrop-blur-xl brightness-125">
      <button>
      <Icon name="line-md:close-circle-filled" class="fixed top-3 right-6 size-8" @click="tooltip = !tooltip" />
      </button>
      <div class="w-11/12 shadow-2xl">
      <p class="text-2xl md:text-3xl">This project is a visualisation of a queue system using Redis as the backend. The Redis implementation is custom and does not use any external libraries.</p>
      <br>
      <p class="text-base md:text-xl"><span class="underline">Bundle:</span> The term bundle is used to refer to 'tasks' that are added to the queue system. A bundle can be a single task or a group of tasks depending upon the actual implementation.</p>
      <p class="text-base md:text-xl"><span class="underline">Redis Like Backend</span>:
        The backend of this project mimics Redis functionality by providing endpoints for basic queue operations. The backend ensures that tasks are managed in FIFO (First In, First Out) order, reflecting the standard behavior of a queue.
      </p>
      <p class="text-base md:text-xl"><span class="underline">API Endpoints</span>:
        <code class="bg-gray-950 font-mono text-sm md:text-base"><br>POST /api/queue/add</code> : Add a task to the queue.
        <ul class="list-disc ml-4 text-sm md:text-base">
        <li>Request Body:<br><code>{ taskId: string, taskData: string }</code></li>
        <li>Response:<br><code>{ status: number, message: string }</code></li>
        </ul>

        <code class="bg-gray-950 font-mono text-sm md:text-base"><br>GET /api/queue/fetch</code> : Fetch all tasks from the queue.
        <ul class="list-disc ml-4 text-sm md:text-base">
        <li>Response:<br><code>{ status: number, message: string, tasks: [{ taskId: string, taskData: string }], oldestTask: { taskId: string, taskData: string }, queueSize: number }</code></li>
        </ul>
        <code class="bg-gray-950 font-mono text-sm md:text-base"><br>POST /api/queue/process</code> : Process tasks from the queue.
        <ul class="list-disc ml-4 text-sm md:text-base">
        <li>Request Body:<br><code>{ batchSize: number }</code></li>
        <li>Response:<br><code>{ status: number, message: string, processedTasks: [{ taskId: string, taskData: string }] }</code></li>
        </ul>
        <code class="bg-gray-950 font-mono text-sm md:text-base"><br>GET /api/health</code> : Quick status of the queue system.
        <ul class="list-disc ml-4 text-sm md:text-base">
        <li>Response:<br><code>{ status: number, message: string, data: { taskCount: number, message: string, redisConnectionStatus: boolean }, error?: Error }</code></li>
        </ul>
        <code class="bg-gray-950 font-mono text-sm md:text-base"><br>GET /api/queue/clear</code> : Clear the queue.
        <ul class="list-disc ml-4 text-sm md:text-base">
        <li>Response:<br><code>{ status: number, message: string }</code></li>
        </ul>
      </p>
      </div>
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
      <div key="main" v-else class="flex flex-col items-center justify-center">
        <div class="flex flex-col items-center justify-center p-4 pt-10">
          <p class="text-5xl font-bold">Queue System</p>
          <p class="text-2xl font-thin">with custom Redis Implementation</p>
        </div>
      

          <div class="flex flex-col items-center justify-center min-h-[75vh] lg:w-5/6 w-9/12">

            <div class="w-full h-[200px] mx-auto my-8 relative bg-[#1a1a1a] rounded-xl shadow-2xl">
              <!-- Left Gear -->
              <div :class="['absolute w-[60px] h-[60px] bg-transparent rounded-full top-1/3 -left-[35px] z-10 opacity-60', `${psing? 'animate-spin': ''}`]">
                <Icon name="mynaui:wheel-solid" class="w-16 h-16" />
              </div>
              
              <!-- Scrollable Container -->
              <div class="sc overflow-x-auto h-full rounded-xl">
                <!-- Track with Tasks -->
                <div 
                  :class="['h-full bg-[repeating-linear-gradient(45deg,#2a2a2a_0px,#2a2a2a_10px,#333_10px,#333_20px)]' , `${psing? 'animate-moveBelt': ''}`, 'relative']"
                  :style="{
                    width: `${tasks.length * (containerWidth>740? 140 : 110)}px`,
                    minWidth: '100%'
                  }"
                >
                  <TransitionGroup
                    name="task"
                    tag="div"
                    :css="true"
                    mode="out-in"
                  >
                    <div 
                      v-for="(task, index) in tasks" 
                      :key="task.key" 
                      :style="{
                        left: `${index * (containerWidth>740? 140 : 110)}px`
                      }"
                      class="absolute top-1/4 bg-blue-600 text-white lg:text-xl text-sm p-4 rounded-lg lg:w-28 lg:h-28 text-center shadow-lg flex justify-center items-center"
                    >
                      Bundle {{ task.key }}
                    </div>
                  </TransitionGroup>
                </div>
              </div>
              
              <!-- Right Gear -->
              <div :class="['absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] bg-transparent rounded-full top-1/3 -right-[20px] md:-right-[30px] z-10 opacity-60', `${psing? 'animate-spin': ''}`]">
                <Icon name="mynaui:wheel-solid" class="w-12 md:w-16 h-12 md:h-16" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              <div>
                <div class="flex flex-wrap justify-center md:justify-start">
                  <B text="Add Bundle" @click="addTask" />
                  <B text="Clear Queue" @click="clearQueue" bg="bg-red-500" />
                </div>
                <div class="flex flex-col items-center md:items-start">
                  <Button class="px-4 py-2 m-2 rounded-md bg-green-400 text-black disabled:bg-slate-400 disabled:text-gray-700 disabled:cursor-not-allowed" @click="processTasks()" :loading="psing" :disabled="queueSize === 0"><Icon v-if="psing && !allpsing" name="line-md:loading-alt-loop" class="w-6 h-6" /> Process Bundle</Button>
                  <label for="batchSize" class="sr-only">Batch Size</label>
                  <input 
                    id="batchSize" 
                    placeholder="No of Bundles to process" 
                    type="number" 
                    v-model="batchSize" 
                    class="w-full md:w-auto border border-gray-400 rounded-md p-2 bg-gray-950 text-sm md:text-base my-2" 
                  />
                </div>
                <div class="text-center md:text-left">
                  <Button class="px-4 py-2 m-2 rounded-md bg-yellow-400 text-black disabled:bg-slate-400 disabled:text-gray-700 disabled:cursor-not-allowed" @click="processAllTasks()" :loading="psing" :disabled="queueSize === 0"><Icon v-if="psing && allpsing" name="line-md:loading-alt-loop" class="w-6 h-6" /> Process All Bundle</Button>
                </div>
              </div>
              
              <div class="mt-4 md:mt-0">
                <div class="bg-gray-900 rounded-lg p-3 md:p-4 w-full">
                  <p class="text-xl md:text-2xl text-center font-bold mb-2">Queue Health</p>
                  <div class="space-y-1 text-sm md:text-base">
                    <p>Queue Size: {{ queueSize }}</p>
                    <p v-if="queueSize!=0">Oldest Task: Bundle {{ oldestTask?.taskId }}</p>
                    <p v-else>Oldest Task: None</p>
                    <p class="opacity-40 text-xs md:text-sm">(First Preference is given to oldest task. (FIFO))</p>
                    <p>Status: {{ healthStatus.message }}</p>
                    <p>Redis Connection Status: {{ healthStatus?.redisConnectionStatus ? 'Connected' : 'Disconnected' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

       

      </div>
    </Transition>
    <!-- End of Intro section -->







  </div>
</template>


<script setup lang="ts">
const containerWidth = ref(0)

const psing = ref(false)
const allpsing = ref(false)
const count = ref(0)
const intro = ref(true)
const tooltip = ref(false)

onMounted(() => {
  setTimeout(() => {
    intro.value = false
  }, 3500)
  fetchTasks()
  healthCheck()
  containerWidth.value = window.innerWidth
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
};
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
    taskId: count.value,
    taskData: `Sample Data with id: ${count.value}`
  }
  try {
    await $fetch('/api/queue/add', {
      method: 'POST',
      body: taskData
    })
    fetchTasks()
    healthCheck()
    count.value++
  } catch (error) {
    console.error(error)
  }
}

//process tasks
const processTasks = async () => {
  try {
      psing.value = true
      console.log("process tasks")
      const response = await $fetch('/api/queue/process', {
        method: 'POST',
        body: {
          batchSize: batchSize.value
        }
      })
      fetchTasks()
      healthCheck()
      psing.value = false
    
  } catch (error) {
    console.error(error)
  }
}

const processAllTasksBackend = async () => {
  try {
      const response = await $fetch('/api/queue/process', {
        method: 'POST',
        body: {
          // batchSize: batchSize.value
          batchSize: 1
        }
      })
      await fetchTasks()
      await healthCheck()
    
  } catch (error) {
    console.error(error)
  }
}


const processAllTasks = async () => {
  try {
    psing.value = true
    allpsing.value = true
    while (queueSize.value > 0) {
      console.log('processing all tasks')
      await new Promise(resolve => setTimeout(resolve, 2500));
      await processAllTasksBackend()
    }
    psing.value = false
    allpsing.value = false
  } catch (error) {
    console.error('Failed to process all tasks:', error);
  }
}

// health check
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
    console.log(error)
  }
}

//clear queue
const clearQueue = async () => {
  try {
    await $fetch('/api/queue/clear', {
      method: 'GET'
    })
    fetchTasks()
    healthCheck()
  } catch (error) {
    console.error(error)
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
.sc::-webkit-scrollbar {
  display: none;
  width: 0px;
}

.sc::-webkit-scrollbar-track {
  background: transparent;
  width: 0px;
}

.sc::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 3px;
}


</style>

<style>
* {
  @keyframes moveBelt {
    from { background-position: 0 0; }
    to { background-position: -200px 0; }
  }

  body::-webkit-scrollbar {
    width: 6px;
  }

  body::-webkit-scrollbar-track {
    background: #000000;
  }

  body::-webkit-scrollbar-thumb {
    background: #313131;
    border-radius: 3px;
  }
}

@keyframes slideFromRight {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.task-enter-active {
  animation: slideFromRight 0.5s ease-out forwards;
}

.task-enter-from {
  position: absolute;
  right: -100%;
  opacity: 0;
}

.task-enter-to {
  position: absolute;
  opacity: 1;
}

.task-move {
  transition: all 0.5s ease-out;
}

.task-leave-active {
  transition: all 0.5s ease-in;
  position: absolute;
}

.task-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

body::-webkit-scrollbar {
  width: 6px;
}
</style>