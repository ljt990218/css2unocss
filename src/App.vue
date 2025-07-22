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
