/**
 * 怎么优化？怎么度量？首屏事件怎么计算？
 * first contentful paint
 * let timing = performance。timing
 * timing.domContentLoadedEventEnd - timing.fetchStart
 * 白屏时间：输入url到展示第一个dom是白屏时间
 * timing.domInteractive - timing.fetchStart
 * 
 */