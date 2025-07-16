# css2unocss-unpx-unrpx

### 去掉转化后的 px rpx 
### 保持 w-100 === w-100px === w-100rpx

#### 🎯 去掉 px :
```
toUnocssClass(css, false, false, false, true)
```

#### 🎯 去掉 rpx :
```
toUnocssClass(css, false, false, true, false)
```

#### 🚁 本项目基于以下开源项目：
[Simon-He95](https://github.com/Simon-He95) - [transform-to-unocss-core](https://github.com/Simon-He95/transform-to-unocss-core) - CSS transformation core
