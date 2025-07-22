<script setup vapor lang="ts">
import { ref } from 'vue'
import { toUnocssClass } from './utils/index.js'

const inputText = ref(`width: 470rpx; height: 172rpx; background: #FFFFFF; border-radius: 16rpx; `)
const outputText = ref([]) as any
const removeUnit = ref('rpx')

const handleInput = () => {
  const removePxVal = removeUnit.value === 'px'
  const removeRpxVal = removeUnit.value === 'rpx'
  outputText.value = toUnocssClass(inputText.value, false, false, removeRpxVal, removePxVal)[0]

  // 复制 outputText
  navigator.clipboard.writeText(outputText.value)
}

handleInput()
</script>

<template>
  <div class="fixed top-4 right-4">
    <a href="https://github.com/ljt990218/css2unocss" target="_blank">
      <svg height="32" aria-hidden="true" viewBox="0 0 24 24" version="1.1" width="32" data-view-component="true"
        class="github-icon octicon octicon-mark-github v-align-middle">
        <path
          d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z">
        </path>
      </svg>
    </a>
  </div>

  <h2>
    CSS 转 Unocss
  </h2>
  <h3>
    w-100 === w-100px or w-100rpx
  </h3>
  <!-- 是否开启去掉单位（单选） -->
  <div class="flex items-center gap-2">
    <input type="radio" id="removePx" value="px" v-model="removeUnit" name="removeUnit" />
    <label for="removePx">去掉 px 单位</label>
    <input type="radio" id="removeRpx" value="rpx" v-model="removeUnit" name="removeUnit" />
    <label for="removeRpx">去掉 rpx 单位</label>
    <span class="text-sm">（输出的结果自动复制到剪贴板）</span>
  </div>

  <div class="w-60vw h-full flex gap-4 mt-2">
    <textarea class="w-1/2 p-4" name="" id="" cols="30" rows="10" @input="handleInput" v-model="inputText" />
    <div class="border border-solid border-gray-300 rounded-md p-4 w-1/2">
      {{ outputText }}
    </div>
  </div>
</template>
