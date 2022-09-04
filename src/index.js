import './css/index.css'
import './css/index.less'
import './css/index.sass'
import './css/index.scss'
import './css/index.styl'
import './css/iconfont.css'
import sum from './js/sum'

console.log(sum(1, 5))

const getSum = (arr) => {
    return arr.reduce((a, b) => {
        return a + b
    }, 0)
}
console.log(getSum([111, 121]))

if (module.hot) {
    module.hot.accept('./js/sum')
}