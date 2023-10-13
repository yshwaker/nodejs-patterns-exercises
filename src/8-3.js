import styles from 'ansi-styles'

const colorConsole = (console) => {
  console.red = (...args) => {
    console.log(`${styles.red.open}${args.join(' ')}${styles.red.close}`)
  }

  console.green = (...args) => {
    console.log(`${styles.green.open}${args.join(' ')}${styles.green.close}`)
  }

  console.yellow = (...args) => {
    console.log(`${styles.yellow.open}${args.join(' ')}${styles.yellow.close}`)
  }
}

colorConsole(console)

console.green('hello', new Date())
