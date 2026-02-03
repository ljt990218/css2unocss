<script setup vapor lang="ts">
import { ref } from 'vue'
import { toUnocssClass } from './utils/index.js'

const inputText = ref(`width: 470rpx; height: 172rpx; background: #FFFFFF; border-radius: 16rpx; `)
const outputText = ref([]) as any
const removeUnit = ref('rpx')
const copied = ref(false)

// 首次进入不复制到剪贴板
const isFirstLoad = ref(true)

const handleInput = () => {
  const removePxVal = removeUnit.value === 'px'
  const removeRpxVal = removeUnit.value === 'rpx'
  outputText.value = toUnocssClass(inputText.value, false, false, removeRpxVal, removePxVal)[0]

  // 首次进入时不复制，后续交互才复制
  if (isFirstLoad.value) {
    isFirstLoad.value = false
    return
  }

  copyToClipboard()
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(outputText.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

// 首次进入时计算一次，方便预览，但不复制
handleInput()
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Header -->
    <header class="border-b border-slate-200 bg-white">
      <div class="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900">CSS to UnoCSS</h1>
          <p class="text-sm text-slate-600 mt-1">将 CSS 样式转换为 UnoCSS 工具类</p>
        </div>
        <a
          href="https://github.com/ljt990218/css2unocss"
          target="_blank"
          rel="noopener noreferrer"
          class="text-slate-600 hover:text-slate-900 transition-colors duration-200 cursor-pointer"
          aria-label="在 GitHub 上查看项目"
        >
          <svg height="32" viewBox="0 0 24 24" width="32" fill="currentColor">
            <path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"></path>
          </svg>
        </a>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
      <!-- Options -->
      <div class="bg-white rounded-lg border border-slate-200 p-6 mb-6">
        <h2 class="text-sm font-medium text-slate-900 mb-3">单位转换选项</h2>
        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              id="removePx"
              value="px"
              v-model="removeUnit"
              name="removeUnit"
              class="w-4 h-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-sm text-slate-700">去掉 px 单位</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              id="removeRpx"
              value="rpx"
              v-model="removeUnit"
              name="removeUnit"
              class="w-4 h-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-sm text-slate-700">去掉 rpx 单位</span>
          </label>
        </div>
        <p class="text-xs text-slate-500 mt-3">
          示例：w-100 将转换为 w-100px 或 w-100rpx
        </p>
      </div>

      <!-- Converter -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Input -->
        <div class="flex flex-col">
          <label class="text-sm font-medium text-slate-900 mb-2">CSS 输入</label>
          <textarea
            v-model="inputText"
            @input="handleInput"
            class="flex-1 min-h-96 p-4 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-shadow duration-200"
            placeholder="粘贴你的 CSS 代码..."
            aria-label="CSS 输入框"
          />
        </div>

        <!-- Output -->
        <div class="flex flex-col">
          <div class="flex items-center mb-2">
            <label class="text-sm font-medium text-slate-900">UnoCSS 输出</label>
            <button
              @click="copyToClipboard"
              class="flex items-center ml-2 gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="复制到剪贴板"
            >
              <svg
                v-if="!copied"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4 text-green-600"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <span :class="{ 'text-green-600': copied }">{{ copied ? '已复制' : '复制' }}</span>
            </button>
          </div>
          <div
            class="flex-1 min-h-96 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-mono overflow-auto"
            role="region"
            aria-label="UnoCSS 输出结果"
          >
            {{ outputText }}
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 bg-white mt-auto">
      <div class="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-slate-600">
        自动复制输出结果到剪贴板
      </div>
    </footer>
  </div>
</template>
