class ColorConsole {
  log() {}
}

class RedConsole extends ColorConsole {
  log(str) {
    console.log('\x1b[31m', str)
  }
}

class GreenConsole extends ColorConsole {
  log(str) {
    console.log('\x1b[32m', str)
  }
}

class BlueConsole extends ColorConsole {
  log(str) {
    console.log('\x1b[34m', str)
  }
}

function createColorConsole(color) {
  switch (color) {
    case 'red':
      return new RedConsole()
    case 'green':
      return new GreenConsole()
    case 'blue':
      return new BlueConsole()
    default:
      throw new Error('invalid color')
  }
}

const colorConsole = createColorConsole(process.argv[2])

colorConsole.log(process.argv[3])
