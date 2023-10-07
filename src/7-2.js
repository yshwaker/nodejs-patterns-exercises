import https from 'https'

class HttpRequestBuilder {
  setMethod(method) {
    this.method = method
    return this
  }

  setURL(url) {
    this.url = new URL(url)
    return this
  }

  setQuery(query) {
    Object.entries(query).forEach(([key, value]) => {
      this.url.searchParams.append(key, value)
    })
    return this
  }

  setHeaders(headers) {
    this.headers = headers
    return this
  }

  setBody(body) {
    this.body = JSON.stringify(body)
    return this
  }

  invoke() {
    return new Promise((resolve, reject) => {
      const request = https.request(
        this.url,
        {
          method: this.method,
          headers: this.headers,
        },
        (res) => {
          let data = ''
          // Process the response data as it comes in
          res.on('data', (chunk) => {
            data += chunk
          })

          // When the entire response has been received
          res.on('end', () => {
            if (res.headers['content-type'] === 'application/json') {
              data = JSON.parse(data)
            }
            resolve(data)
          })

          res.on('error', reject)
        }
      )

      if (this.body !== undefined) {
        request.write(this.body)
      }

      request.end()
    })
  }
}

new HttpRequestBuilder()
  .setMethod('GET')
  .setURL('https://www.google.com/search')
  .setQuery({ q: 'test' })
  .invoke()
  .then((res) => {
    console.log('REQUEST finished', res)
  })
